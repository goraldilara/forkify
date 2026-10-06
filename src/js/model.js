import { async } from "regenerator-runtime";
import { API_URL, PAGE_ITEM_COUNT, API_KEY } from "./config";
import { AJAX } from "./helpers";
import addRecipeView from "./views/addRecipeView";

export const state = {
  recipe: {},
  search: {
    query: "",
    page: 1,
    results: [],
    resultsPerPage: PAGE_ITEM_COUNT,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
    state.recipe = createRecipeObject(data);

    const index = state.bookmarks.findIndex((bookmark) => bookmark.id === id);

    if (index !== -1) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        image: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * PAGE_ITEM_COUNT;
  const end = page * PAGE_ITEM_COUNT;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ingredient) => {
    ingredient.quantity =
      (newServings * ingredient.quantity) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmark = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const updateBookmark = function (recipe) {
  if (recipe.id !== state.recipe.id) return;
  if (recipe.id === state.recipe.id && state.recipe.bookmarked) {
    const index = state.bookmarks.findIndex(
      (bookmark) => bookmark.id === recipe.id,
    );
    if (index !== -1) state.bookmarks.splice(index, 1);
    state.recipe.bookmarked = false;
  } else if (recipe.id === state.recipe.id && !state.recipe.bookmarked) {
    state.bookmarks.push(recipe);
    state.recipe.bookmarked = true;
  }

  persistBookmark();
};

const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    cookingTime: recipe.cooking_time,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const uploadRecipe = async function (newRecipe) {
  console.log(newRecipe);
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ingArr = ing[1].split(",").map((el) => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            "Wrong ingredient format! Please use the correct format.",
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}/?key=${API_KEY}`, recipe);
    console.log(data);
    state.recipe = createRecipeObject(data);
    updateBookmark(state.recipe);
    console.log(state.recipe);
  } catch (err) {
    throw err;
  }
};
