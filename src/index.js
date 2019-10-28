import Search from "./models/Search";
import { elements, renderLoader, clearLoader } from "./View/base";
import * as searchView from "./View/searchView";
import * as RecipeView from "./View/RecipeView";
import Recipe from "./models/Recipe";
const state = {};

const controller = async () => {
  const query = searchView.getInput();
  console.log(query);
  if (query) {
    state.search = new Search(query);
    searchView.clearValue();
    renderLoader(elements.searchRes);
    try {
      await state.search.food();

      clearLoader();

      searchView.renderResults(state.search.result);
    } catch (error) {
      console.log("somthing wrong wth search");
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controller();
});

elements.searchRespages.addEventListener("click", el => {
  const btn = el.target.closest(".btn-inline");
  console.log(btn);
  if (btn) {
    const goTopath = parseInt(btn.dataset.goto, 10);
    console.log(goTopath);
    searchView.clearValue();
    searchView.renderResults(state.search.result, goTopath);
  }
});

const controleRecipe = async () => {
  const id = window.location.hash.replace("#", "");

  console.log(id);
  if (id) {
    RecipeView.clearRecipe();
    renderLoader(elements.recipe);

    searchView.heighltedSelectedid(id);
    state.recipe = new Recipe(id);
    try {
      await state.recipe.getRecipe();
      state.recipe.calcTime();
      state.recipe.calcServing();
      state.recipe.parseIngredent();
      clearLoader();
      RecipeView.renderRecip(state.recipe);

      console.log(state.recipe);
    } catch (error) {
      console.log("something wrong with recipe");
    }
  }
};
// window.addEventListener("hashchange", controleRecipe);
["hashchange", "load"].forEach(event =>
  window.addEventListener(event, controleRecipe)
);

elements.recipe.addEventListener("click", el => {
  if (el.target.matches(".btn-decrease, .btn-decrease *")) {
    if (state.recipe.serving > 1) {
      state.recipe.updateServings("dec");
      RecipeView.updateServingsIngedients(state.recipe);
    }
  } else if (el.target.matches(".btn-increase , .btn-increase *")) {
    state.recipe.updateServings("inc");
    RecipeView.updateServingsIngedients(state.recipe);
  }
  console.log(state.recipe);
});
