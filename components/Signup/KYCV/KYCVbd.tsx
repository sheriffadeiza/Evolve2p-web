"use client";

import React from 'react';
import Head from 'next/head';
import  Evolve_ee from '../../../public/Assets/Evolve_ee/Clip path group.png';
import Image from 'next/image';


const Verify = () => {
  return (
    <>
      <Head>
        <title>Verify Identity | Evolve2p</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-[#0F1012] text-white px-4">
        <div className="absolute top-[250px] left-[15%]">
          <Image src={Evolve_ee} alt="Evolve2p Logo" width={138.728} height={33.045} />
        </div>
        <div className="max-w-md w-full ml-[80px] space-y-6">
          <h1 className="text-[24px]  mt-[25%]  text-[#ffffff] font-[700] ">Verify Your Identity</h1>
          <p className="text-[16px] font-[400] text-[#8F8F8F] ">
            For security and compliance, we need to verify your identity <br /> before you can start trading.
          </p>

          <div className="bg-[#2D2D2D] w-[72%] h-[10vh]  pt-[5px] pl-[15px]    rounded-[8px]">
            <p className="font-[500] text-[14px] text-[#FCFCFC]">Required for regulation</p>
            <p className="text-[#DBDBDB] mt-[-10px] text-[12px] font-[400] ">
              We are required to verify your identity.
            </p>
          </div>

          <div className="bg-[#2D2D2D] mt-[20px] w-[72%] h-[10vh]  pt-[5px] pl-[15px]    rounded-[8px]">
            <p className="font-[500] text-[14px] text-[#FCFCFC]">We value your privacy</p>
            <p className="text-[#DBDBDB] mt-[-10px] text-[12px] font-[400] ">
             This helps us protect your Evolve2p account. See <span className='text-[#4DF2BE] underline cursor-pointer'>privacy policy.</span>
            </p>
          </div>

          <p className="text-[#4DF2BE] text-[14px] font-[700] ml-[30px] cursor-pointer hover:underline">
            How does this work?
          </p>

          <div className="space-y-3 mt-[60px]">
  <div className="relative">
  <button className="w-[430px] h-[48px] py-3 bg-[#4DF2BE] hover:bg-[#0EA371] text-white text-[14px] font-[700] border-none rounded-[100px] transition-colors flex items-center justify-center">
    Verify with
    <div className="ml-[5px]">
      <svg 
        width="138.728" 
        height="33.045" 
        viewBox="0 0 72 20" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
       
      >
        {/* Evolve2p icon - purple */}
        <path  d="M0.337787 14.1653H9.70548C9.85825 14.1654 10.0047 14.2354 10.1128 14.3599C10.2208 14.4844 10.2815 14.6533 10.2815 14.8295V15.7065C10.2815 15.8827 10.2207 16.0515 10.1127 16.1761C10.0047 16.3006 9.85824 16.3706 9.70548 16.3707H0.337669C0.184946 16.3706 0.0385055 16.3006 -0.0694857 16.1761C-0.177477 16.0516 -0.238187 15.8828 -0.238281 15.7067V14.8296C-0.238187 14.6535 -0.177468 14.4846 -0.0694583 14.36C0.0385517 14.2355 0.185022 14.1654 0.337787 14.1653ZM9.55594 8.19229L7.11359 6.56652C7.09542 6.55443 7.08034 6.53703 7.06985 6.51608C7.05936 6.49514 7.05384 6.47138 7.05384 6.44719C7.05384 6.42301 7.05936 6.39924 7.06985 6.3783C7.08034 6.35735 7.09542 6.33996 7.11359 6.32786L9.55594 4.70196C9.68822 4.61387 9.78474 4.46882 9.82428 4.2987C9.86383 4.12858 9.84317 3.94732 9.76684 3.79476L9.38653 3.0353C9.31015 2.88277 9.18434 2.77146 9.03678 2.72586C8.88923 2.68026 8.732 2.7041 8.59969 2.79215L6.15722 4.41778C6.13905 4.42989 6.11844 4.43627 6.09746 4.43628C6.07648 4.43629 6.05586 4.42993 6.03769 4.41785C6.01951 4.40576 6.00442 4.38837 5.99392 4.36742C5.98342 4.34647 5.97789 4.32271 5.97789 4.29852V1.04685C5.97789 0.870697 5.91719 0.70176 5.80916 0.577202C5.70113 0.452644 5.5546 0.382668 5.40182 0.382668H4.64121C4.56557 0.382632 4.49066 0.399783 4.42077 0.433142C4.35088 0.466501 4.28738 0.515413 4.23389 0.577082C4.1804 0.638751 4.13798 0.711969 4.10904 0.792551C4.08011 0.873133 4.06523 0.959499 4.06526 1.04671V4.29852C4.06526 4.40456 3.96561 4.47093 3.88593 4.41778L1.44346 2.79201C1.37796 2.74836 1.30564 2.72003 1.23063 2.70862C1.15563 2.69722 1.0794 2.70298 1.00633 2.72556C0.933252 2.74814 0.864752 2.78711 0.804746 2.84023C0.74474 2.89336 0.694404 2.9596 0.656616 3.03517L0.276314 3.79462C0.238474 3.87014 0.213912 3.95351 0.204032 4.03998C0.194153 4.12644 0.199148 4.2143 0.218734 4.29854C0.23832 4.38278 0.272112 4.46174 0.318179 4.53092C0.364246 4.60009 0.421685 4.65812 0.487212 4.70169L2.92968 6.32759C3.00947 6.38061 3.00947 6.51323 2.92968 6.56625L0.487212 8.19229C0.354944 8.28035 0.258425 8.42538 0.218876 8.59547C0.179328 8.76557 0.199988 8.94681 0.276314 9.09935L0.656616 9.85881C0.733 10.0113 0.858807 10.1227 1.00637 10.1683C1.15393 10.2139 1.31115 10.19 1.44346 10.102L3.88581 8.47592C3.90399 8.46378 3.92462 8.45737 3.94563 8.45734C3.96664 8.45732 3.98729 8.46368 4.00549 8.47579C4.02368 8.4879 4.03879 8.50532 4.04929 8.52631C4.05978 8.54729 4.06529 8.5711 4.06526 8.59532V11.8471C4.06523 11.9343 4.08011 12.0207 4.10904 12.1013C4.13798 12.1819 4.1804 12.2551 4.23389 12.3168C4.28738 12.3784 4.35088 12.4273 4.42077 12.4607C4.49066 12.4941 4.56557 12.5112 4.64121 12.5112H5.40182C5.5546 12.5112 5.70113 12.4412 5.80916 12.3166C5.91719 12.1921 5.97789 12.0231 5.97789 11.847V8.59518C5.97789 8.48901 6.07742 8.42277 6.15722 8.47579L8.59969 10.1018C8.66518 10.1455 8.7375 10.1738 8.8125 10.1852C8.8875 10.1966 8.96372 10.1909 9.0368 10.1683C9.10987 10.1458 9.17837 10.1068 9.23838 10.0537C9.29839 10.0006 9.34874 9.93436 9.38653 9.85881L9.76684 9.09922C9.8047 9.0237 9.82928 8.94032 9.83918 8.85385C9.84908 8.76738 9.8441 8.6795 9.82452 8.59525C9.80495 8.51099 9.77116 8.43202 9.7251 8.36283C9.67903 8.29364 9.62147 8.23587 9.55594 8.19229Z" fill="#7379FD"/>
         {/* Persona text - using custom font (defined in global CSS) */}
        <text x="12" y="15" className="font-poppins  text-[#ffffff]" fill="currentColor" font-weight="700" font-size="14">
          Persona
        </text>
      </svg>
    </div>
  </button>
</div>
  <button className="w-[430px] h-[48px] mt-[30px] py-3 font-[700] bg-[#2D2D2D]  text-[#FCFCFC] text-[14px] font-[700] border-none rounded-[100px] transition-colors flex items-center justify-center">
              Verify Later
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Verify;