import {
  extractCountryCoords,
  getWeatherInformationForCountry,
  searchForCountry,
  parseCountryInformation,
} from './data.js';
import { Card } from './countryCard.js';
import { getFavoritesList } from './sidebar/favorite.js';
import { changeShowMenuState, showListInPage } from './sidebar/sidebarUI.js';
import { getHistoryList, updateHistoryList } from './sidebar/history.js';
import { PageManager } from './pagination.js';
import { addLoadingState, removeLoadingState } from './loadingStateManager.js';
import { StateManager } from './stateManager.js';
import {
  favoriteIconCallback,
  favoritesListCallback,
} from './stateManagerClosures.js';

export class UI {
  constructor(
    cardBoxElement,
    buttonElement,
    inputElement,
    favoritesListElement,
    historyListElement,
  ) {
    this.cardBoxElement = cardBoxElement;
    this.buttonElement = buttonElement;
    this.inputElement = inputElement;
    this.favoritesListElement = favoritesListElement;
    this.historyListElement = historyListElement;

    this.pageManager = new PageManager();
    this.cardUI = new Card(cardBoxElement);
    this.stateManager = new StateManager();
    this.bindListeners();
    this.renderListsFromSidebar();
  }

  bindListeners() {
    this.stateManager.subscribe('countries', (data) =>
      this.pageManager.updateData(data),
    );

    const favoritesCallback = favoritesListCallback();
    this.stateManager.subscribe('favoritesList', favoritesCallback);

    const historyListCallbackFn = this.historyListClosure().bind(this);
    this.stateManager.subscribe('historyList', historyListCallbackFn);
  }

  bindEvents() {
    this.buttonElement.addEventListener('click', () => {
      this.searchHandler(true, '');
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const inputFieldValue = this.inputElement.value;
        if (inputFieldValue) {
          this.searchHandler(true, '');
        }
      }
    });

    this.bindMenuIcon();
    this.bindArrows();
  }

  async searchHandler(isTextFromInput, textFromHistory) {
    let searchValue = '';
    if (isTextFromInput) {
      const inputFieldValue = this.inputElement.value;
      this.inputElement.value = '';
      searchValue = inputFieldValue;
    }

    searchValue = isTextFromInput ? searchValue : textFromHistory;

    let countryData;
    this.cardBoxElement.innerHTML = '';
    addLoadingState(this.cardBoxElement);
    try {
      countryData = await searchForCountry(searchValue);
      updateHistoryList(searchValue);

      const dataWeatherRequests = countryData.map(async (country) => {
        const countryCoords = extractCountryCoords(country);
        const weatherInfo = await getWeatherInformationForCountry(
          countryCoords.latitude,
          countryCoords.longitude,
        );

        return parseCountryInformation(country, weatherInfo);
      });

      const fullData = await Promise.all(dataWeatherRequests);

      this.stateManager.dispatch('update-Countries', fullData);
      this.stateManager.dispatch('', searchValue);

      removeLoadingState();

      this.displayCountriesHandler(this.pageManager.currentData);
      this.manageDisabledClassOnArrows();
    } catch (error) {
      removeLoadingState();
      console.error(error);
      const errorText = document.createElement('h3');
      errorText.textContent = error.message;
      errorText.style.color = 'red';
      errorText.style.textAlign = 'center';
      this.cardBoxElement.appendChild(errorText);
      return;
    }
  }

  displayCountriesHandler(countriesList) {
    this.cardBoxElement.innerHTML = '';
    const arrowsClass = document.querySelectorAll('.arrow');
    arrowsClass.forEach((arrowClass) => {
      arrowClass.style.opacity = 1;
    });

    countriesList.forEach((country) => {
      this.cardUI.renderCountry(country);
      const cardID = this.cardUI.getCounterID();
      const favoriteID = `favorite-${cardID}`;
      const iconCallback = favoriteIconCallback(favoriteID, country.name);
      this.stateManager.subscribe('favoritesList', iconCallback);
      this.favoriteIconHandler(favoriteID);
    });
  }

  favoriteIconHandler(iconID) {
    const favoriteIcon = document.getElementById(iconID);
    favoriteIcon.addEventListener('click', () => {
      const card = favoriteIcon.closest('.card');
      const countryName = card.querySelector('.country-name').textContent;
      this.stateManager.dispatch('updateFavoritesList', countryName);
    });
  }

  renderListsFromSidebar() {
    const favoritesList = getFavoritesList();
    const historyList = getHistoryList();

    showListInPage(this.favoritesListElement, favoritesList);
    showListInPage(this.historyListElement, historyList);

    const searchTextElements =
      this.historyListElement.querySelectorAll('button');

    searchTextElements.forEach((searchTextElement) => {
      const searchText = searchTextElement.textContent;
      searchTextElement.addEventListener('click', () => {
        this.searchHandler(false, searchText);
      });
    });
  }

  historyListClosure() {
    function historyCallback(textSearched) {
      debugger;
      updateHistoryList(textSearched);
      const historyList = getHistoryList();
      showListInPage(this.historyListElement, historyList);

      const searchTextElements =
        this.historyListElement.querySelectorAll('button');

      searchTextElements.forEach((searchTextElement) => {
        const searchText = searchTextElement.textContent;
        searchTextElement.addEventListener('click', () => {
          this.searchHandler(false, searchText);
        });
      });
    }

    return historyCallback;
  }

  bindArrows() {
    const leftArrow = document.querySelector('#left-arrow');
    const rightArrow = document.querySelector('#right-arrow');

    leftArrow.addEventListener('click', () => {
      this.pageManager.goToPrevPage();
      this.displayCountriesHandler(this.pageManager.currentData);
      this.manageDisabledClassOnArrows();
    });

    rightArrow.addEventListener('click', () => {
      this.pageManager.goToNextPage();
      this.displayCountriesHandler(this.pageManager.currentData);
      this.manageDisabledClassOnArrows();
    });
  }

  manageDisabledClassOnArrows() {
    const leftArrow = document.querySelector('#left-arrow');
    const rightArrow = document.querySelector('#right-arrow');

    const leftDisabledStatus = this.pageManager.isPrevPageIconDisable();
    const rightDisabledStatus = this.pageManager.isNextPageIconDisable();
    const isLeftAlreadyDisabled = leftArrow.classList.contains('disabled');
    const isRightAlreadyDisabled = rightArrow.classList.contains('disabled');

    if (leftDisabledStatus) {
      if (!isLeftAlreadyDisabled) {
        leftArrow.classList.add('disabled');
      }
      leftArrow.style.opacity = 0.1;
    } else {
      if (isLeftAlreadyDisabled) {
        leftArrow.classList.remove('disabled');
        leftArrow.style.opacity = 1;
      }
    }

    if (rightDisabledStatus) {
      if (!isRightAlreadyDisabled) {
        rightArrow.classList.add('disabled');
      }
      rightArrow.style.opacity = 0.1;
    } else {
      if (isRightAlreadyDisabled) {
        rightArrow.classList.remove('disabled');
        rightArrow.style.opacity = 1;
      }
    }
  }

  bindMenuIcon() {
    const menu = document.querySelector('#menu-icon');

    menu.addEventListener('click', () => {
      changeShowMenuState();
    });
  }
}
