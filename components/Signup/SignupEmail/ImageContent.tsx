'use client';

import React from 'react'
import Image from 'next/image';
import image from '../../../public/Assets/Evolve2p_img/emerald 1.png';
import groupS from '../../../public/Assets/Evolve2p_groupS/Group 7.png';
import groupN from '../../../public/Assets/Evolve2p_groupN/Group 9.png';
import groupX from '../../../public/Assets/Evolve2p_groupX/Group 6.png';
import groupF from '../../../public/Assets/Evolve2p_groupF/Group 5.png';
import groupE from '../../../public/Assets/Evolve2p_groupE/Group 8.png';
import groupFr from '../../../public/Assets/Evolve2p_groupFr/Group 4.png';

const ImageContent = () => {
  return (
    <div className="flex h-full mt-[-150px] items-center justify-center">

<Image
   src={groupE}
   alt="smallyellow" 
   className="relative left-[40%] top-[-120px] "
   
   />

<Image
   src={groupFr}
   alt="groupink" 
   className="relative left-[20%] top-[25px] "
   
   />

      <Image 
        src={image} 
        alt="Evolve2p Logo" 
        width={592.741} 
        height={518.768} 
        className="object-contain absolute"
      />


     <Image
   src={groupN}
   alt="smallpink" 
   className="relative top-[35px] left-[-45px]"
   
   />     

   <Image
   src={groupS}
   alt="groupgreen" 
   className="relative top-[110px] left-[80px]"
   
   />


  
   <Image
   src={groupX}
   alt="groupblue" 
   className="relative right-[45%]  top-[-85px]"
   
   />


   <Image
   src={groupF}
   alt="smallblue" 
   className="relative top-[-40px] right-[130px]"
   
   />







  


      
    </div>
  )
}

export default ImageContent