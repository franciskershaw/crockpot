'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import NavbarSharedLinks from '../NavbarSharedLinks/NavbarSharedLinks';
import Button from '../Button/Button';
import { usePathname } from 'next/navigation';
import './styles.scss';
import useUser from '../../hooks/auth/useUser';
import useAuth from '@/src/hooks/auth/useAuth';

const NavbarTop = () => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const { user } = useUser();
  const { logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    toggleMenu();
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
                inverse={pathname.startsWith('/sandbox')}
                text="Sandbox"
                onClick={toggleMenu}
              />
            </Link>
            <Link href="/login">
              <Button
                border
                inverse={pathname.startsWith('/login')}
                text="Login"
                onClick={toggleMenu}
              />
            </Link>
          </div>
        </div>
        {/* On mobile devices, display hamburger menu */}
        <div className="md:hidden">
          <button
            className={`nav__hamburger z-10 ${
              isOpen ? 'nav__hamburger--open' : ''
            }`}
            onClick={toggleMenu}
            aria-label="Menu">
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
          isOpen ? 'nav__menu--open' : ''
        } `}>
        <Link href="/sandbox">
          <Button
            border
            inverse={pathname.startsWith('/sandbox')}
            text="Sandbox"
            onClick={toggleMenu}
          />
        </Link>
        {user ? (
          <Button
            border
            inverse={pathname.startsWith('/logout')}
            text="Logout"
            onClick={handleLogout}
          />
        ) : (
          <Link href="/login">
            <Button
              border
              inverse={pathname.startsWith('/login')}
              text="Login"
              onClick={toggleMenu}
            />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavbarTop;
