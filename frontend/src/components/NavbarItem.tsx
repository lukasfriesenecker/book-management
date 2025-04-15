import { Link } from 'react-router-dom';
import React from 'react';

interface NavbarItemProps {
  link: string;
  icon: React.ReactElement;
  text: string;
}

export function NavbarItem({ link, icon, text }: NavbarItemProps) {
  return (
    <Link
      to={link}
      className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
    >
      {/*{React.cloneElement(icon, { className: 'size-4' })}*/}
      {icon}
      {text}
    </Link>
  );
}
