export function renderOptionUI(id, listBox, countryList, exitID) {
  const option = document.querySelector(`#${id}`);
  const listBoxElement = document.querySelector(`#${listBox}`);
  const exitIcon = document.querySelector(`#${exitID}`);
  listBoxElement.innerHTML = '';
  getHTMLCodeForList(listBoxElement, countryList);
  showOverlayAndSidebar(option);
  exitHandler(exitIcon, option);
}

function getHTMLCodeForList(boxElement, countryList) {
  countryList.forEach((country) => {
    const countryText = document.createElement('h3');
    countryText.textContent = country;
    boxElement.appendChild(countryText);
  });
}

function exitHandler(exitID, optionBox) {
  exitID.addEventListener('click', () => {
    cancelOverlayAndSidebar(optionBox);
  });
}

function showOverlayAndSidebar(sidebar) {
  const overlayElement = document.querySelector('#overlay');
  overlayElement.style.display = 'block';
  sidebar.style.display = 'flex';
}

function cancelOverlayAndSidebar(sidebar) {
  const overlayElement = document.querySelector('#overlay');
  overlayElement.style.display = 'none';
  sidebar.style.display = 'none';
}
