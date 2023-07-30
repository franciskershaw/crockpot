"use client";

import React, { useState } from "react";
import Link from "next/link";
import NavbarSharedLinks from "../NavbarSharedLinks/NavbarSharedLinks";
import Button from "../Button/Button";
import { usePathname } from "next/navigation";
import "./styles.scss";

const NavbarTop = () => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav className="nav py-5 bg-white border-2 border-black fixed top-0 left-0 w-full flex justify-evenly z-10">
      <div className="container xl:px-0 flex justify-between items-center w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <h1>Crockpot</h1>
            <div className="hidden md:flex items-center space-x-2">
              <NavbarSharedLinks />
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/sandbox">
              <Button
                border
                inverse={pathname.startsWith("/sandbox")}
                text="Sandbox"
              />
            </Link>
            <Link href="/logout">
              <Button
                border
                inverse={pathname.startsWith("/logout")}
                text="Logout"
              />
            </Link>
          </div>
        </div>
        {/* On mobile devices, display hamburger menu */}
        <div className="md:hidden">
          <button
            className={`nav__hamburger z-10 ${
              isOpen ? "nav__hamburger--open" : ""
            }`}
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      {/* Mobile menu items */}
      <div
        className={`border-2 border-black bg-white flex flex-col items-center justify-center space-y-4 nav__menu ${
          isOpen ? "nav__menu--open" : ""
        } `}
      >
        <Link href="/sandbox">
          <Button
            border
            inverse={pathname.startsWith("/sandbox")}
            text="Sandbox"
          />
        </Link>
        <Link href="/logout">
          <Button
            border
            inverse={pathname.startsWith("/logout")}
            text="Logout"
          />
        </Link>
      </div>
    </nav>
  );
};

export default NavbarTop;
