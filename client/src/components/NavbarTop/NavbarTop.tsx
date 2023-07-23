"use client";

import React, { useState } from "react";
import Link from "next/link";
import NavbarSharedLinks from "../NavbarSharedLinks/NavbarSharedLinks";
import Button from "../Button/Button";
import { usePathname } from "next/navigation";

const NavbarTop = () => {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="p-4 bg-white border-2 border-black fixed top-0 left-0 w-full flex justify-evenly">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <h1>Crockpot</h1>
            <div className="hidden md:flex items-center space-x-2">
              <NavbarSharedLinks />
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/about">
              <span className="">About</span>
            </Link>
            <Link href="/faq">
              <span className="">FAQ</span>
            </Link>
            <Link href="/logout">
              <Button
                type="secondary"
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
            className="focus:outline-none"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M6.293 7.293L12 13.586l5.707-5.293 1.414 1.414L12 16.414l-7.121-7.707 1.414-1.414z" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {/* Mobile menu items */}
      <div
        className={`${
          isMenuOpen ? "left-0" : "-left-full"
        } absolute top-0 bottom-0 h-full bg-white p-4 w-56 transition-transform`}
      >
        <Link href="/about">
          <span className="block mt-2">About</span>
        </Link>
        <Link href="/faq">
          <span className="block mt-2">FAQ</span>
        </Link>
        <Link href="/logout">
          <span className="block mt-2">Logout</span>
        </Link>
      </div>
    </nav>
  );
};

export default NavbarTop;
