export function showListInPage(boxElement, countryList) {
  boxElement.innerHTML = '';
  const boxElementID = boxElement.id;
  countryList.forEach((country) => {
    const element = boxElementID === 'history-list' ? 'button' : 'h3';
    const countryText = document.createElement(element);
    countryText.textContent = country;
    if (element === 'button') {
      countryText.type = 'button';
      countryText.classList.add('history-button');
    }
    boxElement.appendChild(countryText);
  });
}

export function changeShowMenuState() {
  const content = document.querySelector('.main-content');
  const sidebar = document.querySelector('.sidebar');

  sidebar.classList.toggle('active');
  content.classList.toggle('disabled');
}
