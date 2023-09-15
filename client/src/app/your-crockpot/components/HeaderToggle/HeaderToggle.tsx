// HeaderToggle.js
import * as Tabs from "@radix-ui/react-tabs";
import "./styles.scss";

const HeaderToggle = () => {
  return (
    <Tabs.Root defaultValue="menu">
      <div className="max-w-screen-md mx-auto">
        <Tabs.List className="flex justify-between bg-gray-200 p-2 rounded-t relative">
          <Tabs.Trigger
            value="menu"
            className="flex-1 text-center py-2 transition duration-300 ease-in-out relative"
            data-active-class="underline-active"
          >
            Menu
            <span className="underline"></span>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="favourites"
            className="flex-1 text-center py-2 transition duration-300 ease-in-out relative"
            data-active-class="underline-active"
          >
            Favourites
            <span className="underline"></span>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="my-recipes"
            className="flex-1 text-center py-2 transition duration-300 ease-in-out relative"
            data-active-class="underline-active"
          >
            My Recipes
            <span className="underline"></span>
          </Tabs.Trigger>
        </Tabs.List>
      </div>

      <Tabs.Content
        value="menu"
        className="p-4 border rounded-b border-t-0 w-full"
      >
        Menu Content
      </Tabs.Content>
      <Tabs.Content
        value="favourites"
        className="p-4 border rounded-b border-t-0 w-full"
      >
        Favourites Content
      </Tabs.Content>
      <Tabs.Content
        value="my-recipes"
        className="p-4 border rounded-b border-t-0 w-full"
      >
        My Recipes Content
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default HeaderToggle;
