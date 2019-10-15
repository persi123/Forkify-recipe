import Axios from "axios";
import { key, proxy } from "../config";
export default class Search {
  constructor(query) {
    this.query = query;
  }
  async food() {
    try {
      const res = await Axios(
        `${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`
      );

      this.result = res.data.recipes;
    } catch (error) {
      alert(error);
    }
  }
}
