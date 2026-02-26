"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Elogo from "../public/Assets/Evolve2p_elogo/Fav Icon/Logo.svg";

// Import icons from lucide-react
import { ArrowUpDown, Repeat, ClipboardList } from 'lucide-react';

const FloatingParticles = () => {
  const [particles, setParticles] = useState<Array<{id: number; x: number; y: number; size: number; duration: number}>>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 20 + 10
      }));
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-[#4DF2BE]/20 to-black/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `float ${particle.duration}s linear infinite`
          }}
        />
      ))}
    </div>
  );
};

const AnimatedTitle = ({ onColorChange }: { onColorChange: (color: string) => void }) => {
  const [displayText, setDisplayText] = useState<string>('');
  const [currentColor, setCurrentColor] = useState<string>('#4DF2BE');
  const [glowIntensity, setGlowIntensity] = useState<number>(1);
  const fullText: string = 'Welcome to Evolve2p';
  const colors: string[] = ['#4DF2BE', '#000000', '#3DF2A7', '#2DF291', '#1DF27B'];

  useEffect(() => {
    let currentIndex: number = 0;
    let direction: number = 1;
    let pauseCounter: number = 0;
    let animationActive: boolean = true;

    // Glow animation
    const glowInterval = setInterval(() => {
      setGlowIntensity(prev => (prev === 1 ? 1.2 : 1));
    }, 2000);

    const animateText = (): void => {
      if (!animationActive) return;

      if (direction === 1) {
        if (currentIndex <= fullText.length) {
          setDisplayText(fullText.substring(0, currentIndex));
          currentIndex++;
        } else {
          if (pauseCounter++ > 15) {
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

    const interval = setInterval(animateText, 120);
    return () => {
      animationActive = false;
      clearInterval(interval);
      clearInterval(glowInterval);
    };
  }, [currentColor, onColorChange]);

  return (
    <h1 
      className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#4DF2BE] via-white to-[#4DF2BE] bg-clip-text text-transparent"
      style={{
        filter: `drop-shadow(0 0 ${glowIntensity * 20}px ${currentColor}40)`,
        transition: 'all 0.5s ease-in-out'
      }}
    >
      {displayText}
      <span className="animate-pulse text-white">|</span>
    </h1>
  );
};

// Updated FeatureCard to accept a React node for the icon
const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) => (
  <div 
    className="group bg-gradient-to-br from-[#4DF2BE]/10 to-black/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:from-[#4DF2BE]/20 hover:to-black/20 hover:border-[#4DF2BE]/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 text-[#4DF2BE]">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-200 text-sm leading-relaxed">{description}</p>
  </div>
);

const AnimatedButton = ({ href, children, variant = 'primary', className = '' }: { href: string; children: React.ReactNode; variant?: 'primary' | 'secondary'; className?: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyles = "relative overflow-hidden font-bold py-4 px-8 rounded-2xl transition-all duration-500 no-underline group";
  
  const variants = {
    primary: "bg-gradient-to-r from-[#4DF2BE] to-[#2DF291] hover:from-[#4DF2BE] hover:to-[#3DF2A7] text-black shadow-2xl hover:shadow-[#4DF2BE]/50",
    secondary: "bg-gradient-to-r from-black/70 to-black hover:from-black hover:to-black/90 text-[#4DF2BE] border border-[#4DF2BE]/20 hover:border-[#4DF2BE]/40 shadow-2xl"
  };

  return (
    <Link
      href={href}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <svg 
          className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </span>
      
      {/* Animated background effect */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-white/10 to-transparent transform ${
          isHovered ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-500`}
      />
    </Link>
  );
};

export default function Home() {
  const [bgGradient, setBgGradient] = useState<string>('linear-gradient(135deg, #000000 0%, #0A0A0A 50%, #000000 100%)');
  const [featuresVisible, setFeaturesVisible] = useState(false);

  useEffect(() => {
    setFeaturesVisible(true);
  }, []);

  const handleColorChange = (color: string) => {
    const gradients = {
      '#4DF2BE': 'linear-gradient(135deg, #000000 0%, #0A1A14 50%, #000000 100%)',
      '#000000': 'linear-gradient(135deg, #000000 0%, #0A0A0A 50%, #000000 100%)',
      '#3DF2A7': 'linear-gradient(135deg, #000000 0%, #0A1F17 50%, #000000 100%)',
      '#2DF291': 'linear-gradient(135deg, #000000 0%, #0A2519 50%, #000000 100%)',
      '#1DF27B': 'linear-gradient(135deg, #000000 0%, #0A2A1C 50%, #000000 100%)'
    };
    
    setBgGradient(gradients[color as keyof typeof gradients] || gradients['#4DF2BE']);
  };

  // Features with real icons
  const features = [
    {
      icon: <ArrowUpDown size={32} />,
      title: "Send & Receive Crypto",
      description: "Seamlessly send and receive cryptocurrencies with friends, family, or businesses instantly with low fees"
    },
    {
      icon: <Repeat size={32} />,
      title: "Swap Any Token",
      description: "Instantly swap between hundreds of cryptocurrencies with competitive rates and minimal slippage"
    },
    {
      icon: <ClipboardList size={32} />,
      title: "Create & Find Offers",
      description: "Create buy/sell offers or discover existing offers to trade directly with other users at your preferred rates"
    }
  ];

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden transition-all duration-1000 bg-[#4DF2BE]"
      style={{ background: bgGradient }}
    >
      {/* Animated Background Elements */}
      <FloatingParticles />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4DF2BE]/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-black/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-[#4DF2BE]/10 rounded-full blur-3xl animate-pulse delay-500" />

      <div className="relative z-10 text-center px-6 py-12 max-w-6xl mx-auto">
        {/* Main Title Section */}
        <div className="mb-16">
          <AnimatedTitle onColorChange={handleColorChange} />
          <p className="text-xl md:text-2xl mb-12 text-gray-200 font-light max-w-2xl mx-auto leading-relaxed">
            Experience the future of cryptocurrency trading with Evolve2p - the user-friendly platform for sending, receiving, swapping, and trading crypto with ease.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <AnimatedButton href="/Signups/Email" variant="primary">
              Start Trading Now
            </AnimatedButton>
            <AnimatedButton href="/Logins/login" variant="secondary">
              Access Your Account
            </AnimatedButton>
          </div>
        </div>

        {/* Features Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 ${
          featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 200}
            />
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {[
            { number: "50K+", label: "Active Users" },
            { number: "$10M+", label: "Monthly Volume" },
            { number: "500+", label: "Tokens Supported" },
            { number: "24/7", label: "Trading" }
          ].map((stat, index) => (
            <div 
              key={index}
              className="text-center opacity-0 animate-fade-in"
              style={{ animationDelay: `${1200 + index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className="text-2xl md:text-3xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-sm text-[#4DF2BE]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-0 animate-fade-in" style={{ animationDelay: '1800ms', animationFillMode: 'forwards' }}>
          <div className="text-[#4DF2BE] text-sm">Trusted by crypto users worldwide</div>
          <div className="flex gap-6">
            <div className="bg-[#4DF2BE] p-3 rounded-xl flex items-center justify-center">
              <Image 
                src={Elogo} 
                alt="Evolve2p Logo"
                width={48}
                height={48}
                className="h-12 w-auto filter invert brightness-0"
                style={{ 
                  filter: 'invert(14%) sepia(6%) saturate(1191%) hue-rotate(176deg) brightness(92%) contrast(92%)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-[20px] left-0 right-0 text-center">
        <p className="text-[#4DF2BE] text-sm">
           Evolve2p crypto revolution &copy; {new Date().getFullYear()}. All rights reserved.
        </p>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .feature-card {
          animation: fade-in 0.8s ease-out both;
        }
      `}</style>
    </div>
  );
}