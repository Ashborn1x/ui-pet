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
  PawPrint
} from 'lucide-react';
import { Pet, CareLog, CareType } from '../types';
import { CurvedNavBar, NavTabId } from './CurvedNavBar';

interface PetCareDashboardProps {
  pets: Pet[];
  selectedPetId: string;
  onSelectPet: (id: string) => void;
  onOpenAddPet: () => void;
  onReturnToWelcome: () => void;
  logs: CareLog[];
  onToggleLog: (logId: string) => void;
  onAddLog: (newLog: Omit<CareLog, 'id'>) => void;
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
}) => {
  const [currentTab, setCurrentTab] = useState<NavTabId>('home');
  const [colorTheme, setColorTheme] = useState<'sage' | 'terracotta' | 'coral'>('sage');
  const [showAllPetsRoutine, setShowAllPetsRoutine] = useState(false);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Quick log form state
  const [logType, setLogType] = useState<CareType>('walk');
  const [logTitle, setLogTitle] = useState('');
  const [logDetail, setLogDetail] = useState('');

  const currentPet = pets.find((p) => p.id === selectedPetId) || pets[0] || {
    id: 'pet-1',
    name: 'Biscuit',
    species: 'dog',
    breed: 'Golden Retriever',
    ageYears: 3,
    ageMonths: 2,
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
            {/* Header Bar: Greeting & Jordan's Profile */}
            <header
              id="dashboard-header-section"
              className="flex items-center justify-between mt-1 mb-3"
            >
              <div>
                <h1
                  id="greeting-title"
                  className="text-[25px] sm:text-[27px] font-extrabold text-[#1F2E23] tracking-tight leading-tight"
                >
                  {getGreeting()}
                </h1>
                <p
                  id="greeting-subtitle"
                  className="text-[13.5px] text-[#718276] font-normal mt-0.5"
                >
                  It's a perfect day for a walk.
                </p>
              </div>

              {/* Profile Avatar with Tactile Clay Ring */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onReturnToWelcome}
                  title="Preview Welcome Screen"
                  className="w-9 h-9 rounded-full bg-[#EAE5DA] hover:bg-[#DFD9CC] text-[#55675B] flex items-center justify-center transition-all cursor-pointer shadow-[0_2px_6px_rgba(40,55,45,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)]"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <div
                  onClick={() => setCurrentTab('profile')}
                  title="Jordan's Profile"
                  className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-[0_4px_12px_rgba(40,55,45,0.08),inset_0_1px_2px_rgba(255,255,255,0.9)] flex-shrink-0 bg-[#E8E2D4] cursor-pointer"
                >
                  <img
                    src="/src/assets/images/jordan_avatar_photo_1789667660941.jpg"
                    alt="Jordan"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
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
                      onClick={() => onSelectPet(pet.id)}
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

        {/* ================= VIEW 3: YOUR PACK ================= */}
        {currentTab === 'pack' && (
          <motion.div
            key="view-pack"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3.5"
          >
            <div className="flex items-center justify-between mt-1 mb-2">
              <div>
                <h1 className="text-[25px] font-extrabold text-[#1F2E23] tracking-tight">
                  Your Pack
                </h1>
                <p className="text-[13px] text-[#718276]">
                  {pets.length} companions registered
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenAddPet}
                className="px-3.5 py-1.5 rounded-full bg-[#557A63] text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs hover:bg-[#43644F] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Companion</span>
              </button>
            </div>

            {/* Companion Cards */}
            <div className="space-y-3">
              {pets.map((pet) => {
                const isSelected = pet.id === currentPet.id;
                const petCareLogs = logs.filter((l) => l.petId === pet.id);
                const completedCount = petCareLogs.filter((l) => l.completed).length;

                return (
                  <div
                    key={pet.id}
                    onClick={() => onSelectPet(pet.id)}
                    className={`p-4 rounded-[26px] border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#557A63] bg-[#FAF8F3] shadow-[0_8px_20px_rgba(72,149,106,0.12),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)] ring-1 ring-[#557A63]/30'
                        : 'border-[#EDE8DE] bg-[#FAF8F3] opacity-90 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={pet.avatarUrl}
                        alt={pet.name}
                        className="w-16 h-16 rounded-2xl object-cover shadow-xs border border-white"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[17px] font-extrabold text-[#1F2E23]">
                            {pet.name}
                          </h3>
                          <span className="text-[11px] font-bold text-[#557A63] bg-[#E8F0EA] px-2.5 py-0.5 rounded-full capitalize">
                            {pet.species}
                          </span>
                        </div>
                        <p className="text-[12.5px] text-[#718276] font-medium mt-0.5">
                          {pet.breed} · {pet.ageYears}y {pet.ageMonths}m
                        </p>
                        <div className="flex items-center space-x-3 mt-2 text-[11.5px] text-[#55675A] font-semibold">
                          <span>⚖️ {pet.weight} {pet.weightUnit}</span>
                          <span>·</span>
                          <span>✅ {completedCount}/{petCareLogs.length} Done</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add Companion Banner */}
              <button
                type="button"
                onClick={onOpenAddPet}
                className="w-full p-4.5 rounded-[26px] border-2 border-dashed border-[#D2CABE] bg-[#FAF8F3]/60 hover:bg-[#F0EAE0] flex items-center justify-center space-x-2 text-[#55675A] font-bold text-sm cursor-pointer transition-all"
              >
                <Plus className="w-4.5 h-4.5 stroke-[2.4]" />
                <span>Add Another Pet Companion</span>
              </button>
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
        activeTab={currentTab}
        onTabChange={setCurrentTab}
        colorTheme={colorTheme}
      />

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
