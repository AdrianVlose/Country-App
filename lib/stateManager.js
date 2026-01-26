import {
  getFavoritesList,
  isCountryInFavoriteList,
} from './sidebar/favorite.js';
import { getHistoryList } from './sidebar/history.js';

export class StateManager {
  constructor() {
    this.listeners = new Map();
    this.data = new Map();

    this.initializeStateManager();
  }

  initializeStateManager() {
    this.initializeData();
    this.initializeListeners();
  }

  initializeData() {
    const countries = [];
    const favoritesList = getFavoritesList();
    const historyList = getHistoryList();

    this.data.set('countries', countries);
    this.data.set('favoritesList', favoritesList);
    this.data.set('historyList', historyList);
  }

  initializeListeners() {
    this.listeners.set('countries', []);
    this.listeners.set('favoritesList', []);
    this.listeners.set('historyList', []);
  }

  subscribe(state, callback) {
    const listenersForThisState = this.listeners.get(state);
    listenersForThisState.push(callback);
    this.listeners.set(state, listenersForThisState);
  }

  unsubscribe(state, element) {
    const oldListenersForThisState = this.listeners.get(state);
    const newListenersForThisState = oldListenersForThisState.filter(
      (listener) => listener !== element,
    );
    this.listeners.set(state, newListenersForThisState);
  }

  dispatch(action, payload) {
    switch (action) {
      case 'update-Countries':
        this.countriesReducer(payload);
        break;
      case 'updateFavoritesList':
        this.favoritesListReducer(payload);
        break;
      default:
        this.historyListReducer(payload);
    }
  }

  countriesReducer(payload) {
    this.data.set('countries', payload);

    const callbacks = this.listeners.get('countries');
    callbacks.forEach((callback) => {
      callback(payload);
    });
  }

  favoritesListReducer(country) {
    let currentFavoritesList = this.data.get('favoritesList');
    const isCountryRemovable = isCountryInFavoriteList(country);
    if (isCountryRemovable) {
      currentFavoritesList = currentFavoritesList.filter(
        (countryEl) => countryEl !== country,
      );
    } else {
      currentFavoritesList.push(country);
    }
    this.data.set('favoritesList', currentFavoritesList);

    const callbacks = this.listeners.get('favoritesList');
    callbacks.forEach((callback) => {
      callback(country);
    });
  }

  historyListReducer(payload) {
    const currentHistoryList = this.data.get('historyList');
    currentHistoryList.unshift(payload);
    this.data.set('historyList', currentHistoryList);

    const callbacks = this.listeners.get('historyList');
    callbacks.forEach((callback) => {
      callback(payload);
    });
  }
}
