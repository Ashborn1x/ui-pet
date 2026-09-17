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
  Sparkles,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { Pet, CareLog, CareType } from '../types';

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
  const [showAllPetsRoutine, setShowAllPetsRoutine] = useState(false);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);

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

  // Filter logs based on view all vs active pet
  const displayedLogs = showAllPetsRoutine
    ? logs
    : logs.filter((l) => l.petId === currentPet.id);

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logTitle.trim()) return;

    onAddLog({
      petId: currentPet.id,
      type: logType,
      title: logTitle.trim(),
      detail: logDetail.trim() || `Scheduled care for ${currentPet.name}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      completed: false,
    });

    setLogTitle('');
    setLogDetail('');
    setIsQuickLogOpen(false);
  };

  const getCareIcon = (type: CareType) => {
    switch (type) {
      case 'meal':
        return <Utensils className="w-3.5 h-3.5 text-[#557A63]" />;
      case 'water':
        return <Droplets className="w-3.5 h-3.5 text-[#4A839E]" />;
      case 'walk':
        return <Footprints className="w-3.5 h-3.5 text-[#A87948]" />;
      case 'meds':
        return <Pill className="w-3.5 h-3.5 text-[#C16250]" />;
      default:
        return <Heart className="w-3.5 h-3.5 text-[#557A63]" />;
    }
  };

  const getPetForLog = (petId: string) => {
    return pets.find((p) => p.id === petId) || currentPet;
  };

  return (
    <div
      id="dashboard-root"
      className="flex flex-col w-full h-full min-h-[640px] bg-[#F7F4EC] text-[#1F2E23] overflow-y-auto select-none px-6 pt-4 pb-8"
    >
      {/* Top iOS Status Bar Indicator */}
      <div
        id="status-bar-area"
        className="flex items-center justify-between text-[#1F2E23] text-xs font-semibold py-1 mb-3"
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

      {/* Header Section Matching User Mockup */}
      <header
        id="dashboard-header-section"
        className="flex items-center justify-between mt-1 mb-6"
      >
        <div>
          <h1
            id="greeting-title"
            className="text-[26px] sm:text-[28px] font-extrabold text-[#1F2E23] tracking-tight leading-tight"
          >
            {getGreeting()}
          </h1>
          <p
            id="greeting-subtitle"
            className="text-[14px] text-[#718276] font-normal mt-0.5"
          >
            It's a perfect day for a walk.
          </p>
        </div>

        {/* User Profile Avatar (Jordan) with Return to Welcome helper */}
        <div className="relative group">
          <button
            type="button"
            onClick={onReturnToWelcome}
            title="Jordan's Profile (Tap to view Welcome Onboarding)"
            className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-[0_2px_8px_rgba(40,55,45,0.08)] cursor-pointer hover:ring-2 hover:ring-[#557A63] transition-all flex-shrink-0"
          >
            <img
              src="/src/assets/images/jordan_avatar_photo_1789667660941.jpg"
              alt="Jordan"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </header>

      {/* "Your Pack" Section Matching User Mockup */}
      <section id="your-pack-section" className="mb-7">
        <h2
          id="your-pack-title"
          className="text-[17px] font-bold text-[#1F2E23] tracking-tight mb-3.5"
        >
          Your Pack
        </h2>

        {/* Pet Avatars Row */}
        <div
          id="your-pack-row"
          className="flex items-center space-x-5 overflow-x-auto pb-2 scrollbar-none"
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
                {/* Avatar with Dual-Tone Glowing Ring matching mockup */}
                <div className="relative">
                  <div
                    className={`p-[2.5px] rounded-full transition-all duration-300 ${
                      isDog
                        ? 'bg-gradient-to-tr from-[#E5A84B] via-[#48956A] to-[#3B8259]'
                        : 'bg-gradient-to-tr from-[#5DA6C4] via-[#48956A] to-[#3B8259]'
                    } ${isSelected ? 'scale-105 shadow-[0_4px_14px_rgba(72,149,106,0.3)]' : 'opacity-90 hover:opacity-100'}`}
                  >
                    <div className="p-[2px] bg-[#F7F4EC] rounded-full">
                      <img
                        src={pet.avatarUrl}
                        alt={pet.name}
                        referrerPolicy="no-referrer"
                        className="w-15 h-15 rounded-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Active Indicator Dot */}
                  {isSelected && (
                    <motion.div
                      layoutId="active-pet-indicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#3B8259] ring-2 ring-[#F7F4EC]"
                    />
                  )}
                </div>

                {/* Pet Name */}
                <span className="mt-2 text-[13.5px] font-bold text-[#1F2E23] text-center leading-none">
                  {pet.name}
                </span>

                {/* Pet Age */}
                <span className="mt-1 text-[11.5px] text-[#718276] font-medium text-center leading-none">
                  {pet.ageYears}y {pet.ageMonths}m
                </span>
              </div>
            );
          })}

          {/* "Add Pet" Dashed Action Button Matching Mockup */}
          <div
            onClick={onOpenAddPet}
            className="flex flex-col items-center cursor-pointer group flex-shrink-0"
          >
            <div className="w-16.5 h-16.5 rounded-full border-2 border-dashed border-[#D5CEBF] flex items-center justify-center bg-[#FAF8F3]/60 group-hover:bg-[#F2ECE0] group-hover:border-[#557A63] transition-all">
              <div className="w-8 h-8 rounded-full bg-[#E8E2D4] group-hover:bg-[#DFD8C8] text-[#5A6E61] flex items-center justify-center transition-colors">
                <Plus className="w-4.5 h-4.5 stroke-[2.4]" />
              </div>
            </div>

            <span className="mt-2 text-[13.5px] font-semibold text-[#1F2E23] text-center leading-none">
              Add Pet
            </span>
            <span className="mt-1 text-[11.5px] text-transparent leading-none select-none">
              &nbsp;
            </span>
          </div>
        </div>
      </section>

      {/* NOTE: "Ready for a walk?" box is EXCLUDED per user request */}

      {/* "Today's Routine" Section Matching User Mockup */}
      <section id="todays-routine-section" className="flex-1 flex flex-col">
        {/* Section Header with "Today's Routine" and "VIEW ALL" */}
        <div className="flex items-center justify-between mb-3.5">
          <h2
            id="routine-title"
            className="text-[17px] font-bold text-[#1F2E23] tracking-tight"
          >
            Today's Routine
          </h2>

          <button
            type="button"
            onClick={() => setShowAllPetsRoutine(!showAllPetsRoutine)}
            className="text-[11.5px] font-bold tracking-wider uppercase text-[#C88A3C] hover:text-[#A66E28] transition-colors cursor-pointer"
          >
            {showAllPetsRoutine ? 'ACTIVE PET' : 'VIEW ALL'}
          </button>
        </div>

        {/* Routine Cards List */}
        <div className="space-y-2.5">
          {displayedLogs.map((log) => {
            const petForLog = getPetForLog(log.petId);

            return (
              <motion.div
                key={log.id}
                layout
                onClick={() => onToggleLog(log.id)}
                className={`w-full rounded-[22px] bg-[#FAF8F3] border transition-all cursor-pointer p-4 flex items-center justify-between shadow-[0_2px_12px_rgba(40,55,45,0.02)] ${
                  log.completed
                    ? 'border-[#E2DDCF] bg-[#FAF8F3]/75 opacity-90'
                    : 'border-[#EDE8DE] hover:border-[#627C6B]/50'
                }`}
              >
                {/* Left Side: Checkbox & Routine Title */}
                <div className="flex items-center space-x-3.5 min-w-0 flex-1 pr-3">
                  {/* Round Checkbox Matching User Mockup */}
                  <div
                    className={`w-6.5 h-6.5 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                      log.completed
                        ? 'bg-[#627C6B] text-white shadow-xs'
                        : 'border-2 border-[#D5CEBF] bg-transparent hover:border-[#627C6B]'
                    }`}
                  >
                    {log.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="min-w-0">
                    <span
                      className={`block text-[14.5px] font-bold tracking-tight leading-snug truncate ${
                        log.completed
                          ? 'line-through text-[#819286]'
                          : 'text-[#1F2E23]'
                      }`}
                    >
                      {log.title}
                    </span>
                    <div className="flex items-center space-x-2 text-[12px] text-[#718276] mt-0.5">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1 opacity-70" />
                        {log.time}
                      </span>
                      <span>·</span>
                      <span className="truncate">{log.detail}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Mini Pet Avatar Thumbnail matching mockup */}
                <div className="relative flex-shrink-0">
                  <img
                    src={petForLog.avatarUrl}
                    alt={petForLog.name}
                    referrerPolicy="no-referrer"
                    className="w-8.5 h-8.5 rounded-full object-cover border border-[#EDE8DE] shadow-2xs"
                    title={petForLog.name}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Add Routine Action */}
        <div className="mt-4 pt-1 flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setIsQuickLogOpen(true)}
            className="flex-1 py-3 px-4 rounded-full bg-[#EAE5DA] hover:bg-[#E0DACD] text-[#34453A] font-bold text-[13.5px] flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4 stroke-[2.4]" />
            <span>Add Routine for {currentPet.name}</span>
          </button>

          <button
            type="button"
            onClick={onReturnToWelcome}
            title="Preview Welcome Screen"
            className="w-11 h-11 rounded-full bg-[#EAE5DA] hover:bg-[#E0DACD] text-[#55675B] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-4.5 h-4.5" />
          </button>
        </div>
      </section>

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
                    Add Today's Routine
                  </h3>
                  <p className="text-xs text-[#718276]">For {currentPet.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQuickLogOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#EAE5DA] flex items-center justify-center text-[#55675B] hover:bg-[#E0DACD]"
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
