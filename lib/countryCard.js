import { parseCountryInformation } from './data.js';
import { getPathForFavoriteState } from './sidebar/favorite.js';

export class Card {
  cardUI = undefined;

  constructor(renderUI) {
    this.cardUI = renderUI;
    this.counterID = 0;
  }

  renderCountry(countryData) {
    const countryCard = this.createCardForCountry(countryData);

    this.cardUI.insertAdjacentHTML('beforeend', countryCard);
  }

  createCardForCountry(country) {
    this.counterID++;

    const imgElement = `<img src="${country.flag}" alt="${country.name}" class="flag"/>`;
    const mapsLink = `<h2><a href="${country.mapCoordLink}" style="text-decoration: none;">Google Maps</a></h2>`;
    const favoriteIconPath = getPathForFavoriteState(country.name);
    const theme = country.isDay ? 'light' : 'dark';
    let continentsElementString = '';
    country.continents.forEach((continent) => {
      continentsElementString += `<h2>${continent}</h2>`;
    });
    const weather_icon_path = country.isDay
      ? '../assets/day.svg'
      : '../assets/night.svg';
    const weather_icon = `<img src="${weather_icon_path}" alt="weather icon" />`;

    return `
        <div class="card ${theme}" id="id-${this.counterID}">
            <figure class="img-box">
              ${imgElement}
            </figure>
            <div class="country-main-info">
              <h2 id="country-name">${country.name}</h2>
              <h4>${country.formattedTime}</h4>
            </div>
            <section class="weather-info">
              <h2>${weather_icon} ${country.current_temp}${country.temp_unit}</h2>
              <h4>Feels like ${country.felt_temp}${country.temp_unit}</h4>
            </section>
            <section class="card-text infoL">
                <div class="extra-info">
                  <h4>LANGUAGE</h4>
                  <h2>${country.language}</h2>
                </div>
                <div class="extra-info">
                  <h4>CAPITAL</h4>
                  <h2>${country.capital}</h2>
                </div>
                <div class="extra-info">
                  <h4>REGION</h4>
                  <h2>${country.region}</h2>
                </div>
                <div class="extra-info">
                  <h4>Continents</h4>
                  ${continentsElementString}
                </div>
            </section>
            <section class="card-text infoR">
                <div class="extra-info">
                  <h4>CURRENCY</h4>
                  <h2>${country.currency} (${country.symbol})</h2>
                </div>
                <div class="extra-info">
                  <h4>POPULATION</h4>
                  <h2>${country.population}</h2>
                </div>
                <div class="extra-info">
                  <h4>SUBREGION</h4>
                  <h2>${country.subregion}</h2>
                </div>
                <div class="extra-info">
                  <h4>MAPS</h4>
                  ${mapsLink}
                </div>
            </section>
            <img src="${favoriteIconPath}" alt="Favorite Icon" class="favorite" id="favorite-${this.counterID}"/>
        </div>
    `;
  }

  getCounterID() {
    return this.counterID;
  }
}
