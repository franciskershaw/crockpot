"ues client";

import RecipeCardList from "../../components/RecipeCardList/RecipeCardList";

const BrowsePage = () => {
  return (
    <div className="container tw">
      <div className="tw">Search bar area</div>
      <div className="tw">
        <RecipeCardList />
      </div>
    </div>
  );
};

export default BrowsePage;
