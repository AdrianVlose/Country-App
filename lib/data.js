export async function searchForCountry(countryName) {
  if (!countryName) {
    throw new Error('Enter a country name');
  }
  try {
    const url = `https://restcountries.com/v3.1/name/${countryName}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Request Failed!');
    }
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Country was not found!');
    }

    const filteredData = data.filter((country) => {
      const countryNameCommon = country?.name?.common || '';
      return countryNameCommon
        .toLowerCase()
        .includes(countryName.toLowerCase());
    });

    if (filteredData.length === 0) {
      throw new Error('No matching countries found!');
    }

    return filteredData;
  } catch (error) {
    throw new Error(error.message);
  }
}

export function parseCountryInformation(countryInformation) {
  const countryName = countryInformation?.name?.common || '-';
  const capitalName =
    countryInformation?.capital &&
    Array.isArray(countryInformation.capital) &&
    countryInformation.capital.length > 0
      ? countryInformation.capital[0]
      : '-';
  const populationFormatted =
    countryInformation?.population.toLocaleString('ro-Ro') || '-';
  const mapCoordLink = countryInformation?.maps.googleMaps || '';
  const flagImg =
    countryInformation?.flags?.png || countryInformation?.flags?.svg || '';
  const language = countryInformation?.languages
    ? Object.values(countryInformation.languages)[0]
    : '-';
  const currencies = countryInformation?.currencies
    ? Object.values(countryInformation.currencies)[0]?.name
    : '-';

  return {
    flag: flagImg,
    name: countryName,
    capital: capitalName,
    language: language,
    mapCoordLink: mapCoordLink,
    population: populationFormatted,
    currency: currencies,
  };
}
