"use-client";

import "../styles/globals.scss";
import type { Metadata } from "next";
import NavbarTop from "../components/NavbarTop/NavbarTop";
import NavbarBottom from "../components/NavbarBottom/NavbarBottom";
import ButtonAddRecipe from "../components/ButtonAddRecipe/ButtonAddRecipe";

export const metadata: Metadata = {
  title: "Crockpot",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <NavbarTop />
          <main className="my-24 md:my-28">{children}</main>
          <ButtonAddRecipe />
          <NavbarBottom />
        </div>
      </body>
    </html>
  );
}
