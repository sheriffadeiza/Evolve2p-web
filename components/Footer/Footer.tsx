"use client";

import React from "react";
import Image from "next/image";
import Logo from "../../public/Assets/Evolve2p_logods/Dashboard/Logo.svg";
import Google from "../../public/Assets/Evolve2p_Google/Google Play logo.svg";
import Gplay from "../../public/Assets/Evolve2p_Gplay/Google Play.svg";
import Geton from "../../public/Assets/Evolve2p_geton/Get it on.svg";
import Apps from "../../public/Assets/Evolve2p_Apps/Mobile app store badge.svg";
import xicon from "../../public/Assets/Evolve2p_x/elements.svg";
import Discord from "../../public/Assets/Evolve2p_discord/discord.svg";
import Instagram from "../../public/Assets/Evolve2p_instagram/instagram.svg";
import Facebook from "../../public/Assets/Evolve2p_facebook/facebook-02.svg";
import Youtube from "../../public/Assets/Evolve2p_youtube/youtube.svg";
import Reddit from "../../public/Assets/Evolve2p_reddit/reddit.svg";

const Footer: React.FC = () => {
  return (
    <footer className="flex flex-col ">
      {/* I deleted the marging-bottom here on footer tag of mb-[200px] in case you will like to add it later */}
      <div className="flex flex-col border-0 border-yellow-500 mt-[24px] xl:flex-row space-x-[80px]  xl:mt-[-10%] md:border-0 md:border-sky-500 md:mt-[-56px] p-[4px] xl:justify-center xl:items-center">
        <Image
          src={Logo}
          alt="logo"
          className="mt-[10px] w-[160px] md:border-0 md:border-red-500"
        />

        <ul className="flex justify-around sm:justify-around w-full  list-none ml-[10px] text-[16px] font-[400] text-[#FCFCFC] lg:space-x-[60px]  m-[10px] md:justify-center md:space-x-[30px] md:border-0 md:border-sky-500  xl:w-[50%] ">
          <li>Features</li>
          <li>Help</li>
          <li>Privacy Policy</li>
          <li>Terms of Service</li>
        </ul>

        <p className="text-[16px] text-[#8F8F8F] text-center font-400 ml-[30px] border-0">
          © 2025 Evolve2p. All rights reserved.
        </p>
      </div>
      <div className="flex border-0 gap-[8px] mt-[-4px] flex-col lg:space-x-[10px] lg:ml-[20px] md:justify-between md:flex-row md:mt-[-4px] xl:flex-row xl:mt-[-8px]  ">
        <div className=" md:ml-0 md:w-[40%]  flex justify-around m-[10px] xl:w-[50%] ml-[20px] xl:justify-start xl:gap-[20px]">
          <div className="flex  w-[121.5px] h-[36px] pl-[2px] pr-[5px] items-center space-x-[10px]  bg-[#000]  rounded-[4.5px]">
            <Image
              src={Google}
              alt="google"
              className="w-[20.78px] h-[23.149px] ml-[5px]"
            />
            <div className="flex flex-col text-[#fff]  ml-2 space-y-[5px]">
              <Image
                src={Geton}
                alt="geton"
                className="w-[34.963px] h-[5.642px]"
              />

              <Image
                src={Gplay}
                alt="gplay "
                className="w-[76.298px] h-[15.327px]"
              />
            </div>
          </div>
          <Image
            src={Apps}
            alt="apps"
            className="w-[108px] h-[36px] border-0 border-white"
          />
        </div>
        <div className="flex  w-full lg:ml-[55%] space-x-[5px]  mt-[-5px] justify-center  md:w-[40%] md:justify-center md:items-center  xl:max-w-[22%] xl:justify-center xl:items-center">
          <div className="bg-[#222222] w-[32px] h-[32px] rounded-full flex items-center justify-center  ">
            <Image src={xicon} alt="iconx" />
          </div>
          <div className="bg-[#222222] w-[32px] h-[32px] rounded-full flex items-center justify-center">
            <Image src={Discord} alt="discord" />
          </div>
          <div className="bg-[#222222] w-[32px] h-[32px] rounded-full flex items-center justify-center">
            <Image src={Instagram} alt="instargram" />
          </div>
          <div className="bg-[#222222] w-[32px] h-[32px] rounded-full flex items-center justify-center">
            <Image src={Facebook} alt="facebook" />
          </div>
          <div className="bg-[#222222] w-[32px] h-[32px] rounded-full flex items-center justify-center">
            <Image src={Youtube} alt="youtube" />
          </div>
          <div className="bg-[#222222] w-[32px] h-[32px] rounded-full flex items-center justify-center">
            <Image src={Reddit} alt="reddit" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
