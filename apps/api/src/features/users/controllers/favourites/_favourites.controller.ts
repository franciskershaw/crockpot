import addToFavourites from "./addToFavourites.controller";
import getUserFavourites from "./getUserFavourites.controller";
import removeFromFavourites from "./removeFromFavourites.controller";

const favouritesControllers = {
  getUserFavourites,
  addToFavourites,
  removeFromFavourites,
};

export default favouritesControllers;
