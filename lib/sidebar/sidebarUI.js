export function showListInPage(boxElement, countryList) {
  boxElement.innerHTML = '';
  countryList.forEach((country) => {
    const countryText = document.createElement('h3');
    countryText.textContent = country;
    boxElement.appendChild(countryText);
  });
}
