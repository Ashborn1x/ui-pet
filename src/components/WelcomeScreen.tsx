import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, ChevronRight, ChevronLeft } from 'lucide-react';

interface WelcomeScreenProps {
  onAddPet: () => void;
  onSkip: () => void;
}

interface SlideContent {
  id: number;
  title: string;
  description: string;
  image: string;
  alt: string;
  bgTint: string;
}

const ONBOARDING_SLIDES: SlideContent[] = [
  {
    id: 0,
    title: 'Pet Care\nMade Simple',
    description: 'Create a convenient profile for your pet and manage every aspect of their care in one place.',
    image: '/src/assets/images/clay_pet_care_simple_1789625871275.jpg',
    alt: '3D clay cartoon puppy with dog food bowl, bone and toys',
    bgTint: 'bg-[#FBEBD9]',
  },
  {
    id: 1,
    title: 'Health & Wellness\nUnder Control',
    description: 'Track vaccinations, medical records, and important events to ensure your furry friend’s wellbeing.',
    image: '/src/assets/images/clay_pet_wellness_1789625894177.jpg',
    alt: '3D clay puppy with first-aid kit, medicine bottle, and vaccination shield',
    bgTint: 'bg-[#EDE7F6]',
  },
  {
    id: 2,
    title: 'Daily Care &\nSmart Routines',
    description: 'Schedule feedings, log fresh water, track active walks, and celebrate daily care streaks.',
    image: '/src/assets/images/clay_cat_daily_routine_1789625909416.jpg',
    alt: '3D clay kitten and puppy with food bowl and routine calendar',
    bgTint: 'bg-[#EBF1EC]',
  },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onAddPet,
  onSkip,
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const activeSlide = ONBOARDING_SLIDES[currentSlide];
  const isLastSlide = currentSlide === ONBOARDING_SLIDES.length - 1;

  const handleNextSlide = () => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onAddPet();
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  return (
    <div
      id="welcome-screen-container"
      className="relative flex flex-col justify-between w-full h-full min-h-[640px] bg-[#FFF5EA] text-[#222E26] overflow-hidden select-none"
    >
      {/* Top Mobile Status Bar Floating Directly on Top of the Image */}
      <header
        id="welcome-status-bar"
        className="absolute top-0 left-0 right-0 pt-3 px-6 flex items-center justify-between z-30 text-[#222E26] text-xs font-semibold pointer-events-auto"
      >
        <span id="status-bar-time" className="font-bold text-[14px]">9:41</span>

        {/* Dynamic Island Notch */}
        <div id="status-bar-notch" className="w-24 h-5 bg-[#1B261F] rounded-full flex items-center justify-between px-2 shadow-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-[#121A15] border border-white/10" />
          <div className="w-2 h-2 rounded-full bg-[#24352B]" />
        </div>

        {/* Tactile Skip Pill Button (Matching user image top right) */}
        <button
          id="welcome-skip-pill-btn"
          onClick={onSkip}
          className="px-3.5 py-1.5 rounded-full bg-white/85 hover:bg-white text-[#4A5D50] hover:text-[#223026] text-xs font-bold shadow-[0_2px_6px_rgba(50,70,55,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] border border-white/60 transition-all cursor-pointer backdrop-blur-xs"
        >
          Skip
        </button>
      </header>

      {/* Full 3D Clay Illustration Stage - Bleeds edge-to-edge with no background framing */}
      <section
        id="welcome-hero-visual"
        aria-label="3D clay pet illustration"
        className="flex-1 w-full relative overflow-hidden select-none"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={activeSlide.image}
            alt={activeSlide.alt}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-bottom"
          />
        </AnimatePresence>

        {/* Side Chevrons for slide navigation */}
        {currentSlide > 0 && (
          <button
            onClick={handlePrevSlide}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-[#4A5D50] shadow-sm z-20 cursor-pointer backdrop-blur-xs transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        {currentSlide < ONBOARDING_SLIDES.length - 1 && (
          <button
            onClick={handleNextSlide}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-[#4A5D50] shadow-sm z-20 cursor-pointer backdrop-blur-xs transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </section>

      {/* Bottom Clay Sheet - Text Holder & Action Area (Seamlessly overlaps the bottom of the full image) */}
      <section
        id="welcome-content-sheet"
        aria-label="Welcome information and actions"
        className="relative z-20 -mt-6 px-6 pt-7 pb-8 bg-[#FFF5EA] rounded-t-[38px] border-t border-white/90 shadow-[0_-12px_36px_-8px_rgba(50,40,30,0.06),inset_0_2px_1px_rgba(255,255,255,0.95)] flex flex-col items-center text-center flex-shrink-0 w-full"
      >
        {/* Static Sized Text Holder Box - Prevents Any Size Jumps or Resizing */}
        <div
          id="welcome-text-holder"
          className="w-full max-w-[290px] h-[132px] flex flex-col items-center justify-center text-center flex-shrink-0 mb-4 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full flex flex-col items-center justify-center"
            >
              {/* Primary Title - Matching User Screenshot */}
              <h1
                id="welcome-title"
                className="text-[25px] sm:text-[27px] font-extrabold tracking-tight text-[#1A221D] leading-[1.18] whitespace-pre-line text-center mb-2.5"
              >
                {activeSlide.title}
              </h1>

              {/* Explanatory description - Matching User Screenshot */}
              <p
                id="welcome-description"
                className="text-[#525F56] text-[13.5px] leading-relaxed max-w-[280px] font-normal text-center"
              >
                {activeSlide.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Pagination Dots Matching User Image (`o — o o`) */}
        <nav
          id="welcome-pagination-dots"
          aria-label="Slide navigation"
          className="flex items-center space-x-1.5 mb-5 flex-shrink-0"
        >
          {ONBOARDING_SLIDES.map((slide, idx) => {
            const isActive = currentSlide === idx;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? 'w-6 h-2 bg-[#202E24] shadow-xs'
                    : 'w-2 h-2 bg-[#D1CBC0] hover:bg-[#A8A194]'
                }`}
              />
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div id="welcome-action-group" className="w-full max-w-[320px] flex flex-col items-center space-y-2.5 flex-shrink-0">
          {isLastSlide ? (
            <>
              {/* Primary Action on Last Slide: Add a Pet */}
              <motion.button
                id="welcome-add-pet-btn"
                whileTap={{ scale: 0.98 }}
                onClick={onAddPet}
                className="w-full py-3.5 px-6 rounded-2xl clay-btn-primary font-bold text-[15px] flex items-center justify-center space-x-2 cursor-pointer shadow-[0_8px_18px_-3px_rgba(65,99,78,0.36)]"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
                <span>Add a Pet</span>
              </motion.button>

              {/* Secondary Action on Last Slide: I'll do this later */}
              <motion.button
                id="welcome-skip-btn"
                whileTap={{ scale: 0.98 }}
                onClick={onSkip}
                className="w-full py-2 text-center text-[#687C70] hover:text-[#202E24] font-semibold text-[13px] transition-colors cursor-pointer"
              >
                I’ll do this later
              </motion.button>
            </>
          ) : (
            <>
              {/* Primary Action on Prior Slides: Next */}
              <motion.button
                id="welcome-next-btn"
                whileTap={{ scale: 0.98 }}
                onClick={handleNextSlide}
                className="w-full py-3.5 px-6 rounded-2xl clay-btn-primary font-bold text-[15px] flex items-center justify-center space-x-2 cursor-pointer shadow-[0_8px_18px_-3px_rgba(65,99,78,0.36)]"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </motion.button>

              {/* Static spacer keeping the card height locked and identical across all slides */}
              <div className="w-full py-2 text-[13px] invisible select-none pointer-events-none" aria-hidden="true">
                I’ll do this later
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
