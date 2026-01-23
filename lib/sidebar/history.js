const HISTORY_KEY = 'List_With_Latest_Countries_Or_Parts_Searched_v1';

export function updateHistoryList(textSearched) {
  if (isTextAlreadyInHistory(textSearched)) {
    return;
  }

  let historyList = JSON.parse(sessionStorage.getItem(HISTORY_KEY)) || [];

  if (historyList.length === 10) {
    historyList.pop();
  }
  historyList.unshift(textSearched);

  sessionStorage.setItem(HISTORY_KEY, JSON.stringify(historyList));
}

export function getHistoryList() {
  return JSON.parse(sessionStorage.getItem(HISTORY_KEY)) || [];
}

function isTextAlreadyInHistory(text) {
  let historyList = JSON.parse(sessionStorage.getItem(HISTORY_KEY)) || [];
  return historyList.includes(text);
}
