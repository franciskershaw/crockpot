'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Button from '../../Button/Button';

const NavbarSharedLinks = () => {
  const pathname = usePathname();

  return (
    <>
      <Link href="/browse">
        <Button
          border
          inverse={pathname.startsWith('/browse')}
          text="Browse Recipes"
        />
      </Link>
      <Link href="/your-crockpot">
        <Button
          border
          inverse={pathname.startsWith('/your-crockpot')}
          text="Your Crockpot"
        />
      </Link>
    </>
  );
};

export default NavbarSharedLinks;
