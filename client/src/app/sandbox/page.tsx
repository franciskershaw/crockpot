"use client";

import Checkbox from "@/src/components/Checkbox/Checkbox";
import Slider from "@/src/components/Slider/Slider";
import Switch from "@/src/components/Switch/Switch";
import { FC } from "react";

const SandBoxPage: FC = () => {
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
          id={"switch"}
          onChange={(values: boolean) => console.log(values)}
        />
      </div>
      <div className="container container--full pt-8 space-y-2">
        <Checkbox
          label={"Checkbox"}
          id={"checkbox-1"}
          onChange={(values: boolean) => console.log(values)}
        />
        <Checkbox
          label={"Checkbox"}
          id={"checkbox-2"}
          onChange={(values: boolean) => console.log(values)}
        />
        <Checkbox
          label={"Checkbox"}
          id={"checkbox-3"}
          onChange={(values: boolean) => console.log(values)}
        />
      </div>
    </div>
  );
};
export default SandBoxPage;
