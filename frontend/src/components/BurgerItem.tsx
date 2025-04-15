import { Link } from 'react-router-dom';
import React from 'react';
import { MenubarItem } from './ui/menubar';

interface NavbarItemProps {
  link: string;
  icon: React.ReactElement;
  text: string;
}

export function BurgerItem({ link, icon, text }: NavbarItemProps) {
  return (
    <Link to={link}>
      <MenubarItem className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
        {/*{React.cloneElement(icon, { className: 'size-4' })}*/}
        {icon}
        {text}
      </MenubarItem>
    </Link>
  );
}
