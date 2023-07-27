"use client";

import Checkbox from "@/src/components/Checkbox/Checkbox";
import Slider from "@/src/components/Slider/Slider";
import Switch from "@/src/components/Switch/Switch";
import Accordion from "@/src/components/Accordion/Accordion";
import { FC } from "react";
import Icon from "@/src/components/Icon/Icon";
import { AiOutlineSearch } from "react-icons/ai";
import ButtonFav from "@/src/components/ButtonFav/ButtonFav";
import ButtonCart from "@/src/components/ButtonCart/ButtonCart";
import Button from "@/src/components/Button/Button";
import QuantityInput from "@/src/components/QuantityInput/QuantityInput";
import RecipeCard from "@/src/components/RecipeCard/RecipeCard";

const SandBoxPage: FC = () => {
  const accordionItems = [
    {
      heading: "Heading 1",
      children:
        "Bacon ipsum dolor amet chislic prosciutto biltong chicken shoulder swine salami rump alcatra bresaola, tenderloin cow andouille beef. Meatball tri-tip chicken leberkas. Beef landjaeger chuck ham hock. Jowl flank landjaeger ground round, prosciutto tri-tip ribeye meatball cupim buffalo pastrami. Buffalo sausage fatback picanha strip steak alcatra filet mignon pancetta ham hock flank frankfurter pastrami burgdoggen short ribs prosciutto.",
    },
    {
      heading: "Heading 2",
      children: <p>Paragraph paragraph!</p>,
    },
    {
      heading: "Heading 3",
      children: (
        <Switch
          label={"Switch"}
          onChange={(values: boolean) => console.log(values)}
        />
      ),
    },
  ];

  const handleQuantityChange = (value: number) => {
    console.log("Quantity changed:", value);
  };

  return (
    <div className="space-y-2">
      <div className="container container--full">
        <h1>Crockpot</h1>
        <h2>Sandbox Page!</h2>
        <h3>Sandbox Page!</h3>
        <h4>Sandbox Page!</h4>
        <h5>Sandbox Page!</h5>
        <h6>Sandbox Page!</h6>
        <p>Sandbox Page! Sandbox Page! Sandbox Page!</p>
        <a href="">Sandbox Page!</a>
      </div>
      <div className="container container--full flex">
        <div className="h-10 w-10 rounded-full bg-primary-light"></div>
        <div className="h-10 w-10 rounded-full bg-primary"></div>
        <div className="h-10 w-10 rounded-full bg-primary-dark"></div>
        <div className="h-10 w-10 rounded-full bg-secondary-light"></div>
        <div className="h-10 w-10 rounded-full bg-secondary"></div>
        <div className="h-10 w-10 rounded-full bg-secondary-dark"></div>
        <div className="h-10 w-10 rounded-full bg-black"></div>
        <div className="h-10 w-10 rounded-full bg-white border-black border-2"></div>
      </div>
      <div className="container container--full pt-8">
        <Slider
          min={25}
          max={75}
          onChange={(values: number[]) => console.log(values)}
        />
      </div>
      <div className="container container--full pt-8">
        <Switch
          label={"Switch"}
          onChange={(values: boolean) => console.log(values)}
        />
      </div>
      <div className="container container--full pt-8 space-y-2">
        <Checkbox
          label={"Checkbox"}
          onChange={(values: boolean) => console.log(values)}
        />
        <Checkbox
          label={"Checkbox"}
          onChange={(values: boolean) => console.log(values)}
        />
        <Checkbox
          label={"Checkbox"}
          onChange={(values: boolean) => console.log(values)}
        />
      </div>
      <div className="container container--full pt-8 space-y-2">
        <Accordion items={accordionItems} />
      </div>
      <div className="container container--full pt-8 flex space-x-2">
        <Icon border size="sm">
          <AiOutlineSearch />
        </Icon>
        <Icon border>
          <AiOutlineSearch />
        </Icon>
        <Icon border active size="lg">
          <AiOutlineSearch />
        </Icon>
        <Icon border type="secondary" size="sm">
          <AiOutlineSearch />
        </Icon>
        <Icon border type="secondary">
          <AiOutlineSearch />
        </Icon>
        <Icon border active type="secondary" size="lg">
          <AiOutlineSearch />
        </Icon>
        <Icon border type="tertiary" size="sm">
          <AiOutlineSearch />
        </Icon>
        <Icon border type="tertiary">
          <AiOutlineSearch />
        </Icon>
        <Icon border active type="tertiary" size="lg">
          <AiOutlineSearch />
        </Icon>
      </div>
      <div className="container container--full pt-8 space-x-2">
        <ButtonFav recipeId="halluomi-tacos" />
        <ButtonCart recipeId="sheperds-pie" />
        <div className="flex space-x-2">
          <Button border onPress={() => console.log("Hello!")}>
            <AiOutlineSearch />
          </Button>
          <Button
            border
            text="Button"
            onPress={() => console.log("Hello!")}
          ></Button>
          <Button
            border
            text="Button"
            inverse
            onPress={() => console.log("Hello!")}
          >
            <AiOutlineSearch />
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button type="secondary" border onPress={() => console.log("Hello!")}>
            <AiOutlineSearch />
          </Button>
          <Button
            border
            text="Button"
            onPress={() => console.log("Hello!")}
            type="secondary"
          ></Button>
          <Button
            type="secondary"
            border
            inverse
            text="Button"
            onPress={() => console.log("Hello!")}
          >
            <AiOutlineSearch />
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button type="tertiary" border onPress={() => console.log("Hello!")}>
            <AiOutlineSearch />
          </Button>
          <Button
            type="tertiary"
            border
            text="Button"
            onPress={() => console.log("Hello!")}
          ></Button>
          <Button
            type="tertiary"
            border
            inverse
            text="Button"
            onPress={() => console.log("Hello!")}
          >
            <AiOutlineSearch />
          </Button>
        </div>
        <QuantityInput initialValue={10} onChange={handleQuantityChange} />
      </div>
      <div className="container container--full">
        <div className="grid grid-cols-2 gap-5">
          <RecipeCard
            imageUrl="https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_1100,q_30,w_2600/hellofresh_s3/image/553654b06ced6ebf798b4567.jpg"
            cookingTime={20}
            recipeName="Ginger Beef Stir Fry"
            categories={["Delicious", "Steamy"]}
          />
          <RecipeCard
            imageUrl="https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_1100,q_30,w_2600/hellofresh_s3/image/5508664c6ced6efa2e8b457e.jpg"
            cookingTime={30}
            recipeName="Spring Time Crispy Chicken Parmigiana Salad"
            categories={["Delicious", "Healthy", "Steamy", "Saucy"]}
          />
          <RecipeCard
            imageUrl="https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_1100,q_30,w_2600/hellofresh_s3/image/54f744b26ced6e83388b4567.jpg"
            cookingTime={40}
            recipeName="Strolling Rigatoni with Cherry Tomatoes and Mozzarella"
            categories={["Delicious", "Healthy", "Steamy"]}
          />
        </div>
      </div>
    </div>
  );
};
export default SandBoxPage;