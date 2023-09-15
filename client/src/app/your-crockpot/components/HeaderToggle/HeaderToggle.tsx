// HeaderToggle.js
import * as Tabs from "@radix-ui/react-tabs";
import "./styles.scss";

const HeaderToggle = () => {
  return (
    <Tabs.Root defaultValue="menu">
      <div className="max-w-screen-md mx-auto">
        <Tabs.List className="flex justify-between bg-gray-200 p-2 rounded-t">
          <Tabs.Trigger
            value="menu"
            className="flex-1 text-center py-2 transition duration-300 ease-in-out"
            data-active-class="bg-blue-500 text-white"
          >
            Menu
          </Tabs.Trigger>
          <Tabs.Trigger
            value="favourites"
            className="flex-1 text-center py-2 transition duration-300 ease-in-out"
            data-active-class="bg-blue-500 text-white"
          >
            Favourites
          </Tabs.Trigger>
          <Tabs.Trigger
            value="my-recipes"
            className="flex-1 text-center py-2 transition duration-300 ease-in-out"
            data-active-class="bg-blue-500 text-white"
          >
            My Recipes
          </Tabs.Trigger>
        </Tabs.List>
      </div>

      <Tabs.Content
        value="menu"
        className="p-4 border rounded-b border-t-0 w-full"
      >
        {/* Your Menu content here */}
        Menu Content
      </Tabs.Content>
      <Tabs.Content
        value="favourites"
        className="p-4 border rounded-b border-t-0 w-full"
      >
        {/* Your Favourites content here */}
        Favourites Content
      </Tabs.Content>
      <Tabs.Content
        value="my-recipes"
        className="p-4 border rounded-b border-t-0 w-full"
      >
        {/* Your My Recipes content here */}
        My Recipes Content
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default HeaderToggle;
