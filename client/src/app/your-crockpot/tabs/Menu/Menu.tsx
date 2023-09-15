import Button from "@/src/components/Button/Button";

const Menu = () => {
  return (
    <div className="">
      <div className="tw flex justify-center">
        <Button
          type="tertiary"
          border
          text="Shopping List"
          onClick={() => console.log("Hello!")}
        />
      </div>
      <div className="tw">Recipes here</div>
    </div>
  );
};

export default Menu;
