import { searchForCountry } from './data.js';
import { Card } from './countryCard.js';
import { changeFavoriteState, getFavoritesList } from './sidebar/favorite.js';
import { renderOptionUI } from './sidebar/optionUI.js';
import { getHistoryList, updateHistoryList } from './sidebar/history.js';

export class UI {
  constructor(
    cardBoxElement,
    buttonElement,
    inputElement,
    favoriteIconElement,
    historyIconElement,
  ) {
    this.cardBoxElement = cardBoxElement;
    this.buttonElement = buttonElement;
    this.inputElement = inputElement;
    this.favoriteIconElement = favoriteIconElement;
    this.historyIconElement = historyIconElement;

    this.cardUI = new Card(cardBoxElement);
  }

  bindEvents() {
    this.buttonElement.addEventListener('click', () => {
      this.searchHandler(true, '');
    });
    this.favoriteIconElement.addEventListener('click', () => {
      const favoritesList = getFavoritesList();
      renderOptionUI(
        'favorites',
        'display-favorites',
        favoritesList,
        'exit-fav',
      );
    });
    this.historyIconElement.addEventListener('click', () => {
      const historyList = getHistoryList();
      renderOptionUI('history', 'display-history', historyList, 'exit-history');

      const historyListBox = document.querySelector('#display-history');
      const searchTextElements = historyListBox.querySelectorAll('h2');

      searchTextElements.forEach((searchTextElement) => {
        const searchText = searchTextElement.textContent;
        searchTextElement.addEventListener('click', () => {
          this.searchHandler(false, searchText);
        });
      });
    });

    this.overlayAndSidebarHandler();
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

      countryData.forEach((country) => {
        this.cardUI.renderCountry(country);
        const cardID = this.cardUI.getCounterID();
        const favoriteID = `favorite-${cardID}`;
        this.favoriteIconHandler(favoriteID);
      });
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
    });
  }

  overlayAndSidebarHandler() {
    const overlayElement = document.querySelector('#overlay');
    const sidebarOptions = document.querySelectorAll('.sidebar');

    overlayElement.addEventListener('click', () => {
      overlayElement.style.display = 'none';
      sidebarOptions.forEach((option) => {
        option.style.display = 'none';
      });
    });
  }
}
