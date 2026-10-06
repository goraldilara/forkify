import View from "./View";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerButtonClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const button = e.target.closest(".btn--inline");

      if (!button) return;
      const goToPage = +button.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const pageNumbers = Math.ceil(
      this._data.results.length / this._data.resultsPerPage,
    );

    if (this._data.page === 1 && pageNumbers === 1) return "";
    if (this._data.page === 1 && pageNumbers > 1) {
      return this._generateMarkupNextButtonPreview(this._data.page);
    }
    if (this._data.page === pageNumbers && pageNumbers > 1) {
      return this._generateMarkupPrevButtonPreview(this._data.page);
    }
    if (this._data.page < pageNumbers && this._data.page > 1) {
      return (
        this._generateMarkupPrevButtonPreview(this._data.page) +
        this._generateMarkupNextButtonPreview(this._data.page)
      );
    }
  }

  _generateMarkupPrevButtonPreview(page) {
    return `
        <button data-goto="${page - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${page - 1}</span>
        </button> 
    `;
  }

  _generateMarkupNextButtonPreview(page) {
    return `
        <button data-goto="${page + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
    `;
  }
}

export default new PaginationView();
