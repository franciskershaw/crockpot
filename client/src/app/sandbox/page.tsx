import { FC } from "react";

const SandBoxPage: FC = () => {
  return (
    <div className="space-y-2">
      <div className="container container--full">
        <h1>Sandbox Page!</h1>
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
    </div>
  );
};
export default SandBoxPage;
