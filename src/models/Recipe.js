import axios from "axios";

import { key, proxy } from "../config";
import { elements } from "../View/base";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.image = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;

      console.log(res);
    } catch (error) {
      alert("something went wrong");
    }
  }

  calcTime() {
    const numIng = this.ingredients.length;
    const period = Math.ceil(numIng / 3);
    this.time = period * 15;
  }

  calcServing() {
    this.serving = 4;
  }

  parseIngredent() {
    const unitLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds"
    ];
    const unitShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound"
    ];

    const newIngredients = this.ingredients.map(el => {
      let ingredient = el.toLowerCase();

      unitLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitShort[i]);
      });

      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

      const arrIng = ingredient.split(" ");
      const UnitIndex = arrIng.findIndex(el => unitShort.includes(el));
      let objIng;
      if (UnitIndex > -1) {
        const arrCount = arrIng.slice(0, UnitIndex);

        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace("-", "+"));
        } else {
          count = eval(arrIng.slice(0, UnitIndex).join("+"));
        }
        objIng = {
          count,
          unit: arrIng[UnitIndex],
          ingredient: arrIng.slice(UnitIndex + 1).join(" ")
        };
      } else if (parseInt(arrIng[0], 10)) {
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" ")
        };
      } else if (UnitIndex === -1) {
        objIng = {
          count: 1,
          unit: "",
          ingredient
        };
      }

      return objIng;
    });

    this.ingredients = newIngredients;
  }

  updateServings(type) {
    const newServings = type === "dec" ? this.serving - 1 : this.serving + 1;
    console.log(type);
    this.ingredients.forEach(ing => {
      ing.count *= newServings / this.serving;
    });
    this.serving = newServings;
  }
}
