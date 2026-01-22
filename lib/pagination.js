export class PageManager {
  constructor() {
    this.currentPage = 1;
    this.numberOfPages = 0;
    this.prevNumberPage = 0;
    this.nextNumberPage = 2;
    this.currentData = [];
    this.data = [];
  }

  updateData(newListOfData) {
    this.data = newListOfData;
    this.numberOfPages = Math.ceil(newListOfData.length / 2);
    this.currentPage = 1;
    this.prevNumberPage = 0;
    this.nextNumberPage = 2;
    const startIndex = (this.currentPage - 1) * 2;
    const endIndex = startIndex + 2;
    this.currentData = this.data.slice(startIndex, endIndex);
  }

  goToNextPage() {
    this.prevNumberPage++;
    this.nextNumberPage++;
    this.currentPage++;
    const startIndex = (this.currentPage - 1) * 2;
    const endIndex = startIndex + 2;
    this.currentData = this.data.slice(startIndex, endIndex);
  }

  goToPrevPage() {
    this.prevNumberPage--;
    this.nextNumberPage--;
    this.currentPage--;
    const startIndex = (this.currentPage - 1) * 2;
    const endIndex = startIndex + 2;
    this.currentData = this.data.slice(startIndex, endIndex);
  }

  isPrevPageIconDisable() {
    return this.prevNumberPage === 0;
  }

  isNextPageIconDisable() {
    return this.nextNumberPage > this.numberOfPages;
  }
}
