export async function searchForCountry(countryName) {
  const countryNameTrim = countryName.trim();
  if (!countryNameTrim) {
    throw new Error('Enter a country name');
  }
  try {
    const url = `https://restcountries.com/v3.1/name/${countryNameTrim}`;
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

export function parseCountryInformation(countryInformation, weatherInfo) {
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
  const currenciesSymbol = countryInformation?.currencies
    ? Object.values(countryInformation.currencies)[0]?.symbol
    : '-';
  const region = countryInformation?.region || '-';
  const subregion = countryInformation?.subregion || '-';
  const continents =
    Array.isArray(countryInformation.continents) &&
    countryInformation?.continents?.length > 0
      ? countryInformation.continents
      : [];

  const current_temp = weatherInfo?.current?.temperature_2m || '-';
  const felt_temp = weatherInfo?.current?.apparent_temperature || '-';
  const temp_unit = weatherInfo?.current_units?.temperature_2m || '-';
  const offset_seconds = weatherInfo?.utc_offset_seconds || 0;
  const offset_hours = offset_seconds / 3600;
  let current_date = new Date();
  current_date.setHours(current_date.getHours() + offset_hours - 2);
  const formattedDate = current_date.toLocaleTimeString('ro-RO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const isDay = weatherInfo?.current?.is_day
    ? Boolean(weatherInfo.current.is_day)
    : false;

  return {
    flag: flagImg,
    name: countryName,
    capital: capitalName,
    language: language,
    mapCoordLink: mapCoordLink,
    population: populationFormatted,
    currency: currencies,
    symbol: currenciesSymbol,
    region: region,
    subregion: subregion,
    continents: continents,
    current_temp: current_temp,
    felt_temp: felt_temp,
    temp_unit: temp_unit,
    formattedTime: formattedDate,
    isDay: isDay,
  };
}

export async function getWeatherInformationForCountry(latitude, longitude) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,apparent_temperature&timezone=auto`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Request Failed!');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
}

export function extractCountryCoords(countryInformation) {
  const latitude =
    countryInformation?.capitalInfo?.latlng &&
    countryInformation?.capitalInfo?.latlng
      ? countryInformation.capitalInfo.latlng[0]
      : 0.0;
  const longitude =
    countryInformation?.capitalInfo?.latlng &&
    countryInformation?.capitalInfo?.latlng
      ? countryInformation.capitalInfo.latlng[1]
      : 0.0;

  return {
    latitude: latitude,
    longitude: longitude,
  };
}
