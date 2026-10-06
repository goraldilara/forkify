import View from "./View";
import icons from "url:../../img/icons.svg";

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");

  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _buttonOpen = document.querySelector(".nav__btn--add-recipe");
  _buttonClose = document.querySelector(".btn--close-modal");
  _message = "Recipe was successfully added!";

  _originalMarkup = this._parentElement.innerHTML;
  _formCleared = false;

  constructor() {
    super();
    this._addHandlerOpenAddRecipeWindow();
    this._addHandlerCloseAddRecipeWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  _addHandlerOpenAddRecipeWindow() {
    this._buttonOpen.addEventListener("click", () => {
      this.restoreForm();
      this.toggleWindow();
    });
  }

  _addHandlerCloseAddRecipeWindow() {
    this._buttonClose.addEventListener("click", this.toggleWindow.bind(this));
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = [...new FormData(this)];
      const data = Object.fromEntries(formData);
      handler(data);
    });
  }

  showSuccessMessage() {
    this.renderMessage();
    this._formCleared = true;
  }

  restoreForm() {
    if (!this._formCleared) return;

    this._parentElement.innerHTML = this._originalMarkup;
    this._formCleared = false;
  }
}
export default new AddRecipeView();
