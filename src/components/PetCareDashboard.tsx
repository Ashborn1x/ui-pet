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
  FileText, 
  RotateCcw,
  Sparkles,
  Heart,
  ChevronRight,
  Calendar,
  X
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
  const [activeFilter, setActiveFilter] = useState<'all' | 'meal' | 'walk' | 'meds'>('all');
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);

  // Quick log form state
  const [logType, setLogType] = useState<CareType>('meal');
  const [logTitle, setLogTitle] = useState('');
  const [logDetail, setLogDetail] = useState('');

  const currentPet = pets.find((p) => p.id === selectedPetId) || pets[0];
  const petLogs = logs.filter((l) => l.petId === (currentPet?.id || ''));
  const filteredLogs = activeFilter === 'all' 
    ? petLogs 
    : petLogs.filter((l) => l.type === activeFilter);

  const completedCount = petLogs.filter((l) => l.completed).length;
  const totalCount = petLogs.length || 1;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logTitle.trim()) return;

    onAddLog({
      petId: currentPet.id,
      type: logType,
      title: logTitle.trim(),
      detail: logDetail.trim() || 'Logged via PetPals',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      completed: true,
    });

    setLogTitle('');
    setLogDetail('');
    setIsQuickLogOpen(false);
  };

  const getCareIcon = (type: CareType) => {
    switch (type) {
      case 'meal':
        return <Utensils className="w-4 h-4 text-[#557A63]" />;
      case 'water':
        return <Droplets className="w-4 h-4 text-[#4A839E]" />;
      case 'walk':
        return <Footprints className="w-4 h-4 text-[#A87948]" />;
      case 'meds':
        return <Pill className="w-4 h-4 text-[#C16250]" />;
      default:
        return <Heart className="w-4 h-4 text-[#557A63]" />;
    }
  };

  return (
    <div
      id="petcare-dashboard-root"
      className="flex flex-col w-full h-full min-h-[640px] bg-[#F7F5EE] text-[#222E26] overflow-y-auto"
    >
      {/* Top Mobile App Header */}
      <header
        id="dashboard-header"
        className="sticky top-0 z-30 bg-[#FAF8F2]/90 backdrop-blur-md px-5 pt-3 pb-3 border-b border-[#E7E3D8] flex items-center justify-between"
      >
        {/* Active Pet Selector */}
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <img
              src={currentPet?.avatarUrl}
              alt={currentPet?.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-2xl object-cover border-2 border-[#557A63] shadow-[0_2px_8px_rgba(85,122,99,0.2)]"
            />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#557A63] border-2 border-white rounded-full flex items-center justify-center">
              <span className="w-1 h-1 bg-white rounded-full" />
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <h1 id="active-pet-name" className="font-extrabold text-[17px] text-[#202E24] tracking-tight">
                {currentPet?.name}
              </h1>
              <span className="text-[11px] font-semibold text-[#5B7163] bg-[#E5EDE7] px-2 py-0.5 rounded-full capitalize flex items-center space-x-1">
                <span>{currentPet?.species}</span>
                {currentPet?.gender && (
                  <span className="text-[10px] font-bold">
                    {currentPet.gender === 'female' ? '♀' : '♂'}
                  </span>
                )}
              </span>
            </div>
            <p className="text-xs text-[#627568] truncate max-w-[130px]">
              {currentPet?.breed}
            </p>
          </div>
        </div>

        {/* Action Controls: Switch/Add & Return to Welcome */}
        <div className="flex items-center space-x-1.5">
          <button
            id="view-welcome-screen-btn"
            onClick={onReturnToWelcome}
            title="Preview Welcome Screen"
            className="px-2.5 py-1.5 rounded-xl bg-[#EFECE3] hover:bg-[#E7E2D5] text-[#4A5D50] text-xs font-semibold flex items-center space-x-1 border border-[#DDD8CA] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Welcome View</span>
          </button>

          <button
            id="header-add-pet-btn"
            onClick={onOpenAddPet}
            className="w-8 h-8 rounded-xl clay-btn-primary flex items-center justify-center cursor-pointer shadow-sm"
            title="Add New Pet"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="p-4 sm:p-5 space-y-4 flex-1">
        {/* Pet Switcher Pills (if multiple pets) */}
        {pets.length > 1 && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {pets.map((p) => {
              const isSelected = p.id === currentPet?.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPet(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'clay-pill-active'
                      : 'clay-pill text-[#536559] hover:bg-[#EAE6DA]'
                  }`}
                >
                  <img
                    src={p.avatarUrl}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Pet Profile & Today's Progress Card (Claymorphic) */}
        <section
          id="pet-summary-claycard"
          className="clay-card rounded-2xl p-4 sm:p-5 relative overflow-hidden"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#557A63]">Daily Routine</span>
                <span className="text-xs text-[#7B8F82]">· Today</span>
              </div>
              <h2 className="text-lg font-bold text-[#202E24] mt-0.5">
                {completedCount === totalCount ? 'All caught up! 🎉' : `${completedCount} of ${totalCount} completed`}
              </h2>
            </div>

            <div className="text-right">
              <span className="text-2xl font-extrabold text-[#557A63]">{progressPercent}%</span>
              <p className="text-[11px] text-[#697D70]">Care Score</p>
            </div>
          </div>

          {/* Progress Bar with Soft Sage Fill */}
          <div className="w-full h-2.5 bg-[#ECE8DC] rounded-full overflow-hidden mb-4 p-0.5 border border-[#E0DBCF]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full bg-[#557A63] rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
            />
          </div>

          {/* Vital Stats Chips */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#ECE8DC]">
            <div className="text-center py-1">
              <span className="block text-[11px] text-[#718578] font-medium">Age</span>
              <span className="text-xs font-bold text-[#223026]">
                {currentPet?.ageYears}y {currentPet?.ageMonths > 0 ? `${currentPet?.ageMonths}m` : ''}
              </span>
            </div>
            <div className="text-center py-1 border-x border-[#ECE8DC]">
              <span className="block text-[11px] text-[#718578] font-medium">Weight</span>
              <span className="text-xs font-bold text-[#223026]">
                {currentPet?.weight} {currentPet?.weightUnit}
              </span>
            </div>
            <div className="text-center py-1">
              <span className="block text-[11px] text-[#718578] font-medium">Diet</span>
              <span className="text-xs font-bold text-[#223026] truncate block max-w-[80px] mx-auto" title={currentPet?.dietaryNotes || 'Standard'}>
                {currentPet?.dietaryNotes ? 'Special' : 'Standard'}
              </span>
            </div>
          </div>
        </section>

        {/* Today's Care Checklist */}
        <section id="daily-checklist-section" className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-[#27382D] flex items-center space-x-1.5">
              <span>Today’s Care Checklist</span>
            </h3>
            <span className="text-xs text-[#6B7F72] font-medium">Tap to log</span>
          </div>

          <div className="space-y-2">
            {petLogs.map((log) => {
              return (
                <div
                  key={log.id}
                  onClick={() => onToggleLog(log.id)}
                  className={`clay-card rounded-xl p-3.5 flex items-center justify-between transition-all cursor-pointer ${
                    log.completed
                      ? 'bg-[#F9FAF8] border-[#D6E0D9] opacity-90'
                      : 'hover:border-[#557A63]/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        log.completed ? 'bg-[#E5EFE8] text-[#557A63]' : 'bg-[#EFECE3] text-[#576B5E]'
                      }`}
                    >
                      {getCareIcon(log.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm font-bold tracking-tight ${
                            log.completed ? 'line-through text-[#6C7E72]' : 'text-[#202E24]'
                          }`}
                        >
                          {log.title}
                        </span>
                        <span className="text-[11px] text-[#778B7D] font-medium flex items-center">
                          <Clock className="w-2.5 h-2.5 mr-0.5" />
                          {log.time}
                        </span>
                      </div>
                      <p className="text-xs text-[#677A6D]">{log.detail}</p>
                    </div>
                  </div>

                  {/* Tactile Checkbox Button */}
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                      log.completed
                        ? 'clay-btn-primary shadow-xs'
                        : 'border-2 border-[#D7D2C4] bg-white hover:border-[#557A63]'
                    }`}
                  >
                    {log.completed && <Check className="w-4 h-4 stroke-[3] text-white" />}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Log Action Bar */}
        <section id="quick-action-cta" className="pt-1">
          <button
            id="open-quick-log-btn"
            onClick={() => setIsQuickLogOpen(true)}
            className="w-full py-3 px-4 rounded-xl clay-btn-secondary font-bold text-sm flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Care Event for {currentPet?.name}</span>
          </button>
        </section>

        {/* Care Notes & Vet Information (Minimalist & Helpful) */}
        <section id="vet-care-section" className="clay-card rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#557A63]">Veterinary & Health</span>
            <span className="text-xs text-[#557A63] font-semibold bg-[#EAF2ED] px-2 py-0.5 rounded-md">Up to date</span>
          </div>

          <p className="text-xs text-[#4A5D51] font-medium">
            {currentPet?.vetName || 'Sage Hill Veterinary Care · Dr. Katherine Wells'}
          </p>
          <div className="flex items-center justify-between text-xs text-[#6E8174] pt-1 border-t border-[#EFECE3]">
            <span>Routine checkup in 3 months</span>
            <span className="font-semibold text-[#557A63]">{currentPet?.vetPhone || '(555) 382-9012'}</span>
          </div>
        </section>
      </main>

      {/* Quick Log Care Modal */}
      <AnimatePresence>
        {isQuickLogOpen && (
          <div
            id="quick-log-backdrop"
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#202E24]/40 backdrop-blur-xs p-0 sm:p-4"
            onClick={() => setIsQuickLogOpen(false)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#FAF9F5] border border-[#E3DFD4] rounded-t-[32px] sm:rounded-3xl shadow-xl p-6 text-[#202E24] space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#EAE6DB] pb-3">
                <h3 className="font-bold text-lg text-[#202E24]">Log Care Activity</h3>
                <button
                  onClick={() => setIsQuickLogOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#EDE9DE] flex items-center justify-center text-[#55675B]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateLog} className="space-y-3.5 text-sm">
                <div>
                  <label className="block text-xs font-bold text-[#44574A] uppercase tracking-wider mb-1">
                    Activity Type
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { type: 'meal' as CareType, label: 'Meal', icon: <Utensils className="w-3.5 h-3.5" /> },
                      { type: 'walk' as CareType, label: 'Walk', icon: <Footprints className="w-3.5 h-3.5" /> },
                      { type: 'water' as CareType, label: 'Water', icon: <Droplets className="w-3.5 h-3.5" /> },
                      { type: 'meds' as CareType, label: 'Meds', icon: <Pill className="w-3.5 h-3.5" /> },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.type}
                        onClick={() => {
                          setLogType(item.type);
                          if (!logTitle) {
                            if (item.type === 'meal') setLogTitle('Afternoon Snack / Meal');
                            else if (item.type === 'walk') setLogTitle('Park Walk (30 mins)');
                            else if (item.type === 'water') setLogTitle('Fresh Water Bowl');
                            else if (item.type === 'meds') setLogTitle('Heartworm preventative');
                          }
                        }}
                        className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all ${
                          logType === item.type
                            ? 'clay-pill-active font-semibold'
                            : 'clay-pill text-[#536559]'
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
                    placeholder="e.g. Afternoon Kibble, 25m Neighborhood Walk"
                    value={logTitle}
                    onChange={(e) => setLogTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD8CB] focus:border-[#557A63] focus:outline-hidden text-[#202E24]"
                  />
                </div>

                <div>
                  <label htmlFor="log-detail-input" className="block text-xs font-bold text-[#44574A] uppercase tracking-wider mb-1">
                    Details / Portion / Notes
                  </label>
                  <input
                    id="log-detail-input"
                    type="text"
                    placeholder="e.g. 1/2 cup, energetic mood, drank plenty of water"
                    value={logDetail}
                    onChange={(e) => setLogDetail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD8CB] focus:border-[#557A63] focus:outline-hidden text-[#202E24]"
                  />
                </div>

                <div className="pt-2 flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsQuickLogOpen(false)}
                    className="flex-1 py-2.5 rounded-xl clay-btn-secondary font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl clay-btn-primary font-bold text-xs cursor-pointer"
                  >
                    Save Activity
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
