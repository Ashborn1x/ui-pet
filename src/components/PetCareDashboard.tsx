import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Check, 
  Clock, 
  Utensils, 
  Droplets, 
  Footprints, 
  Pill, 
  Heart,
  X,
  RotateCcw,
  Sparkles,
  Weight as WeightIcon,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Bell,
  Phone,
  Palette,
  PawPrint,
  Search,
  SlidersHorizontal,
  Filter,
  Cat,
  Dog,
  Activity,
  Scale,
  SquarePen
} from 'lucide-react';
import { Pet, CareLog, CareType } from '../types';
import { CurvedNavBar, NavTabId } from './CurvedNavBar';
import { PetProfileView } from './PetProfileView';

interface PetCareDashboardProps {
  pets: Pet[];
  selectedPetId: string;
  onSelectPet: (id: string) => void;
  onOpenAddPet: () => void;
  onReturnToWelcome: () => void;
  logs: CareLog[];
  onToggleLog: (logId: string) => void;
  onAddLog: (newLog: Omit<CareLog, 'id'>) => void;
  onUpdatePet?: (updatedPet: Pet) => void;
}

export const PetCareDashboard: React.FC<PetCareDashboardProps> = ({
  pets,
  selectedPetId,
  onSelectPet,
  onOpenAddPet,
  onReturnToWelcome,
  logs,
  onToggleLog,
  onAddLog,
  onUpdatePet,
}) => {
  const [currentTab, setCurrentTab] = useState<NavTabId>('pack');
  const [viewingPet, setViewingPet] = useState<Pet | null>(null);
  const [profileMode, setProfileMode] = useState<'pet' | 'guardian'>('pet');
  const [colorTheme, setColorTheme] = useState<'sage' | 'terracotta' | 'coral'>('sage');
  const [navBarStyle, setNavBarStyle] = useState<'minimal' | 'curved'>('minimal');
  const [showAllPetsRoutine, setShowAllPetsRoutine] = useState(false);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Quick log form state
  const [logType, setLogType] = useState<CareType>('walk');
  const [logTitle, setLogTitle] = useState('');
  const [logDetail, setLogDetail] = useState('');

  const currentPet = pets.find((p) => p.id === selectedPetId) || pets[0] || {
    id: 'pet-oliver',
    name: 'Oliver',
    species: 'dog',
    breed: 'Golden Retriever Mix',
    ageYears: 2,
    ageMonths: 4,
    weight: 28.5,
    weightUnit: 'lbs',
    avatarUrl: '/src/assets/images/golden_retriever_photo_1789664976220.jpg',
  };

  // Determine greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning, Jordan!';
    if (hour < 17) return 'Afternoon, Jordan!';
    return 'Evening, Jordan!';
  };

  // Cute Claymorphism Dog Greeting State & Interactive Phrases
  const CLAY_DOG_GREETINGS = [
    "Woof! It's a paw-fect day for a walk! 🐾",
    "Tail wags for you! Ready for today's adventures? 🐕",
    "Did you know? You're our favorite human! ✨",
    "Sniffing around... looks like great times ahead! 🎾",
    "Belly rubs and healthy treats make the best day! 🦴",
  ];
  const [clayDogGreetingIndex, setClayDogGreetingIndex] = useState(0);
  const [clayDogBounceKey, setClayDogBounceKey] = useState(0);
  const [showPawBurst, setShowPawBurst] = useState(false);

  const handleClayDogTap = () => {
    setClayDogGreetingIndex((prev) => (prev + 1) % CLAY_DOG_GREETINGS.length);
    setClayDogBounceKey((prev) => prev + 1);
    setShowPawBurst(true);
    setTimeout(() => setShowPawBurst(false), 900);
  };

  // Filter logs for active pet and for all pack
  const activePetLogs = logs.filter((l) => l.petId === currentPet.id);
  const displayedLogs = showAllPetsRoutine ? logs : activePetLogs;

  // Active pet routine progress metrics
  const activeTotal = activePetLogs.length;
  const activeCompleted = activePetLogs.filter((l) => l.completed).length;
  const progressPercent = activeTotal > 0 ? Math.round((activeCompleted / activeTotal) * 100) : 100;

  // Next upcoming pending activity for active pet
  const nextPendingActivity = activePetLogs.find((l) => !l.completed);

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logTitle.trim()) return;

    onAddLog({
      petId: currentPet.id,
      type: logType,
      title: logTitle.trim(),
      detail: logDetail.trim() || `Daily routine for ${currentPet.name}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      completed: false,
    });

    setLogTitle('');
    setLogDetail('');
    setIsQuickLogOpen(false);
  };

  const handleInstantQuickLog = (type: CareType) => {
    let title = '';
    let detail = '';

    switch (type) {
      case 'walk':
        title = `Walk ${currentPet.name}`;
        detail = '30-minute neighborhood stroll';
        break;
      case 'meal':
        title = `${currentPet.name}'s Meal`;
        detail = 'Nutritious portion served';
        break;
      case 'water':
        title = 'Fresh Water Refill';
        detail = 'Clean filtered water bowl';
        break;
      case 'meds':
        title = 'Vitamins & Care';
        detail = 'Daily supplement administered';
        break;
      default:
        title = `Care for ${currentPet.name}`;
        detail = 'Daily care completed';
    }

    onAddLog({
      petId: currentPet.id,
      type,
      title,
      detail,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      completed: true,
    });
  };

  const getPetForLog = (petId: string) => {
    return pets.find((p) => p.id === petId) || currentPet;
  };

  return (
    <div
      id="dashboard-root"
      className="relative flex flex-col w-full h-full min-h-[640px] bg-[#F7F4EC] text-[#1F2E23] overflow-hidden select-none"
    >
      {/* Scrollable Main Content Area with Generous Bottom Padding for Floating Curved Nav Bar */}
      <div className="flex-1 overflow-y-auto px-5 pt-3 pb-32 scrollbar-none">
        {/* Top iOS Status Bar Indicator */}
        <div
          id="status-bar-area"
          className="flex items-center justify-between text-[#1F2E23] text-xs font-semibold py-1 mb-2.5"
        >
          <span className="font-bold text-[14px]">9:41</span>
          <div className="flex items-center space-x-1.5 opacity-80">
            <div className="flex items-end space-x-0.5 h-3">
              <span className="w-0.5 h-1 bg-[#1F2E23] rounded-full" />
              <span className="w-0.5 h-1.5 bg-[#1F2E23] rounded-full" />
              <span className="w-0.5 h-2 bg-[#1F2E23] rounded-full" />
              <span className="w-0.5 h-2.5 bg-[#1F2E23] rounded-full" />
            </div>
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 4c4.08 0 7.78 1.66 10.46 4.35l-2.12 2.12C18.17 8.3 15.25 7 12 7s-6.17 1.3-8.34 3.47L1.54 8.35C4.22 5.66 7.92 4 12 4zm0 6c2.58 0 4.93 1.05 6.64 2.76l-2.12 2.12A6.48 6.48 0 0012 13c-1.8 0-3.43.73-4.52 1.88l-2.12-2.12C7.07 11.05 9.42 10 12 10zm0 6c1.1 0 2.05.45 2.83 1.17L12 20.35l-2.83-3.18C9.95 16.45 10.9 16 12 16z" />
            </svg>
            <div className="w-5 h-2.5 rounded-sm border border-[#1F2E23] p-0.5 flex items-center">
              <div className="w-full h-full bg-[#1F2E23] rounded-xs" />
            </div>
          </div>
        </div>

        {/* ================= VIEW 1: HOME (Bento Dashboard) ================= */}
        {currentTab === 'home' && (
          <motion.div
            key="view-home"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3.5"
          >
            {/* Top Utility Bar: Date & Profile Shortcut */}
            <div className="flex items-center justify-between mt-0.5 mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#557A63] bg-[#E5EDE7] px-2.5 py-0.5 rounded-full flex items-center space-x-1.5">
                  <PawPrint className="w-3 h-3 text-[#557A63]" />
                  <span>PetPals Daily</span>
                </span>
                <span className="text-[11.5px] text-[#8A9B8F] font-semibold">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onReturnToWelcome}
                  title="Preview Welcome Screen"
                  className="w-8.5 h-8.5 rounded-full bg-[#EAE5DA] hover:bg-[#DFD9CC] text-[#55675B] flex items-center justify-center transition-all cursor-pointer shadow-[0_2px_6px_rgba(40,55,45,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <div
                  onClick={() => setCurrentTab('profile')}
                  title="Jordan's Profile"
                  className="w-9.5 h-9.5 rounded-full overflow-hidden border-2 border-white shadow-[0_4px_12px_rgba(40,55,45,0.08),inset_0_1px_2px_rgba(255,255,255,0.9)] flex-shrink-0 bg-[#E8E2D4] cursor-pointer hover:ring-2 hover:ring-[#557A63]/40 transition-all"
                >
                  <img
                    src="/src/assets/images/jordan_avatar_photo_1789667660941.jpg"
                    alt="Jordan"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Cute Claymorphism Dog Greeting Banner */}
            <header
              id="dashboard-header-section"
              className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#FFFDF9] via-[#FAF6ED] to-[#F4EEE2] border border-[#EAE3D5] p-4 sm:p-4.5 shadow-[0_10px_26px_-4px_rgba(50,60,50,0.06),inset_0_2px_3px_rgba(255,255,255,0.95)] transition-all mb-1"
            >
              {/* Subtle warm decorative background blobs */}
              <div className="absolute -top-6 -right-6 w-28 h-28 bg-[#F5EAD4]/50 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#E2ECE4]/60 rounded-full blur-xl pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between gap-3">
                {/* Left Side: Greeting & Clay Speech Bubble */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#527763] animate-pulse" />
                    <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#688070]">
                      Active Companion Guide
                    </span>
                  </div>

                  <h1
                    id="greeting-title"
                    className="text-[22px] sm:text-[24px] font-extrabold text-[#1F2E23] tracking-tight leading-tight"
                  >
                    {getGreeting()}
                  </h1>

                  {/* Tactile Clay Speech Bubble */}
                  <div
                    onClick={handleClayDogTap}
                    title="Tap to hear another cute greeting!"
                    className="relative mt-2.5 p-2.5 sm:p-3 rounded-2xl bg-white/95 backdrop-blur-xs border border-[#E8E0D1] shadow-[0_3px_10px_rgba(40,55,45,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] cursor-pointer group hover:border-[#527763]/50 transition-all active:scale-[0.98]"
                  >
                    <p className="text-[12.5px] sm:text-[13px] font-medium text-[#3A4E40] leading-snug">
                      "{CLAY_DOG_GREETINGS[clayDogGreetingIndex]}"
                    </p>

                    <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-[#F0EBE0] text-[10px] font-bold text-[#8A9B8F]">
                      <span className="flex items-center space-x-1 text-[#EDA63A] group-hover:text-[#D98E1C]">
                        <Sparkles className="w-3 h-3" />
                        <span>Tap pup to say hi!</span>
                      </span>
                      <span className="text-[#A2B1A6]">
                        {clayDogGreetingIndex + 1}/{CLAY_DOG_GREETINGS.length}
                      </span>
                    </div>

                    {/* Speech bubble pointer arrow */}
                    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white/95 border-t border-r border-[#E8E0D1] rotate-45" />
                  </div>
                </div>

                {/* Right Side: Cute 3D Claymorphism Dog with Waving Paw */}
                <div
                  className="relative flex-shrink-0 cursor-pointer select-none"
                  onClick={handleClayDogTap}
                  title="Click me to wave and say hi!"
                >
                  <motion.div
                    key={clayDogBounceKey}
                    initial={{ scale: 0.92, y: 4 }}
                    animate={{ scale: [1, 1.1, 0.98, 1], y: [0, -7, 1, 0], rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-[24px] overflow-hidden bg-[#EFE9DF] border-2.5 border-white shadow-[0_10px_22px_-4px_rgba(40,55,45,0.14),inset_0_2px_4px_rgba(255,255,255,0.95)]"
                  >
                    <img
                      src="/src/assets/images/clay_dog_greeting_1789989165370.jpg"
                      alt="Cute claymorphism dog greeting you"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover pointer-events-none"
                    />

                    {/* Clay highlight rim */}
                    <div className="absolute inset-0 rounded-[24px] pointer-events-none shadow-[inset_0_2px_3px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(0,0,0,0.08)]" />

                    {/* Animated Waving Paw Badge */}
                    <motion.div
                      animate={{ rotate: [0, 20, -12, 20, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                      className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.15)] flex items-center justify-center text-[12px] border border-[#EDE7DC]"
                    >
                      👋
                    </motion.div>
                  </motion.div>

                  {/* Floating Paw / Love Burst Reaction */}
                  <AnimatePresence>
                    {showPawBurst && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.7 }}
                        animate={{ opacity: 1, y: -26, scale: 1.15 }}
                        exit={{ opacity: 0, y: -42, scale: 0.8 }}
                        transition={{ duration: 0.65, ease: 'easeOut' }}
                        className="absolute -top-3.5 left-1/2 -translate-x-1/2 pointer-events-none flex items-center space-x-1 text-[11px] font-extrabold text-[#EDA63A] bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-[#F2E8D8] whitespace-nowrap z-20"
                      >
                        <Heart className="w-3 h-3 fill-[#EDA63A] text-[#EDA63A]" />
                        <span>Woof! 🐾</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </header>

            {/* BENTO TILE 1: "Your Pack" Companion Showcase */}
            <section
              id="bento-tile-your-pack"
              className="rounded-[26px] bg-[#FAF8F3] border border-[#EDE8DE] p-4.5 shadow-[0_8px_22px_-4px_rgba(40,55,45,0.04),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)]"
            >
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center space-x-2">
                  <h2
                    id="your-pack-title"
                    className="text-[16.5px] font-extrabold text-[#1F2E23] tracking-tight"
                  >
                    Your Pack
                  </h2>
                  <span className="text-[11px] font-bold text-[#557A63] bg-[#E5EDE7] px-2.5 py-0.5 rounded-full">
                    {pets.length} companions
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onOpenAddPet}
                  className="text-[11.5px] font-bold text-[#627C6B] hover:text-[#4A6052] flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Pet</span>
                </button>
              </div>

              {/* Pack Members Horizontal Row */}
              <div
                id="your-pack-row"
                className="flex items-center space-x-4.5 overflow-x-auto pb-1 scrollbar-none"
              >
                {pets.map((pet) => {
                  const isSelected = pet.id === currentPet.id;
                  const isDog = pet.species === 'dog';

                  return (
                    <div
                      key={pet.id}
                      onClick={() => {
                        onSelectPet(pet.id);
                        setViewingPet(pet);
                      }}
                      className="flex flex-col items-center cursor-pointer group flex-shrink-0"
                    >
                      {/* Clay Ring Avatar */}
                      <div className="relative">
                        <div
                          className={`p-[2.5px] rounded-full transition-all duration-300 ${
                            isSelected
                              ? isDog
                                ? 'bg-gradient-to-tr from-[#E5A84B] via-[#48956A] to-[#3B8259] scale-105 shadow-[0_6px_16px_rgba(72,149,106,0.32)]'
                                : 'bg-gradient-to-tr from-[#5DA6C4] via-[#48956A] to-[#3B8259] scale-105 shadow-[0_6px_16px_rgba(72,149,106,0.32)]'
                              : 'bg-[#E3DDD0] opacity-80 group-hover:opacity-100 group-hover:bg-[#C9C2B3]'
                          }`}
                        >
                          <div className="p-[2px] bg-[#FAF8F3] rounded-full">
                            <img
                              src={pet.avatarUrl}
                              alt={pet.name}
                              referrerPolicy="no-referrer"
                              className="w-14 h-14 rounded-full object-cover shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
                            />
                          </div>
                        </div>

                        {/* Active Selected Pip */}
                        {isSelected && (
                          <motion.div
                            layoutId="active-pet-indicator"
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#3B8259] ring-2 ring-[#FAF8F3] shadow-xs"
                          />
                        )}
                      </div>

                      {/* Pet Name */}
                      <span className={`mt-2 text-[13px] font-bold text-center leading-none ${
                        isSelected ? 'text-[#1F2E23]' : 'text-[#56685D]'
                      }`}>
                        {pet.name}
                      </span>

                      {/* Pet Age */}
                      <span className="mt-1 text-[11px] text-[#788A7F] font-medium text-center leading-none">
                        {pet.ageYears}y {pet.ageMonths}m
                      </span>
                    </div>
                  );
                })}

                {/* "+ Add Pet" Dashed Clay Circle */}
                <div
                  onClick={onOpenAddPet}
                  className="flex flex-col items-center cursor-pointer group flex-shrink-0"
                >
                  <div className="w-15.5 h-15.5 rounded-full border-2 border-dashed border-[#D2CABE] flex items-center justify-center bg-[#FAF8F3]/70 group-hover:bg-[#EFE9DD] group-hover:border-[#557A63] transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]">
                    <div className="w-7.5 h-7.5 rounded-full bg-[#E8E2D4] group-hover:bg-[#DFD8C8] text-[#55675A] flex items-center justify-center transition-colors shadow-2xs">
                      <Plus className="w-4 h-4 stroke-[2.4]" />
                    </div>
                  </div>

                  <span className="mt-2 text-[13px] font-semibold text-[#56685D] text-center leading-none">
                    Add Pet
                  </span>
                  <span className="mt-1 text-[11px] text-transparent leading-none select-none">
                    &nbsp;
                  </span>
                </div>
              </div>
            </section>

            {/* BENTO ROW 2: Asymmetric Split Bento Grid (Score & Vitals) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
              {/* BENTO TILE 2A (Left 7 Cols): Active Companion Daily Care Score */}
              <div
                id="bento-tile-daily-care"
                className="sm:col-span-7 rounded-[26px] bg-[#FAF8F3] border border-[#EDE8DE] p-4.5 flex flex-col justify-between shadow-[0_8px_22px_-4px_rgba(40,55,45,0.04),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#557A63]" />
                    <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-[#557A63]">
                      Routine Progress
                    </h3>
                  </div>
                  <span className="text-xs text-[#718276] font-medium">Today</span>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Circular Clay Progress Ring */}
                  <div className="relative w-18 h-18 flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
                      <circle
                        cx="36"
                        cy="36"
                        r="28"
                        className="stroke-[#EBE5D8]"
                        strokeWidth="6.5"
                        fill="transparent"
                      />
                      <circle
                        cx="36"
                        cy="36"
                        r="28"
                        className="stroke-[#557A63] transition-all duration-700 ease-out"
                        strokeWidth="6.5"
                        strokeDasharray={175.9}
                        strokeDashoffset={175.9 - (175.9 * progressPercent) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[16px] font-extrabold text-[#1F2E23] leading-none">
                        {progressPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Summary Text */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-extrabold text-[#1F2E23] tracking-tight leading-snug truncate">
                      {currentPet.name}'s Day
                    </p>
                    <p className="text-[12px] text-[#697C70] mt-0.5 font-medium">
                      {activeCompleted} of {activeTotal} routines done
                    </p>
                    <div className="mt-1.5 inline-flex items-center text-[11px] font-semibold text-[#557A63] bg-[#EAF2ED] px-2.5 py-0.5 rounded-full">
                      {activeCompleted === activeTotal ? 'All caught up! 🎉' : nextPendingActivity ? `Next: ${nextPendingActivity.title}` : 'Looking good! ✨'}
                    </div>
                  </div>
                </div>
              </div>

              {/* BENTO TILE 2B (Right 5 Cols): Pet Vitals & Physical Status */}
              <div
                id="bento-tile-vitals"
                className="sm:col-span-5 rounded-[26px] bg-[#FAF8F3] border border-[#EDE8DE] p-4.5 flex flex-col justify-between shadow-[0_8px_22px_-4px_rgba(40,55,45,0.04),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-extrabold uppercase tracking-wider text-[#7A8C80]">
                    Vitals
                  </span>
                  <span className="text-[11px] font-semibold text-[#5A6F62] bg-[#EFECE3] px-2 py-0.5 rounded-full capitalize">
                    {currentPet.species}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {/* Weight Sub-Cell */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#F4EFE4]/80 border border-[#E9E2D4]">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-white/90 text-[#557A63] flex items-center justify-center shadow-2xs">
                        <WeightIcon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-[#5A6E61]">Weight</span>
                    </div>
                    <span className="text-xs font-bold text-[#1F2E23]">
                      {currentPet.weight} {currentPet.weightUnit}
                    </span>
                  </div>

                  {/* Breed Sub-Cell */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#F4EFE4]/80 border border-[#E9E2D4]">
                    <div className="flex items-center space-x-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-white/90 text-[#A67140] flex items-center justify-center shadow-2xs flex-shrink-0">
                        <Heart className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-[#5A6E61] truncate">Breed</span>
                    </div>
                    <span className="text-xs font-bold text-[#1F2E23] truncate max-w-[90px] text-right" title={currentPet.breed}>
                      {currentPet.breed}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* BENTO TILE 3: Tactile Clay Quick Care Logger */}
            <section
              id="bento-tile-quick-log"
              className="rounded-[26px] bg-[#FAF8F3] border border-[#EDE8DE] p-4.5 shadow-[0_8px_22px_-4px_rgba(40,55,45,0.04),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)]"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-[15px] font-extrabold text-[#1F2E23] tracking-tight">
                    Quick Log
                  </h3>
                  <p className="text-[11.5px] text-[#718276] font-medium">
                    Tap to record instant care for {currentPet.name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsQuickLogOpen(true)}
                  className="text-[11.5px] font-bold text-[#557A63] hover:text-[#3B5745] flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Custom</span>
                </button>
              </div>

              {/* 4 Tactile Pill Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  {
                    type: 'walk' as CareType,
                    label: 'Walk',
                    icon: <Footprints className="w-4 h-4 stroke-[2.2]" />,
                    style: 'bg-[#F4EFE4] hover:bg-[#EBE4D5] text-[#825B2D] border-[#E3DCB8]',
                  },
                  {
                    type: 'meal' as CareType,
                    label: 'Meal',
                    icon: <Utensils className="w-4 h-4 stroke-[2.2]" />,
                    style: 'bg-[#EBF2EC] hover:bg-[#DDECE0] text-[#3E6E4F] border-[#CEE2D2]',
                  },
                  {
                    type: 'water' as CareType,
                    label: 'Water',
                    icon: <Droplets className="w-4 h-4 stroke-[2.2]" />,
                    style: 'bg-[#EAF1F6] hover:bg-[#DBE8F0] text-[#3D718C] border-[#CCE0ED]',
                  },
                  {
                    type: 'meds' as CareType,
                    label: 'Meds',
                    icon: <Pill className="w-4 h-4 stroke-[2.2]" />,
                    style: 'bg-[#F7EBE8] hover:bg-[#F2DCD8] text-[#A64A38] border-[#ECCECE]',
                  },
                ].map((btn) => (
                  <motion.button
                    key={btn.type}
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handleInstantQuickLog(btn.type)}
                    className={`py-2.5 px-2 rounded-2xl border flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all shadow-[0_3px_8px_-1px_rgba(40,55,45,0.04),inset_0_1.5px_1px_rgba(255,255,255,0.9)] active:shadow-[inset_0_2px_3px_rgba(0,0,0,0.08)] ${btn.style}`}
                  >
                    {btn.icon}
                    <span className="text-[12px] font-bold">{btn.label}</span>
                  </motion.button>
                ))}
              </div>
            </section>

            {/* BENTO TILE 4: "Today's Routine" Structured Schedule Card */}
            <section
              id="bento-tile-todays-routine"
              className="rounded-[26px] bg-[#FAF8F3] border border-[#EDE8DE] p-4.5 shadow-[0_8px_22px_-4px_rgba(40,55,45,0.04),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)]"
            >
              {/* Section Header with "Today's Routine" & Filter Toggle */}
              <div className="flex items-center justify-between mb-3.5">
                <div>
                  <h2
                    id="routine-title"
                    className="text-[16.5px] font-extrabold text-[#1F2E23] tracking-tight"
                  >
                    Today's Routine
                  </h2>
                  <p className="text-[11.5px] text-[#718276]">
                    {showAllPetsRoutine ? 'Viewing all pack members' : `Focused on ${currentPet.name}`}
                  </p>
                </div>

                {/* Pill Toggle */}
                <div className="flex bg-[#EAE5DA] p-1 rounded-full border border-[#DDD5C7] text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setShowAllPetsRoutine(false)}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      !showAllPetsRoutine
                        ? 'bg-white text-[#1F2E23] shadow-xs font-extrabold'
                        : 'text-[#6C7F72] hover:text-[#1F2E23]'
                    }`}
                  >
                    {currentPet.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAllPetsRoutine(true)}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      showAllPetsRoutine
                        ? 'bg-white text-[#1F2E23] shadow-xs font-extrabold'
                        : 'text-[#6C7F72] hover:text-[#1F2E23]'
                    }`}
                  >
                    VIEW ALL
                  </button>
                </div>
              </div>

              {/* Routine Task Items List */}
              <div className="space-y-2.5">
                {displayedLogs.map((log) => {
                  const petForLog = getPetForLog(log.petId);

                  return (
                    <motion.div
                      key={log.id}
                      layout
                      onClick={() => onToggleLog(log.id)}
                      className={`w-full rounded-2xl border transition-all cursor-pointer p-3.5 flex items-center justify-between shadow-[0_2px_10px_rgba(40,55,45,0.02),inset_0_1px_1px_rgba(255,255,255,0.9)] ${
                        log.completed
                          ? 'border-[#E4DFD3] bg-[#F5F2EA]/85 opacity-85'
                          : 'border-[#EDE8DE] bg-white hover:border-[#627C6B]/60 shadow-[0_4px_14px_-2px_rgba(40,55,45,0.04)]'
                      }`}
                    >
                      {/* Left: Tactile Checkbox & Routine Information */}
                      <div className="flex items-center space-x-3.5 min-w-0 flex-1 pr-3">
                        <div
                          className={`w-6.5 h-6.5 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                            log.completed
                              ? 'bg-[#627C6B] text-white shadow-[0_2px_6px_rgba(98,124,107,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)]'
                              : 'border-2 border-[#D5CEBF] bg-[#FAF8F3] hover:border-[#627C6B] shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.04)]'
                          }`}
                        >
                          {log.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div className="min-w-0">
                          <span
                            className={`block text-[14px] font-bold tracking-tight leading-snug truncate ${
                              log.completed
                                ? 'line-through text-[#849489]'
                                : 'text-[#1F2E23]'
                            }`}
                          >
                            {log.title}
                          </span>
                          <div className="flex items-center space-x-2 text-[11.5px] text-[#718276] mt-0.5">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1 opacity-70" />
                              {log.time}
                            </span>
                            <span>·</span>
                            <span className="truncate">{log.detail}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Mini Pet Avatar Badge */}
                      <div className="relative flex-shrink-0" title={petForLog.name}>
                        <img
                          src={petForLog.avatarUrl}
                          alt={petForLog.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-[#EDE8DE] shadow-2xs"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Add Routine Prompt within Tile */}
              <div className="mt-4 pt-1">
                <button
                  type="button"
                  onClick={() => setIsQuickLogOpen(true)}
                  className="w-full py-3 px-4 rounded-2xl bg-[#EAE5DA] hover:bg-[#DFD9CD] text-[#34453A] font-bold text-[13px] flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-[0_2px_8px_rgba(40,55,45,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)]"
                >
                  <Plus className="w-4 h-4 stroke-[2.4]" />
                  <span>Schedule New Routine</span>
                </button>
              </div>
            </section>
          </motion.div>
        )}

        {/* ================= VIEW 2: ROUTINE MANAGER ================= */}
        {currentTab === 'routine' && (
          <motion.div
            key="view-routine"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mt-1 mb-2">
              <div>
                <h1 className="text-[25px] font-extrabold text-[#1F2E23] tracking-tight">
                  Daily Routine
                </h1>
                <p className="text-[13px] text-[#718276]">
                  Schedule and track wellness activities
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsQuickLogOpen(true)}
                className="w-9 h-9 rounded-full bg-[#557A63] text-white flex items-center justify-center shadow-md hover:bg-[#43644F] cursor-pointer"
              >
                <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Pet Filter Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setShowAllPetsRoutine(true)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
                  showAllPetsRoutine
                    ? 'bg-[#1F2E23] text-white shadow-xs'
                    : 'bg-[#EAE5DA] text-[#55675A] hover:bg-[#E0DACD]'
                }`}
              >
                All Pack ({logs.length})
              </button>
              {pets.map((pet) => (
                <button
                  key={pet.id}
                  type="button"
                  onClick={() => {
                    onSelectPet(pet.id);
                    setShowAllPetsRoutine(false);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex-shrink-0 flex items-center space-x-1.5 ${
                    !showAllPetsRoutine && currentPet.id === pet.id
                      ? 'bg-[#557A63] text-white shadow-xs'
                      : 'bg-[#EAE5DA] text-[#55675A] hover:bg-[#E0DACD]'
                  }`}
                >
                  <img
                    src={pet.avatarUrl}
                    alt={pet.name}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>{pet.name}</span>
                </button>
              ))}
            </div>

            {/* Routine Timeline Checklist */}
            <div className="rounded-[26px] bg-[#FAF8F3] border border-[#EDE8DE] p-4.5 space-y-2.5 shadow-[0_8px_22px_-4px_rgba(40,55,45,0.04),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)]">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE5DA]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#557A63]">
                  {showAllPetsRoutine ? 'All Tasks' : `${currentPet.name}'s Tasks`}
                </span>
                <span className="text-xs text-[#718276] font-semibold">
                  {displayedLogs.filter((l) => l.completed).length} / {displayedLogs.length} Done
                </span>
              </div>

              {displayedLogs.map((log) => {
                const petForLog = getPetForLog(log.petId);

                return (
                  <div
                    key={log.id}
                    onClick={() => onToggleLog(log.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      log.completed
                        ? 'border-[#E4DFD3] bg-[#F5F2EA]/85 opacity-80'
                        : 'border-[#EDE8DE] bg-white hover:border-[#627C6B]/60 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1 pr-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                          log.completed
                            ? 'bg-[#627C6B] text-white'
                            : 'border-2 border-[#D5CEBF] bg-[#FAF8F3]'
                        }`}
                      >
                        {log.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div className="min-w-0">
                        <span
                          className={`block text-[14px] font-bold ${
                            log.completed ? 'line-through text-[#849489]' : 'text-[#1F2E23]'
                          }`}
                        >
                          {log.title}
                        </span>
                        <span className="text-[11.5px] text-[#718276] flex items-center mt-0.5">
                          <Clock className="w-3 h-3 mr-1 opacity-70" />
                          {log.time} · {log.detail}
                        </span>
                      </div>
                    </div>

                    <img
                      src={petForLog.avatarUrl}
                      alt={petForLog.name}
                      className="w-7 h-7 rounded-full object-cover border border-[#E0DACD]"
                    />
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ================= VIEW 3: MY PETS (SCREENSHOT DESIGN) ================= */}
        {currentTab === 'pack' && (
          <motion.div
            key="view-pack"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3.5 pb-24"
          >
            {/* Header: Title, Subtitle, and + Add Pet Button (Matching Screenshot) */}
            <div className="flex items-start justify-between pt-1">
              <div>
                <h1 className="text-[26px] sm:text-[28px] font-extrabold text-[#1F2E23] tracking-tight leading-tight">
                  My Pack
                </h1>
                <p className="text-[13px] text-[#718276] font-medium mt-0.5">
                  {pets.length} companions · Tap any pet to view health details
                </p>
              </div>

              {/* + Add Pet Pill Button */}
              <button
                type="button"
                onClick={onOpenAddPet}
                className="bg-[#244633] hover:bg-[#1A3426] text-white text-[12.5px] font-bold px-3.5 py-1.5 rounded-full flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all cursor-pointer flex-shrink-0"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Pet</span>
              </button>
            </div>

            {/* Pet Cards matching screenshot */}
            <div className="space-y-3 pt-1">
              {pets.map((pet) => {
                const isSelected = pet.id === currentPet.id;
                const isCat = pet.species === 'cat';
                const isDog = pet.species === 'dog';

                return (
                  <div
                    key={pet.id}
                    onClick={() => {
                      onSelectPet(pet.id);
                      setViewingPet(pet);
                    }}
                    className={`p-4 rounded-[24px] sm:rounded-[26px] transition-all cursor-pointer bg-white group ${
                      isSelected
                        ? 'border-2 border-[#EDA63A] shadow-[0_6px_20px_rgba(237,166,58,0.12),0_2px_8px_rgba(40,55,45,0.04)]'
                        : 'border border-[#EDE8DE] shadow-[0_3px_10px_rgba(40,55,45,0.03)] hover:border-[#DDD6C8]'
                    }`}
                  >
                    <div className="flex items-start space-x-3.5">
                      {/* Left: Avatar with small circular species badge in corner */}
                      <div className="relative flex-shrink-0 mt-0.5">
                        <img
                          src={pet.avatarUrl}
                          alt={pet.name}
                          referrerPolicy="no-referrer"
                          className="w-[58px] h-[58px] sm:w-[62px] sm:h-[62px] rounded-full object-cover border border-[#EAE3D6] shadow-xs"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5.5 h-5.5 rounded-full bg-[#EBF4EE] border-2 border-white flex items-center justify-center shadow-2xs">
                          {isCat ? (
                            <Cat className="w-3 h-3 stroke-[2.2] text-[#3D694E]" />
                          ) : isDog ? (
                            <Dog className="w-3 h-3 stroke-[2.2] text-[#3D694E]" />
                          ) : (
                            <PawPrint className="w-3 h-3 stroke-[2.2] text-[#3D694E]" />
                          )}
                        </div>
                      </div>

                      {/* Right: Content details */}
                      <div className="flex-1 min-w-0">
                        {/* Top row: Name + PRIMARY badge + Chevron */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 min-w-0">
                            <h3 className="text-[17px] font-extrabold text-[#1F2E23] tracking-tight truncate">
                              {pet.name}
                            </h3>
                            {isSelected && (
                              <span className="text-[10px] font-extrabold text-[#2F6B4F] bg-[#E3EFE7] px-2 py-0.5 rounded-md uppercase tracking-wider flex-shrink-0">
                                PRIMARY
                              </span>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#A8B7AD] group-hover:text-[#527763] group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-1" />
                        </div>

                        {/* Second row: Breed */}
                        <p className="text-[13px] text-[#8C7A6B] font-medium mt-0.5 truncate">
                          {pet.breed}
                        </p>

                        {/* Thin horizontal divider */}
                        <div className="border-t border-[#F2ECE3] my-2.5" />

                        {/* Stats row: Pulse/Activity wave icon + Age & Scale icon + Weight */}
                        <div className="flex items-center space-x-6 text-[12.5px] text-[#5A6E60] font-semibold">
                          <div className="flex items-center space-x-1.5">
                            <Activity className="w-3.5 h-3.5 text-[#7F9384] stroke-[2.2]" />
                            <span>
                              {pet.ageYears}y {pet.ageMonths || 0}m
                            </span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <Scale className="w-3.5 h-3.5 text-[#7F9384] stroke-[2.2]" />
                            <span>
                              {pet.weight} {pet.weightUnit || 'lbs'}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons row: Calendar & Health & Notes */}
                        <div className="flex items-center space-x-2 mt-3 pt-0.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectPet(pet.id);
                              setCurrentTab('routine');
                            }}
                            className="px-3 py-1.5 rounded-full bg-[#E5F1E8] hover:bg-[#D7EADE] text-[#2F6B4F] text-[12px] font-bold flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
                          >
                            <Calendar className="w-3.5 h-3.5 stroke-[2.2]" />
                            <span>Calendar</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectPet(pet.id);
                              setViewingPet(pet);
                            }}
                            className="px-3 py-1.5 rounded-full bg-[#F5EFE6] hover:bg-[#ECE4D8] text-[#716355] text-[12px] font-bold flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
                          >
                            <SquarePen className="w-3.5 h-3.5 stroke-[2.2]" />
                            <span>Health & Notes</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ================= VIEW 4: PROFILE & SETTINGS ================= */}
        {currentTab === 'profile' && (
          <motion.div
            key="view-profile"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3.5"
          >
            <div className="mt-1 mb-2">
              <h1 className="text-[25px] font-extrabold text-[#1F2E23] tracking-tight">
                Care Profile
              </h1>
              <p className="text-[13px] text-[#718276]">
                Preferences, theme & emergency info
              </p>
            </div>

            {/* Active Pet Profile Card */}
            <div
              onClick={() => setViewingPet(currentPet)}
              className="rounded-[26px] bg-white border border-[#4E7A5E]/40 p-4 shadow-[0_8px_22px_-4px_rgba(40,55,45,0.06)] flex items-center justify-between cursor-pointer hover:border-[#4E7A5E] hover:shadow-md transition-all group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#EFE9DF] border border-[#EAE4D7] shadow-2xs flex-shrink-0">
                  <img
                    src={currentPet.avatarUrl}
                    alt={currentPet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[15px] font-extrabold text-[#1F2E23]">{currentPet.name}'s Profile</span>
                    <span className="text-[10px] uppercase font-bold text-[#3E654C] bg-[#E8F0EA] px-2 py-0.5 rounded-full">
                      View
                    </span>
                  </div>
                  <p className="text-xs text-[#718276] mt-0.5">
                    {currentPet.breed} · {currentPet.weight} {currentPet.weightUnit || 'kg'} · {currentPet.ageYears}y {currentPet.ageMonths || 0}m
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#8A9B8F] group-hover:text-[#4E7A5E] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </div>

            {/* Profile Card */}
            <div className="rounded-[26px] bg-[#FAF8F3] border border-[#EDE8DE] p-4.5 shadow-[0_8px_22px_-4px_rgba(40,55,45,0.04),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)]">
              <div className="flex items-center space-x-3.5">
                <div className="w-15 h-15 rounded-full overflow-hidden border-2 border-white shadow-xs">
                  <img
                    src="/src/assets/images/jordan_avatar_photo_1789667660941.jpg"
                    alt="Jordan"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-[17px] font-extrabold text-[#1F2E23]">
                    Jordan Bennett
                  </h3>
                  <p className="text-xs text-[#718276] font-medium">
                    Primary Pet Parent · 2 Active Companions
                  </p>
                  <span className="inline-block mt-1 text-[11px] font-bold text-[#557A63] bg-[#E8F0EA] px-2 py-0.5 rounded-md">
                    Verified Guardian
                  </span>
                </div>
              </div>
            </div>

            {/* Nav Bar Color Theme Switcher (Matching PetPals Theme & Alternatives) */}
            <div className="rounded-[26px] bg-[#FAF8F3] border border-[#EDE8DE] p-4.5 space-y-3 shadow-[0_8px_22px_-4px_rgba(40,55,45,0.04),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-[#557A63]" />
                  <h3 className="text-sm font-extrabold text-[#1F2E23]">
                    Nav Bar Color Theme
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-[#557A63] bg-[#E8F0EA] px-2 py-0.5 rounded-full">
                  {colorTheme === 'sage' ? 'Theme Match' : colorTheme === 'terracotta' ? 'Terracotta' : 'Sunset Coral'}
                </span>
              </div>
              <p className="text-xs text-[#718276]">
                Select the color palette for your floating curved notch bar:
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {/* 1. Earthy Sage (Default Theme Match) */}
                <button
                  type="button"
                  onClick={() => setColorTheme('sage')}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center text-center space-y-1.5 cursor-pointer transition-all ${
                    colorTheme === 'sage'
                      ? 'border-[#557A63] bg-[#EAF2ED] text-[#2C4937] font-bold shadow-xs ring-1 ring-[#557A63]/30'
                      : 'border-[#EDE8DE] bg-white text-[#55675A] hover:bg-[#F7F4EC]'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#6C8A76] via-[#557A63] to-[#3B5745] shadow-2xs" />
                  <div>
                    <span className="block text-[11.5px] font-bold leading-tight">Earthy Sage</span>
                    <span className="block text-[9.5px] text-[#557A63] font-semibold mt-0.5">Theme Match</span>
                  </div>
                </button>

                {/* 2. Warm Terracotta */}
                <button
                  type="button"
                  onClick={() => setColorTheme('terracotta')}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center text-center space-y-1.5 cursor-pointer transition-all ${
                    colorTheme === 'terracotta'
                      ? 'border-[#BA5A43] bg-[#FAF0ED] text-[#8C3622] font-bold shadow-xs ring-1 ring-[#BA5A43]/30'
                      : 'border-[#EDE8DE] bg-white text-[#55675A] hover:bg-[#F7F4EC]'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#D4735E] via-[#BD5943] to-[#9E432E] shadow-2xs" />
                  <div>
                    <span className="block text-[11.5px] font-bold leading-tight">Terracotta</span>
                    <span className="block text-[9.5px] opacity-70 mt-0.5">Warm Clay</span>
                  </div>
                </button>

                {/* 3. Sunset Coral (Reference) */}
                <button
                  type="button"
                  onClick={() => setColorTheme('coral')}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center text-center space-y-1.5 cursor-pointer transition-all ${
                    colorTheme === 'coral'
                      ? 'border-[#FA6252] bg-[#FFF2F0] text-[#E03A4E] font-bold shadow-xs ring-1 ring-[#FA6252]/30'
                      : 'border-[#EDE8DE] bg-white text-[#55675A] hover:bg-[#F7F4EC]'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#F96357] via-[#FA705A] to-[#EB4158] shadow-2xs" />
                  <div>
                    <span className="block text-[11.5px] font-bold leading-tight">Sunset Coral</span>
                    <span className="block text-[9.5px] opacity-70 mt-0.5">Reference</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Navigation Bar Style Toggle */}
            <div className="rounded-[26px] bg-[#FAF8F3] border border-[#EDE8DE] p-4.5 space-y-3 shadow-[0_8px_22px_-4px_rgba(40,55,45,0.04),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)]">
              <div>
                <span className="text-xs font-bold text-[#1F2E23] block">Bottom Navigation Style</span>
                <span className="text-[11px] text-[#718276]">Switch between the screenshot minimal bar or curved notch</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => setNavBarStyle('minimal')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    navBarStyle === 'minimal'
                      ? 'bg-[#557A63] text-white border-[#557A63] shadow-xs'
                      : 'bg-white text-[#55675A] border-[#EDE8DE] hover:bg-[#F5F2EA]'
                  }`}
                >
                  Minimal Bar (Screenshot)
                </button>
                <button
                  type="button"
                  onClick={() => setNavBarStyle('curved')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    navBarStyle === 'curved'
                      ? 'bg-[#557A63] text-white border-[#557A63] shadow-xs'
                      : 'bg-white text-[#55675A] border-[#EDE8DE] hover:bg-[#F5F2EA]'
                  }`}
                >
                  Curved Notch Bar
                </button>
              </div>
            </div>

            {/* Quick Actions & Contact */}
            <div className="rounded-[26px] bg-[#FAF8F3] border border-[#EDE8DE] p-4.5 space-y-3 shadow-[0_8px_22px_-4px_rgba(40,55,45,0.04),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-[#557A63]" />
                  <span className="text-xs font-bold text-[#1F2E23]">Daily Walk Reminders</span>
                </div>
                <button
                  type="button"
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-10 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                    notificationsEnabled ? 'bg-[#557A63]' : 'bg-[#D6CFC1]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      notificationsEnabled ? 'translate-x-4 shadow-2xs' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="pt-2 border-t border-[#EAE5DA] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-[#C16250]" />
                  <span className="text-xs font-bold text-[#1F2E23]">Emergency Vet Clinic</span>
                </div>
                <span className="text-xs font-semibold text-[#718276]">(555) 019-2834</span>
              </div>
            </div>

            {/* Return to Welcome Screen button */}
            <button
              type="button"
              onClick={onReturnToWelcome}
              className="w-full py-3.5 rounded-2xl bg-[#EAE5DA] hover:bg-[#DFD9CD] text-[#34453A] font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Back to Onboarding / Welcome Screen</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Persistent Floating Curved Notch Navigation Bar with Spring Animation */}
      <CurvedNavBar
        activeTab={viewingPet ? 'profile' : currentTab}
        onTabChange={(tab) => {
          setViewingPet(null);
          setCurrentTab(tab);
        }}
        colorTheme={colorTheme}
        variant={navBarStyle}
      />

      {/* Full-Screen Pet Profile View (from uploaded screenshot) */}
      <AnimatePresence>
        {viewingPet && (
          <motion.div
            key={`pet-profile-overlay-${viewingPet.id}`}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 28 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute inset-0 bg-white z-40 overflow-y-auto scrollbar-none flex flex-col"
          >
            <PetProfileView
              pet={pets.find((p) => p.id === viewingPet.id) || viewingPet}
              logs={logs}
              onBack={() => setViewingPet(null)}
              onUpdatePet={(updated) => {
                if (onUpdatePet) onUpdatePet(updated);
                setViewingPet(updated);
              }}
              onToggleLog={onToggleLog}
              onAddLog={onAddLog}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Add Routine Modal */}
      <AnimatePresence>
        {isQuickLogOpen && (
          <div
            id="quick-log-backdrop"
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#202E24]/35 backdrop-blur-xs p-0 sm:p-4"
            onClick={() => setIsQuickLogOpen(false)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#FAF8F3] border border-[#EDE8DE] rounded-t-[32px] sm:rounded-3xl shadow-xl p-6 text-[#1F2E23] space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#EDE8DE] pb-3">
                <div>
                  <h3 className="font-extrabold text-[17px] text-[#1F2E23]">
                    Schedule Routine
                  </h3>
                  <p className="text-xs text-[#718276]">For {currentPet.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQuickLogOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#EAE5DA] flex items-center justify-center text-[#55675B] hover:bg-[#E0DACD] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateLog} className="space-y-3.5 text-sm">
                <div>
                  <label className="block text-xs font-bold text-[#44574A] uppercase tracking-wider mb-1.5">
                    Activity Type
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { type: 'walk' as CareType, label: 'Walk', icon: <Footprints className="w-4 h-4" /> },
                      { type: 'meal' as CareType, label: 'Meal', icon: <Utensils className="w-4 h-4" /> },
                      { type: 'water' as CareType, label: 'Water', icon: <Droplets className="w-4 h-4" /> },
                      { type: 'meds' as CareType, label: 'Meds', icon: <Pill className="w-4 h-4" /> },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.type}
                        onClick={() => {
                          setLogType(item.type);
                          if (item.type === 'walk') setLogTitle(`Walk ${currentPet.name}`);
                          else if (item.type === 'meal') setLogTitle('Afternoon Meal');
                          else if (item.type === 'water') setLogTitle('Fresh Water Refill');
                          else if (item.type === 'meds') setLogTitle('Daily Vitamins');
                        }}
                        className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all ${
                          logType === item.type
                            ? 'bg-[#627C6B] text-white font-semibold shadow-xs'
                            : 'bg-[#EAE5DA]/70 text-[#495B50] hover:bg-[#EAE5DA]'
                        }`}
                      >
                        {item.icon}
                        <span className="text-[11px]">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="log-title-input" className="block text-xs font-bold text-[#44574A] uppercase tracking-wider mb-1">
                    Activity Title
                  </label>
                  <input
                    id="log-title-input"
                    type="text"
                    required
                    placeholder={`e.g. Walk ${currentPet.name}, Park Frisbee`}
                    value={logTitle}
                    onChange={(e) => setLogTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD6C8] focus:border-[#627C6B] focus:outline-hidden text-[#1F2E23]"
                  />
                </div>

                <div>
                  <label htmlFor="log-detail-input" className="block text-xs font-bold text-[#44574A] uppercase tracking-wider mb-1">
                    Details / Route / Notes
                  </label>
                  <input
                    id="log-detail-input"
                    type="text"
                    placeholder="e.g. 25m neighborhood stroll, sunny morning"
                    value={logDetail}
                    onChange={(e) => setLogDetail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD6C8] focus:border-[#627C6B] focus:outline-hidden text-[#1F2E23]"
                  />
                </div>

                <div className="pt-2 flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsQuickLogOpen(false)}
                    className="flex-1 py-3 rounded-full bg-[#EAE5DA] text-[#4F6255] font-bold text-xs cursor-pointer hover:bg-[#E0DACD]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-full bg-[#627C6B] text-white font-bold text-xs cursor-pointer hover:bg-[#546D5D] shadow-xs"
                  >
                    Save Routine
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
