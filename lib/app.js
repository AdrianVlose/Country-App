import { UI } from './ui.js';

export const App = () => {
  const cardBoxElement = document.getElementById('card-box');
  const buttonElement = document.querySelector('button');
  const inputElement = document.querySelector('input');
  const favoriteIconElement = document.querySelector('#favorites-list');
  const historyIconElement = document.querySelector('#history-list');

  const ui = new UI(
    cardBoxElement,
    buttonElement,
    inputElement,
    favoriteIconElement,
    historyIconElement,
  );
  ui.bindEvents();
};
