'use client';


import React from 'react';
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
    <footer>
      <div className="flex space-x-[80px] mt-[-20%] ">
        <Image src={Logo} alt="logo" className="mt-[10px] w-[160px]" />

        <ul className="flex list-none ml-[20px] text-[16px] font-[400] text-[#FCFCFC] space-x-[80px]">
          <li>Features</li>
          <li>Help</li>
          <li>Privacy Policy</li>
          <li>Terms of Service</li>
        </ul>

        <p className="text-[16px] text-[#8F8F8F] font-400 ml-[30px]">
          © 2025 Evolve2p. All rights reserved.
        </p>
      </div>
      <div className="flex space-x-[10px] ml-[20px] mt-[50px]   ">
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
        <Image src={Apps} alt="apps" className="w-[108px] h-[36px]" />

        <div className="flex  w-full ml-[55%] space-x-[5px]  mt-[-5px]">
          <div className="bg-[#222222] w-[32px] h-[32px] rounded-full flex items-center justify-center">
            <Image src={xicon} alt="iconx" />
          </div>
          <div className="bg-[#222222] w-[32px] h-[32px] rounded-full flex items-center justify-center">
            <Image src={Discord} alt="discord" />
          </div>
          <div className="bg-[#222222] w-[32px] h-[32px] rounded-full flex items-center justify-center">
            <Image src={Instagram} alt="stargram" />
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