"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const AnimatedTitle = ({ onColorChange }: { onColorChange: (color: string) => void }) => {
  const [displayText, setDisplayText] = useState<string>('');
  const [currentColor, setCurrentColor] = useState<string>('#3B82F6');
  const fullText: string = 'Welcome to Evolve2p';
  const colors: string[] = ['#3B82F6', '#10B981', '#FFFFFF']; // Blue, Emerald, White

  useEffect(() => {
    let currentIndex: number = 0;
    let direction: number = 1;
    let pauseCounter: number = 0;
    let animationActive: boolean = true;

    const animateText = (): void => {
      if (!animationActive) return;

      if (direction === 1) {
        if (currentIndex <= fullText.length) {
          setDisplayText(fullText.substring(0, currentIndex));
          currentIndex++;
        } else {
          if (pauseCounter++ > 10) {
            direction = -1;
            pauseCounter = 0;
          }
        }
      } else {
        if (currentIndex >= 0) {
          setDisplayText(fullText.substring(0, currentIndex));
          currentIndex--;
        } else {
          const newColor = colors[(colors.indexOf(currentColor) + 1) % colors.length];
          setCurrentColor(newColor);
          onColorChange(newColor);
          direction = 1;
        }
      }
    };

    const interval = setInterval(animateText, 150);
    return () => {
      animationActive = false;
      clearInterval(interval);
    };
  }, [currentColor, onColorChange]);

  return (
    <h1 className="text-4xl font-bold mb-6" style={{ color: currentColor }}>
      {displayText}
      <span className="animate-pulse">|</span>
    </h1>
  );
};

export default function Home() {
  const [bgColor, setBgColor] = useState<string>('#0F1012');
  const [buttonStyles, setButtonStyles] = useState({
    signUp: {
      bg: 'bg-blue-600',
      hover: 'hover:bg-blue-700',
      text: 'text-white'
    },
    login: {
      bg: 'bg-gray-600',
      hover: 'hover:bg-gray-700',
      text: 'text-white'
    }
  });
  
  const getStylesForColor = (textColor: string) => {
    switch(textColor) {
      case '#3B82F6': // Blue text
        return {
          bg: '#0F1012',
          signUp: {
            bg: 'bg-blue-600',
            hover: 'hover:bg-blue-700',
            text: 'text-[#3B82F6]' 
          },
          login: {
            bg: 'bg-gray-600',
            hover: 'hover:bg-gray-700',
            text: 'text-[#3B82F6]' 
          }
        };
      case '#10B981': // Emerald text
        return {
          bg: '#111827',
          signUp: {
            bg: 'bg-emerald-600',
            hover: 'hover:bg-emerald-700',
            text: 'text-[#10B981]' 
          },
          login: {
            bg: 'bg-blue-600',
            hover: 'hover:bg-blue-700',
            text: 'text-[#10B981]' 
          }
        };
      case '#FFFFFF': // White text
        return {
          bg: '#1F2937',
          signUp: {
            bg: 'bg-gray-600',
            hover: 'hover:bg-gray-700',
            text: 'text-[#FFFFFF]' 
          },
          login: {
            bg: 'bg-emerald-600',
            hover: 'hover:bg-emerald-700',
            text: 'text-[#FFFFFF]' 
          }
        };
      default:
        return {
          bg: '#0F1012',
          signUp: {
            bg: 'bg-blue-600',
            hover: 'hover:bg-blue-700',
            text: 'text-white'
          },
          login: {
            bg: 'bg-gray-600',
            hover: 'hover:bg-gray-700',
            text: 'text-white'
          }
        };
    }
  };

  const handleColorChange = (color: string) => {
    const { bg, signUp, login } = getStylesForColor(color);
    setBgColor(bg);
    setButtonStyles({
      signUp,
      login
    });
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center transition-colors duration-1000"
      style={{ backgroundColor: bgColor }}
    >
      <div className="text-center px-6 py-12 rounded-xl">
        <AnimatedTitle onColorChange={handleColorChange} />
        <p className="text-xl mb-8 text-[#ffffff]">Your secure trading platform</p>

        <div className="flex gap-[20px] justify-center">
          <Link
            href="/Signups/Email"
            className={`${buttonStyles.signUp.bg} ${buttonStyles.signUp.hover} ${buttonStyles.signUp.text} font-bold py-2 px-4 rounded transition-colors duration-300 no-underline hover:underline`}
          >
            Sign Up
          </Link>
          <Link
            href="/Logins/login"
            className={`${buttonStyles.login.bg} ${buttonStyles.login.hover} ${buttonStyles.login.text} font-bold py-2 px-4 rounded transition-colors duration-300 no-underline hover:underline`}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}