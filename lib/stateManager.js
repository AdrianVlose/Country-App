import { getFavoritesList } from './sidebar/favorite.js';
import { getHistoryList } from './sidebar/history.js';

export class StateManager {
  constructor() {
    this.actions = new Map();
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

  subscribe(state, element) {
    const listenersForThisState = this.listeners.get(state);
    listenersForThisState.push(element);
    this.listeners.set(state, listenersForThisState);
    console.log(`Elementul:`);
    console.log(element);
    console.log(`a dat subscribe la state-ul ${state}`);
  }

  unsubscribe(state, element) {
    const oldListenersForThisState = this.listeners.get(state);
    const newListenersForThisState = oldListenersForThisState.filter(
      (listener) => listener !== element,
    );
    this.listeners.set(state, newListenersForThisState);
    console.log(`Elementul:`);
    console.log(element);
    console.log(`a dat subscribe la state-ul ${state}`);
  }

  dispatch(action, payload, callbackFunction) {
    switch (action) {
      case 'update-Countries':
        this.countriesReducer(payload, callbackFunction);
        break;
      case 'add-FavoritesList':
        this.favoritesListReducer(payload, callbackFunction, false);
        break;
      case 'remove-FavoritesList':
        this.favoritesListReducer(payload, callbackFunction, true);
        break;
      default:
        this.historyListReducer(payload, callbackFunction);
    }
  }

  countriesReducer(payload, callbackFunction) {
    this.data.set('countries', payload);
    callbackFunction(payload);
  }

  favoritesListReducer(payload, callbackFunction, isCountryRemovable) {
    let currentFavoritesList = this.data.get('favoritesList');
    if (isCountryRemovable) {
      currentFavoritesList = currentFavoritesList.filter(
        (country) => country !== payload,
      );
    } else {
      currentFavoritesList.push(payload);
    }
    this.data.set('favoritesList', currentFavoritesList);
    callbackFunction(currentFavoritesList, payload);
  }

  historyListReducer(payload, callbackFunction) {
    const currentHistoryList = this.data.get('historyList');
    currentHistoryList.unshift(payload);
    this.data.set('historyList', currentHistoryList);
    callbackFunction(currentHistoryList, payload);
  }
}
