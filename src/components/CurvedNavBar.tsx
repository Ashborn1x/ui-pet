import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  Footprints, 
  PawPrint, 
  Calendar,
  Settings,
  User,
  Sparkles
} from 'lucide-react';

export type NavTabId = 'home' | 'pack' | 'routine' | 'profile';

export interface NavTabItem {
  id: NavTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface CurvedNavBarProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  colorTheme?: 'sage' | 'terracotta' | 'coral';
  variant?: 'minimal' | 'curved';
}

export const NAV_TABS: NavTabItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'pack', label: 'Pack', icon: PawPrint },
  { id: 'routine', label: 'Activity', icon: Calendar },
  { id: 'profile', label: 'Settings', icon: Settings },
];

export const CurvedNavBar: React.FC<CurvedNavBarProps> = ({
  activeTab,
  onTabChange,
  colorTheme = 'sage',
  variant = 'minimal',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [barWidth, setBarWidth] = useState(352);
  const barHeight = 62;
  const cornerRadius = 18;

  // Measure bar width dynamically for responsiveness
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        const measured = containerRef.current.clientWidth;
        if (measured > 0) {
          setBarWidth(measured);
        }
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Minimal Mobile Bar from reference screenshot
  if (variant === 'minimal') {
    return (
      <div className="fixed bottom-3 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="w-full max-w-[372px] bg-white/95 backdrop-blur-md rounded-[28px] border border-[#ECE7DC] shadow-[0_12px_28px_-6px_rgba(40,55,45,0.08),0_2px_6px_rgba(40,55,45,0.03)] px-3 py-2 flex items-center justify-around pointer-events-auto">
          {NAV_TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 group cursor-pointer relative focus:outline-hidden"
              >
                <div className="relative flex flex-col items-center">
                  <Icon 
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isActive ? 'text-[#355A43] stroke-[2.3]' : 'text-[#87968B] group-hover:text-[#557A63] stroke-[1.9]'
                    }`} 
                  />
                  <span 
                    className={`text-[11px] mt-1 transition-colors duration-200 ${
                      isActive ? 'text-[#1F2E23] font-bold' : 'text-[#87968B] group-hover:text-[#557A63] font-medium'
                    }`}
                  >
                    {tab.label}
                  </span>

                  {isActive ? (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="w-5 h-[2.5px] bg-[#456E55] rounded-full mt-1"
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    />
                  ) : (
                    <div className="w-5 h-[2.5px] bg-transparent mt-1" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const activeIndex = Math.max(
    0,
    NAV_TABS.findIndex((tab) => tab.id === activeTab)
  );

  // Tab distribution with 24px outer horizontal insets
  // Guarantees equal spacing and ample shoulder clearance even on outer tabs (Home & Profile)
  const horizontalInset = 24;
  const effectiveWidth = Math.max(320, barWidth);
  const tabWidth = (effectiveWidth - horizontalInset * 2) / NAV_TABS.length;
  const activeX = horizontalInset + (activeIndex + 0.5) * tabWidth;

  // Exact concentric circular cutout math inspired by react-native-curved-bottom-bar
  // Button radius: 23px (46px diameter) with center at y = 12px
  // Cutout radius: 31px (gives an exact 8px uniform halo space around the button)
  // Shoulder radius: 12px (tangent to y=0 and tangent to cutout arc)
  const cy = 12;
  const rc = 31; // cutout radius (23px button + 8px uniform gap)
  const rs = 12; // shoulder fillet radius
  const notchHalf = rc + rs; // 43px

  const leftShoulderStart = activeX - notchHalf;
  const leftCradleEdge = activeX - rc;
  const rightCradleEdge = activeX + rc;
  const rightShoulderStart = activeX + notchHalf;

  // Continuous C1 tangent SVG path:
  // Flat line -> Left convex shoulder arc -> Concave cradle arc (8px clearance) -> Right convex shoulder arc -> Flat line
  const pathD = [
    `M ${cornerRadius} 0`,
    `L ${Math.max(cornerRadius, leftShoulderStart)} 0`,
    `A ${rs} ${rs} 0 0 1 ${leftCradleEdge} ${cy}`,
    `A ${rc} ${rc} 0 0 0 ${rightCradleEdge} ${cy}`,
    `A ${rs} ${rs} 0 0 1 ${Math.min(effectiveWidth - cornerRadius, rightShoulderStart)} 0`,
    `L ${effectiveWidth - cornerRadius} 0`,
    `Q ${effectiveWidth} 0 ${effectiveWidth} ${cornerRadius}`,
    `L ${effectiveWidth} ${barHeight - cornerRadius}`,
    `Q ${effectiveWidth} ${barHeight} ${effectiveWidth - cornerRadius} ${barHeight}`,
    `L ${cornerRadius} ${barHeight}`,
    `Q 0 ${barHeight} 0 ${barHeight - cornerRadius}`,
    `L 0 ${cornerRadius}`,
    `Q 0 0 ${cornerRadius} 0`,
    `Z`,
  ].join(' ');

  const ActiveIcon = NAV_TABS[activeIndex].icon;

  // Theme palettes matching PetPals and the reference
  const themeStyles = {
    sage: {
      barFilter: 'drop-shadow(0 10px 24px rgba(45, 75, 55, 0.28)) drop-shadow(0 3px 6px rgba(45, 75, 55, 0.16))',
      gradientId: 'sageBarGradient',
      bubbleBg: 'linear-gradient(135deg, #629476 0%, #4D7B5F 50%, #355A43 100%)',
      bubbleShadow: '0 6px 16px rgba(45, 75, 55, 0.42), 0 2px 4px rgba(0,0,0,0.1), inset 0 1.5px 2px rgba(255,255,255,0.7), inset 0 -1.5px 2px rgba(0,0,0,0.15)',
    },
    terracotta: {
      barFilter: 'drop-shadow(0 10px 24px rgba(185, 75, 50, 0.28)) drop-shadow(0 3px 6px rgba(185, 75, 50, 0.16))',
      gradientId: 'terracottaBarGradient',
      bubbleBg: 'linear-gradient(135deg, #DF7F6A 0%, #C46049 50%, #A44630 100%)',
      bubbleShadow: '0 6px 16px rgba(185, 75, 50, 0.42), 0 2px 4px rgba(0,0,0,0.1), inset 0 1.5px 2px rgba(255,255,255,0.7), inset 0 -1.5px 2px rgba(0,0,0,0.15)',
    },
    coral: {
      barFilter: 'drop-shadow(0 10px 24px rgba(230, 56, 78, 0.32)) drop-shadow(0 3px 6px rgba(230, 56, 78, 0.18))',
      gradientId: 'coralBarGradient',
      bubbleBg: 'linear-gradient(135deg, #FF7B6B 0%, #FA5E57 50%, #E8364F 100%)',
      bubbleShadow: '0 6px 16px rgba(230, 56, 78, 0.45), 0 2px 4px rgba(0,0,0,0.1), inset 0 1.5px 2px rgba(255,255,255,0.7), inset 0 -1.5px 2px rgba(0,0,0,0.15)',
    },
  };

  const currentStyle = themeStyles[colorTheme] || themeStyles.sage;

  return (
    <div
      id="curved-notch-nav-container"
      className="sticky bottom-3 z-50 w-full max-w-[360px] mx-auto px-2 pointer-events-auto"
    >
      <div
        ref={containerRef}
        className="relative w-full h-[62px] flex items-center justify-between"
      >
        {/* SVG Curved Bar with Concentric Circular Notch Cutout */}
        <svg
          className="absolute inset-0 w-full h-[62px] overflow-visible pointer-events-none"
          style={{
            filter: currentStyle.barFilter,
          }}
        >
          <defs>
            {/* Earthy Sage Theme Gradient (Default - Matches App Theme) */}
            <linearGradient id="sageBarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#558066" />
              <stop offset="40%" stopColor="#456E55" />
              <stop offset="100%" stopColor="#30543E" />
            </linearGradient>

            {/* Warm Terracotta Theme Gradient */}
            <linearGradient id="terracottaBarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D2725C" />
              <stop offset="40%" stopColor="#BA5A43" />
              <stop offset="100%" stopColor="#9B422D" />
            </linearGradient>

            {/* Vibrant Coral Gradient (Matches Reference Screenshot) */}
            <linearGradient id="coralBarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FA6556" />
              <stop offset="40%" stopColor="#FA5359" />
              <stop offset="100%" stopColor="#E6384E" />
            </linearGradient>
          </defs>

          {/* Animated Curved Notch Path with Uniform Circular Space */}
          <motion.path
            animate={{ d: pathD }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            fill={`url(#${currentStyle.gradientId})`}
          />
        </svg>

        {/* Elevated Floating Circular Bubble with Exact 8px Surrounding Space */}
        <motion.div
          animate={{ x: activeX - 23, y: -11 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          className="absolute left-0 top-0 w-[46px] h-[46px] rounded-full flex items-center justify-center cursor-pointer pointer-events-auto z-20"
          style={{
            background: currentStyle.bubbleBg,
            boxShadow: currentStyle.bubbleShadow,
          }}
        >
          {/* Subtle Outer Specular Ring for Polished Clay Aesthetic */}
          <div className="absolute inset-0 rounded-full border border-white/40 pointer-events-none" />

          {/* Icon with Dynamic Pop Animation */}
          <motion.div
            key={activeTab}
            initial={{ scale: 0.65, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.65, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 450, damping: 22 }}
            className="text-white flex items-center justify-center pointer-events-none"
          >
            <ActiveIcon className="w-5 h-5 stroke-[2.4] drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.25)]" />
          </motion.div>
        </motion.div>

        {/* Inactive Tab Buttons with 24px Inset Alignment */}
        <div className="relative z-10 w-full h-full flex items-center px-6">
          {NAV_TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className="flex-1 h-full flex flex-col items-center justify-center cursor-pointer group focus:outline-hidden"
                aria-label={tab.label}
              >
                <div
                  className={`transition-all duration-200 flex items-center justify-center ${
                    isActive
                      ? 'opacity-0 pointer-events-none'
                      : 'opacity-85 group-hover:opacity-100 group-hover:scale-110 text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2] drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
