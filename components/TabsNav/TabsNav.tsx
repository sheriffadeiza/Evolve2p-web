'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { label: 'Balance', href: '/wallet' },
  { label: 'Transactions', href: '/transactions' },
  { label: 'Swap', href: '/swap' },
];

const TabsNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="flex bg-[#2D2D2D] rounded-[56px] mt-8 w-[296px] h-[48px] p-1 items-center justify-between">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center justify-center rounded-[56px] text-[16px] transition no-underline
              ${isActive
                ? "bg-[#4A4A4A] text-[#FCFCFC] font-[500]"
                : "bg-transparent text-[#DBDBDB] font-[400]"
              } w-[90px] h-[40px]`}
            style={{ minWidth: "90px", minHeight: "40px" }}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
};

export default TabsNav;
