import {
  addCountryToFavorite,
  getFavoritesList,
  getPathForFavoriteState,
  isCountryInFavoriteList,
  removeCountryFromFavorite,
} from './sidebar/favorite.js';
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
