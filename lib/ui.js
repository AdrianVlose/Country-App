import {
  extractCountryCoords,
  getWeatherInformationForCountry,
  searchForCountry,
} from './data.js';
import { Card } from './countryCard.js';
import { changeFavoriteState, getFavoritesList } from './sidebar/favorite.js';
import { showListInPage } from './sidebar/sidebarUI.js';
import { getHistoryList, updateHistoryList } from './sidebar/history.js';

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

    this.cardUI = new Card(cardBoxElement);
    this.updateListsFromSidebar();
  }

  bindEvents() {
    this.buttonElement.addEventListener('click', () => {
      this.searchHandler(true, '');
    });
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
    try {
      countryData = await searchForCountry(searchValue);
      this.cardBoxElement.innerHTML = '';
      updateHistoryList(searchValue);

      countryData.forEach(async (country) => {
        const countryCoords = extractCountryCoords(country);
        const weatherInfo = await getWeatherInformationForCountry(
          countryCoords.latitude,
          countryCoords.longitude,
        );

        this.cardUI.renderCountry(country, weatherInfo);
        const cardID = this.cardUI.getCounterID();
        const favoriteID = `favorite-${cardID}`;
        this.favoriteIconHandler(favoriteID);
      });

      this.updateListsFromSidebar();
    } catch (error) {
      console.error(error);
      const errorText = document.createElement('h3');
      errorText.textContent = error.message;
      errorText.style.color = 'red';
      errorText.style.textAlign = 'center';
      this.cardBoxElement.appendChild(errorText);
      return;
    }
  }

  favoriteIconHandler(iconID) {
    const favoriteIcon = document.getElementById(iconID);
    favoriteIcon.addEventListener('click', (event) => {
      const card = favoriteIcon.closest('.card');
      const countryName = card.querySelector('h2').textContent;
      changeFavoriteState(countryName, event.target);
      this.updateListsFromSidebar();
    });
  }

  updateListsFromSidebar() {
    const favoritesList = getFavoritesList();
    const historyList = getHistoryList();

    showListInPage(this.favoritesListElement, favoritesList);
    showListInPage(this.historyListElement, historyList);

    const searchTextElements = this.historyListElement.querySelectorAll('h3');

    searchTextElements.forEach((searchTextElement) => {
      const searchText = searchTextElement.textContent;
      searchTextElement.addEventListener('click', () => {
        this.searchHandler(false, searchText);
      });
    });
  }
}
