import { parseCountryInformation } from './data.js';
import { getPathForFavoriteState } from './sidebar/favorite.js';

export class Card {
  cardUI = undefined;

  constructor(renderUI) {
    this.cardUI = renderUI;
    this.counterID = 0;
  }

  renderCountry(countryData, weatherInfo) {
    const parsedData = parseCountryInformation(countryData, weatherInfo);
    console.log(parsedData);

    const countryCard = this.createCardForCountry(parsedData);

    this.cardUI.insertAdjacentHTML('beforeend', countryCard);
  }

  createCardForCountry(country) {
    this.counterID++;

    const imgElement = `<img src="${country.flag}" alt="${country.name}" class="flag"/>`;
    const mapsLink = `<h3>Map: <a href="${country.mapCoordLink}" style="text-decoration: none; color: blue;">Google Maps</a></h3>`;
    const favoriteIconPath = getPathForFavoriteState(country.name);

    return `
        <div class="card" id="id-${this.counterID}">
            <figure class="img-box">
              ${imgElement}
            </figure>
            <div class="country-main-info">
              <h2>${country.name}</h2>
              <h4>${country.formattedTime}</h4>
            </div>
            <section class="weather-info">
              <h2>${country.current_temp}${country.temp_unit}</h2>
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
                  <h2>Earth</h2>
                </div>
            </section>
            <section class="card-text infoR">
                <div class="extra-info">
                  <h4>CURRENCY</h4>
                  <h2>${country.currency}</h2>
                </div>
                <div class="extra-info">
                  <h4>POPULATION</h4>
                  <h2>${country.population}</h2>
                </div>
                <div class="extra-info">
                  <h4>MAPS</h4>
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
