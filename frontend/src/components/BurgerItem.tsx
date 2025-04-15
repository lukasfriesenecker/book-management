import { Link } from 'react-router-dom';
import React from 'react';
import { MenubarItem } from './ui/menubar';

interface NavbarItemProps {
  link: string;
  icon: React.ReactElement<{ className?: string }>;
  text: string;
}

export function BurgerItem({ link, icon, text }: NavbarItemProps) {
  return (
    <Link to={link}>
      <MenubarItem className="flex h-16 cursor-pointer items-center text-xl font-semibold text-gray-700">
        {React.cloneElement(icon, { className: 'size-6 mx-2' })}
        {text}
      </MenubarItem>
    </Link>
  );
}
