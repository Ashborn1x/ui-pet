import React, { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [deviceView, setDeviceView] = useState<'mobile' | 'responsive'>('mobile');

  return (
    <div
      id="app-viewport-root"
      className="min-h-screen w-full bg-[#EFECE3] flex flex-col items-center justify-center p-0 sm:py-6 sm:px-4"
    >
      {/* Top Viewport Mode Switcher (Desktop only subtle tool) */}
      <div
        id="viewport-controls"
        className="hidden sm:flex items-center space-x-2 mb-3 px-3 py-1.5 rounded-full bg-[#E4DFC\-D2] bg-opacity-70 border border-[#D9D3C5] text-xs font-semibold text-[#4F6255] shadow-xs"
      >
        <button
          onClick={() => setDeviceView('mobile')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-full transition-all cursor-pointer ${
            deviceView === 'mobile'
              ? 'bg-white text-[#213025] shadow-xs'
              : 'text-[#63776A] hover:text-[#213025]'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile Mockup (390×844)</span>
        </button>

        <button
          onClick={() => setDeviceView('responsive')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-full transition-all cursor-pointer ${
            deviceView === 'responsive'
              ? 'bg-white text-[#213025] shadow-xs'
              : 'text-[#63776A] hover:text-[#213025]'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Fluid View</span>
        </button>
      </div>

      {/* Main Container */}
      <div
        id="device-chassis"
        className={`w-full transition-all duration-300 flex flex-col justify-center ${
          deviceView === 'mobile'
            ? 'sm:max-w-[395px] sm:h-[844px] sm:rounded-[44px] sm:border-[9px] sm:border-[#2C3830] sm:shadow-[0_25px_60px_-15px_rgba(30,42,34,0.35),0_0_0_1px_rgba(255,255,255,0.2)]'
            : 'max-w-md sm:h-[844px] sm:rounded-3xl sm:border border-[#DDD8CB] sm:shadow-lg'
        } h-screen bg-[#F7F5EE] overflow-hidden relative`}
      >
        {children}
      </div>
    </div>
  );
};
