'use client';

import Image from 'next/image';
import arrow_left from '../public/Assets/Evolve2p arrow/Create account/Create account/arrow-left-02.png';

const Header = () => {
  return (
    <div className="flex items-center px-8 pt-4 pb-2 gap-[10%] w-full bg-[#0F1012] shadow-[0px_2px_4px_-1px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-center gap-[10px] h-5">
        <a href="/">
          <Image src={arrow_left} alt="Back arrow" width={20} height={20} />
        </a>
        <span className="text-[#DBDBDB]">Back to Website</span>
      </div>
    </div>
  );
};

export default Header;
