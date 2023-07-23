"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Button from "../Button/Button";

const NavbarBottom = () => {
  const pathname = usePathname();

  return (
    <nav className="p-4 border-2 border-black fixed bottom-0 left-0 w-full flex justify-evenly md:hidden">
      <Link href="/browse">
        <Button
          type="secondary"
          border
          inverse={pathname.startsWith("/browse")}
          text="Browse Recipes"
        />
      </Link>
      <Link href="/your-crockpot">
        <Button
          type="secondary"
          border
          inverse={pathname.startsWith("/your-crockpot")}
          text="Your Crockpot"
        />
      </Link>
    </nav>
  );
};

export default NavbarBottom;
