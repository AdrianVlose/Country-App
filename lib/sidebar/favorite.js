const FAVORITE_KEY = 'List_With_Favorite_Country_v1';
const FAVORITE_ICON_PATH = '../../assets/fav.svg';
const UNFAVORITE_ICON_PATH = '../../assets/unfav.svg';

export function addCountryToFavorite(countryName) {
  let favoritesList = JSON.parse(localStorage.getItem(FAVORITE_KEY)) || [];

  if (!favoritesList.includes(countryName)) {
    favoritesList.push(countryName);
  }

  localStorage.setItem(FAVORITE_KEY, JSON.stringify(favoritesList));
}

export function removeCountryFromFavorite(countryName) {
  let favoritesList = JSON.parse(localStorage.getItem(FAVORITE_KEY)) || [];

  const favoritesListUpdated = favoritesList.filter(
    (name) => name !== countryName,
  );

  localStorage.setItem(FAVORITE_KEY, JSON.stringify(favoritesListUpdated));
}

export function isCountryInFavoriteList(countryName) {
  let favoritesList = JSON.parse(localStorage.getItem(FAVORITE_KEY)) || [];
  return favoritesList.includes(countryName);
}

export function getPathForFavoriteState(countryName) {
  return isCountryInFavoriteList(countryName)
    ? FAVORITE_ICON_PATH
    : UNFAVORITE_ICON_PATH;
}

export function getFavoritesList() {
  return JSON.parse(localStorage.getItem(FAVORITE_KEY)) || [];
}
