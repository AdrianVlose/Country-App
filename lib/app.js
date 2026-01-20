import { UI } from './ui.js';

export const App = () => {
  const cardBoxElement = document.getElementById('card-box');
  const buttonElement = document.querySelector('button');
  const inputElement = document.querySelector('input');
  const favoritesListElement = document.querySelector('#favorites-list');
  const historyListElement = document.querySelector('#history-list');

  const ui = new UI(
    cardBoxElement,
    buttonElement,
    inputElement,
    favoritesListElement,
    historyListElement,
  );
  ui.bindEvents();
};
