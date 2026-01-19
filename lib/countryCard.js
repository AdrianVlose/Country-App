import { parseCountryInformation } from './data.js';
import { getPathForFavoriteState } from './sidebar/favorite.js';

export class Card {
  cardUI = undefined;

  constructor(renderUI) {
    this.cardUI = renderUI;
    this.counterID = 0;
  }

  renderCountry(countryData) {
    const parsedData = parseCountryInformation(countryData);

    const countryCard = this.createCardForCountry(parsedData);

    this.cardUI.insertAdjacentHTML('beforeend', countryCard);
  }

  createCardForCountry(country) {
    this.counterID++;

    const imgElement = `<img src="${country.flag}" alt="${country.name}" style="height: 50%; border-radius: 12px;"/>`;
    const mapsLink = `<h3>Map: <a href="${country.mapCoordLink}" style="text-decoration: none; color: blue;">Google Maps</a></h3>`;
    const favoriteIconPath = getPathForFavoriteState(country.name);

    return `
        <div class="card" id="id-${this.counterID}">
            ${imgElement}
            <div class="card-text">
                <h2>${country.name}</h2>
                <h3>Capital: ${country.capital}</h3>
                <h3>Language: ${country.language}</h3>
                ${mapsLink}
            </div>
            <div class="card-text">
                <h3>Population: ${country.population}</h3>
                <h3>Currency: ${country.currency}</h3>
            </div>
            <img src="${favoriteIconPath}" alt="Favorite Icon" class="favorite" id="favorite-${this.counterID}"/>
        </div>
    `;
  }

  getCounterID() {
    return this.counterID;
  }
}
