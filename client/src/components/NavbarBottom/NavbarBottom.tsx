"use client";

import React from "react";
import NavbarSharedLinks from "../NavbarSharedLinks/NavbarSharedLinks";

const NavbarBottom = () => {
  return (
    <nav className="p-4 border-2 border-black fixed bottom-0 left-0 w-full flex justify-evenly md:hidden">
      <NavbarSharedLinks />
    </nav>
  );
};

export default NavbarBottom;
