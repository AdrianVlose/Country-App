const LOADING_ICON_PATH = './assets/loading.svg';
const LOADING_ICON_CLASS = 'loading-icon';
const LOADING_ICON_ID = 'loading-icon';

export function addLoadingState(element) {
  const icon = createLoadingIcon();
  element.appendChild(icon);
}

export function removeLoadingState() {
  const icon = document.querySelector(`#${LOADING_ICON_ID}`);
  icon.remove();
}

function createLoadingIcon() {
  const icon = document.createElement('img');
  icon.id = LOADING_ICON_ID;
  icon.alt = 'Loading state icon';
  icon.src = LOADING_ICON_PATH;
  icon.classList.add(LOADING_ICON_CLASS);
  return icon;
}
