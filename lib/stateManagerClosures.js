import {
  addCountryToFavorite,
  getFavoritesList,
  getPathForFavoriteState,
  isCountryInFavoriteList,
  removeCountryFromFavorite,
} from './sidebar/favorite.js';
import { updateHistoryList, getHistoryList } from './sidebar/history.js';
import { showListInPage } from './sidebar/sidebarUI.js';

export function favoriteIconCallback(iconID, countryNameParam) {
  const iconElement = document.querySelector(`#${iconID}`);
  const countryName = countryNameParam;
  function favoriteCallback(recentCountryFromFavorite) {
    if (recentCountryFromFavorite === countryName) {
      iconElement.src = getPathForFavoriteState(recentCountryFromFavorite);
    }
  }

  return favoriteCallback;
}

export function favoritesListCallback() {
  const favoritesListElement = document.querySelector('#favorites-list');

  function favoritesListUpdate(newCountryForFavorites) {
    const isAlreadyInFavoriteLists = isCountryInFavoriteList(
      newCountryForFavorites,
    );

    if (isAlreadyInFavoriteLists) {
      removeCountryFromFavorite(newCountryForFavorites);
    } else {
      addCountryToFavorite(newCountryForFavorites);
    }

    const currentFavoritesList = getFavoritesList();
    showListInPage(favoritesListElement, currentFavoritesList);
  }

  return favoritesListUpdate;
}

export function historyListClosure() {
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
