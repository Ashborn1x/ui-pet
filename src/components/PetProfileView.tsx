import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  SquarePen,
  Heart,
  Calendar,
  CheckCircle2,
  Circle,
  Phone,
  ShieldCheck,
  Plus,
  Utensils,
  Droplets,
  Activity as ActivityIcon,
  Sparkles,
  X,
  Check
} from 'lucide-react';
import { Pet, CareLog, CareType } from '../types';

interface PetProfileViewProps {
  pet: Pet;
  logs: CareLog[];
  onBack: () => void;
  onUpdatePet: (updatedPet: Pet) => void;
  onToggleLog: (logId: string) => void;
  onAddLog: (newLog: Omit<CareLog, 'id'>) => void;
}

export const PetProfileView: React.FC<PetProfileViewProps> = ({
  pet,
  logs,
  onBack,
  onUpdatePet,
  onToggleLog,
  onAddLog,
}) => {
  const [activeTab, setActiveTab] = useState<'health' | 'diet' | 'activity'>('health');
  const [isEditing, setIsEditing] = useState(false);
  const [weightDisplayUnit, setWeightDisplayUnit] = useState<'kg' | 'lbs'>(pet.weightUnit || 'kg');

  // Edit form state
  const [editName, setEditName] = useState(pet.name);
  const [editBreed, setEditBreed] = useState(pet.breed);
  const [editWeight, setEditWeight] = useState(pet.weight.toString());
  const [editAgeYears, setEditAgeYears] = useState(pet.ageYears.toString());
  const [editAgeMonths, setEditAgeMonths] = useState((pet.ageMonths || 0).toString());
  const [editDietaryNotes, setEditDietaryNotes] = useState(pet.dietaryNotes || '');
  const [editVetName, setEditVetName] = useState(pet.vetName || 'Dr. Katherine Wells (Sage Hill Vet)');
  const [editVetPhone, setEditVetPhone] = useState(pet.vetPhone || '(555) 382-9012');

  // Logs for this pet
  const petLogs = logs.filter((l) => l.petId === pet.id);
  const completedLogs = petLogs.filter((l) => l.completed).length;

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Pet = {
      ...pet,
      name: editName.trim() || pet.name,
      breed: editBreed.trim() || pet.breed,
      weight: parseFloat(editWeight) || pet.weight,
      ageYears: parseInt(editAgeYears, 10) || pet.ageYears,
      ageMonths: parseInt(editAgeMonths, 10) || 0,
      dietaryNotes: editDietaryNotes.trim(),
      vetName: editVetName.trim(),
      vetPhone: editVetPhone.trim(),
    };
    onUpdatePet(updated);
    setIsEditing(false);
  };

  // Convert weight if user toggles
  const displayedWeight = weightDisplayUnit === pet.weightUnit 
    ? pet.weight 
    : weightDisplayUnit === 'kg' 
      ? Math.round((pet.weight / 2.20462) * 10) / 10 
      : Math.round((pet.weight * 2.20462) * 10) / 10;

  return (
    <div className="relative min-h-full bg-white text-[#1F2E23] flex flex-col">
      {/* Top Hero Photo Section */}
      <div className="relative w-full h-[350px] sm:h-[380px] bg-[#EFECE6] overflow-hidden flex-shrink-0">
        <img
          src={pet.avatarUrl}
          alt={pet.name}
          className="w-full h-full object-cover object-center"
        />

        {/* Subtle top gradient for button contrast */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 via-black/10 to-transparent pointer-events-none" />

        {/* Top-Left: Circular Back Button */}
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back to pets list"
          className="absolute top-5 left-5 w-10 h-10 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.15)] text-[#1F2E23] hover:bg-white active:scale-95 transition-all cursor-pointer z-10"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Top-Right: Circular Edit Button */}
        <button
          type="button"
          onClick={() => {
            setEditName(pet.name);
            setEditBreed(pet.breed);
            setEditWeight(pet.weight.toString());
            setEditAgeYears(pet.ageYears.toString());
            setEditAgeMonths((pet.ageMonths || 0).toString());
            setEditDietaryNotes(pet.dietaryNotes || '');
            setEditVetName(pet.vetName || 'Dr. Katherine Wells (Sage Hill Vet)');
            setEditVetPhone(pet.vetPhone || '(555) 382-9012');
            setIsEditing(true);
          }}
          aria-label="Edit pet details"
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.15)] text-[#1F2E23] hover:bg-white active:scale-95 transition-all cursor-pointer z-10"
        >
          <SquarePen className="w-4.5 h-4.5 stroke-[2]" />
        </button>
      </div>

      {/* Overlapping White Profile Card */}
      <div className="relative -mt-9 z-10 flex-1 bg-white rounded-t-[36px] pt-6 px-6 pb-24 shadow-[0_-8px_25px_rgba(0,0,0,0.06)] flex flex-col">
        {/* Row 1: Name, Breed, and Circular Multi-segment Wellness Gauge */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[30px] font-extrabold text-[#1B2B20] tracking-tight leading-tight">
              {pet.name}
            </h1>
            <p className="text-[12px] font-extrabold uppercase tracking-widest text-[#4E7A5E] mt-1">
              {pet.breed}
            </p>
          </div>

          {/* Multi-color circular gauge with centered warm heart icon matching screenshot */}
          <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 52 52">
              {/* Background muted track */}
              <circle
                cx="26"
                cy="26"
                r="22"
                fill="none"
                stroke="#EAE4D7"
                strokeWidth="4"
              />
              {/* Sage Green Arc */}
              <circle
                cx="26"
                cy="26"
                r="22"
                fill="none"
                stroke="#4E8363"
                strokeWidth="4"
                strokeDasharray="60 138"
                strokeDashoffset="0"
                strokeLinecap="round"
              />
              {/* Amber / Golden Arc */}
              <circle
                cx="26"
                cy="26"
                r="22"
                fill="none"
                stroke="#EDA63A"
                strokeWidth="4"
                strokeDasharray="45 138"
                strokeDashoffset="-65"
                strokeLinecap="round"
              />
              {/* Soft Blue Arc */}
              <circle
                cx="26"
                cy="26"
                r="22"
                fill="none"
                stroke="#8FB6D3"
                strokeWidth="4"
                strokeDasharray="25 138"
                strokeDashoffset="-115"
                strokeLinecap="round"
              />
            </svg>
            {/* Centered amber heart icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-[#EDA63A] text-[#EDA63A]" />
            </div>
          </div>
        </div>

        {/* Row 2: Two Large Rounded Metric Pill Badges */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          {/* Weight Card */}
          <button
            type="button"
            onClick={() => setWeightDisplayUnit((prev) => (prev === 'kg' ? 'lbs' : 'kg'))}
            title="Click to toggle kg / lbs"
            className="bg-[#FAF7F0] hover:bg-[#F5F1E8] transition-colors rounded-[24px] py-4 px-3 text-center border border-[#ECE6D8]/60 cursor-pointer group"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8A9B8F] block mb-1">
              WEIGHT
            </span>
            <div className="text-[21px] font-extrabold text-[#1B2B20] tracking-tight">
              {displayedWeight}{' '}
              <span className="text-[14px] font-semibold text-[#718276] group-hover:text-[#4E7A5E] transition-colors">
                {weightDisplayUnit}
              </span>
            </div>
          </button>

          {/* Age Card */}
          <div className="bg-[#FAF7F0] rounded-[24px] py-4 px-3 text-center border border-[#ECE6D8]/60">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8A9B8F] block mb-1">
              AGE
            </span>
            <div className="text-[21px] font-extrabold text-[#1B2B20] tracking-tight">
              {pet.ageYears}y {pet.ageMonths || 0}m
            </div>
          </div>
        </div>

        {/* Row 3: Segmented Pill Navigation: Health | Diet | Activity */}
        <div className="mt-6 bg-[#FAF7F0] p-1.5 rounded-full flex items-center justify-between border border-[#ECE6D8]/60">
          {(['health', 'diet', 'activity'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-3 rounded-full text-[13.5px] font-bold capitalize transition-all cursor-pointer text-center ${
                  isActive
                    ? 'bg-[#EDA63A] text-white shadow-xs'
                    : 'text-[#7A8C80] hover:text-[#1F2E23]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Row 4: Tab Content Panels */}
        <div className="mt-5 flex-1 space-y-4">
          <AnimatePresence mode="wait">
            {/* ================= TAB 1: HEALTH ================= */}
            {activeTab === 'health' && (
              <motion.div
                key="health-tab"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="space-y-3.5"
              >
                {/* Wellness Score Card */}
                <div className="p-4 rounded-[22px] bg-[#FAF7F0] border border-[#ECE6D8]/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1F2E23] flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#4E7A5E]" />
                      <span>Vitality & Wellness Status</span>
                    </span>
                    <span className="text-[11px] font-extrabold text-[#3E654C] bg-[#E8F0EA] px-2.5 py-0.5 rounded-full">
                      98% Optimal
                    </span>
                  </div>
                  <p className="text-[12px] text-[#718276] leading-relaxed">
                    Vaccinations up to date. Coat, energy, and appetite metrics are within peak healthy parameters.
                  </p>
                </div>

                {/* Veterinary Contact Card */}
                <div className="p-4 rounded-[22px] bg-[#FAF7F0] border border-[#ECE6D8]/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1F2E23]">Primary Veterinarian</span>
                    <span className="text-[11px] text-[#8A9B8F] font-medium">Checked 2 mos ago</span>
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <div>
                      <p className="text-[13.5px] font-bold text-[#1F2E23]">
                        {pet.vetName || 'Dr. Katherine Wells'}
                      </p>
                      <p className="text-[11.5px] text-[#718276]">
                        Sage Hill Veterinary Care · {pet.vetPhone || '(555) 382-9012'}
                      </p>
                    </div>
                    {pet.vetPhone && (
                      <a
                        href={`tel:${pet.vetPhone}`}
                        className="w-9 h-9 rounded-full bg-[#E8F0EA] text-[#3E654C] flex items-center justify-center hover:bg-[#D7E6DB] transition-colors cursor-pointer"
                        title="Call Vet"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Medical Records & Routine Meds */}
                <div className="p-4 rounded-[22px] bg-[#FAF7F0] border border-[#ECE6D8]/60 space-y-2">
                  <span className="text-xs font-bold text-[#1F2E23] block">
                    Routine Supplements & Care
                  </span>
                  <div className="space-y-1.5 text-[12px] text-[#526558]">
                    <div className="flex items-center justify-between py-1 border-b border-[#ECE6D8]/40">
                      <span>Daily Omega-3 Chewable</span>
                      <span className="font-bold text-[#3E654C]">Active</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-[#ECE6D8]/40">
                      <span>Rabies & DHPP Vaccines</span>
                      <span className="font-bold text-[#3E654C]">Valid thru 2027</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span>Flea & Tick Prevention</span>
                      <span className="font-bold text-[#3E654C]">Monthly</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================= TAB 2: DIET ================= */}
            {activeTab === 'diet' && (
              <motion.div
                key="diet-tab"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="space-y-3.5"
              >
                {/* Feeding Plan Card */}
                <div className="p-4 rounded-[22px] bg-[#FAF7F0] border border-[#ECE6D8]/60 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Utensils className="w-4 h-4 text-[#EDA63A]" />
                    <span className="text-xs font-bold text-[#1F2E23]">Daily Feeding Schedule</span>
                  </div>
                  <div className="space-y-2 pt-1 text-[12.5px]">
                    <div className="p-2.5 rounded-xl bg-white border border-[#EDE7DB]/50 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-[#1F2E23]">Morning Breakfast (07:30 AM)</p>
                        <p className="text-[11px] text-[#718276]">1 cup Salmon & Sweet Potato kibble</p>
                      </div>
                      <span className="text-[11px] font-bold text-[#3E654C] bg-[#E8F0EA] px-2 py-0.5 rounded-md">
                        Fed
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-[#EDE7DB]/50 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-[#1F2E23]">Evening Dinner (06:00 PM)</p>
                        <p className="text-[11px] text-[#718276]">1 cup Kibble + Warm Bone Broth</p>
                      </div>
                      <span className="text-[11px] font-bold text-[#EDA63A] bg-[#FEF4E6] px-2 py-0.5 rounded-md">
                        Scheduled
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dietary Notes & Sensitivities */}
                <div className="p-4 rounded-[22px] bg-[#FAF7F0] border border-[#ECE6D8]/60 space-y-1.5">
                  <span className="text-xs font-bold text-[#1F2E23] block">
                    Sensitivities & Notes
                  </span>
                  <p className="text-[12.5px] text-[#55675A] leading-relaxed">
                    {pet.dietaryNotes || 'Sensitive stomach. Avoid chicken by-products. Plenty of fresh filtered water.'}
                  </p>
                </div>

                {/* Hydration */}
                <div className="p-3.5 rounded-[22px] bg-[#FAF7F0] border border-[#ECE6D8]/60 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Droplets className="w-4 h-4 text-[#4A90E2]" />
                    <div>
                      <p className="text-xs font-bold text-[#1F2E23]">Fresh Water Fountain</p>
                      <p className="text-[11px] text-[#718276]">Refilled twice daily</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onAddLog({
                        petId: pet.id,
                        type: 'water',
                        title: 'Fresh Water Refill',
                        detail: 'Refilled filtered bowl',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        date: 'Today',
                        completed: true,
                      });
                    }}
                    className="px-3 py-1 rounded-full bg-[#EAF2FB] text-[#3672B5] font-bold text-xs hover:bg-[#D7E8F8] transition-colors cursor-pointer"
                  >
                    + Refill
                  </button>
                </div>
              </motion.div>
            )}

            {/* ================= TAB 3: ACTIVITY ================= */}
            {activeTab === 'activity' && (
              <motion.div
                key="activity-tab"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="space-y-3.5"
              >
                {/* Routine Summary */}
                <div className="p-3.5 rounded-[22px] bg-[#FAF7F0] border border-[#ECE6D8]/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#1F2E23] block">Today's Routine Check</span>
                    <span className="text-[11px] text-[#718276]">
                      {completedLogs} of {petLogs.length || 3} tasks completed
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-[#3E654C] bg-[#E8F0EA] px-2.5 py-1 rounded-full">
                    {Math.round((completedLogs / (petLogs.length || 1)) * 100)}%
                  </span>
                </div>

                {/* Pet Specific Care Logs with interactive check */}
                <div className="space-y-2">
                  {petLogs.length > 0 ? (
                    petLogs.map((log) => (
                      <div
                        key={log.id}
                        onClick={() => onToggleLog(log.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center space-x-3 ${
                          log.completed
                            ? 'bg-[#FAF7F0]/60 border-[#EDE7DC] opacity-75'
                            : 'bg-white border-[#ECE6D8] shadow-2xs'
                        }`}
                      >
                        <button
                          type="button"
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ${
                            log.completed
                              ? 'bg-[#4E7A5E] text-white'
                              : 'border-2 border-[#BAC2BB] text-transparent hover:border-[#4E7A5E]'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-bold truncate ${
                              log.completed ? 'line-through text-[#718276]' : 'text-[#1F2E23]'
                            }`}
                          >
                            {log.title}
                          </p>
                          <p className="text-[11px] text-[#8A9B8F] truncate">{log.detail}</p>
                        </div>
                        <span className="text-[11px] font-semibold text-[#8A9B8F] flex-shrink-0">
                          {log.time}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-[#718276] bg-[#FAF7F0] rounded-2xl border border-[#EDE7DC]">
                      No care logs logged for today yet.
                    </div>
                  )}
                </div>

                {/* Quick Add Routine for this pet */}
                <button
                  type="button"
                  onClick={() => {
                    onAddLog({
                      petId: pet.id,
                      type: 'walk',
                      title: `Walk & Play with ${pet.name}`,
                      detail: '25 min afternoon outdoor exercise',
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      date: 'Today',
                      completed: false,
                    });
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FAF7F0] hover:bg-[#F2ECE0] border border-dashed border-[#D5CDBD] text-xs font-bold text-[#55675A] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>+ Quick Add Routine for {pet.name}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Edit Pet Details Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-[32px] p-6 shadow-2xl border border-[#EDE8DE] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE8DE]">
                <h3 className="text-base font-extrabold text-[#1F2E23]">Edit {pet.name}'s Profile</h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-8 h-8 rounded-full bg-[#FAF8F3] hover:bg-[#ECE6D8] flex items-center justify-center text-[#55675A] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-3.5 pt-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#55675A] uppercase tracking-wider mb-1">
                    Companion Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F3] border border-[#EDE8DE] text-sm text-[#1F2E23] focus:outline-hidden focus:border-[#4E7A5E]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#55675A] uppercase tracking-wider mb-1">
                    Breed
                  </label>
                  <input
                    type="text"
                    value={editBreed}
                    onChange={(e) => setEditBreed(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F3] border border-[#EDE8DE] text-sm text-[#1F2E23] focus:outline-hidden focus:border-[#4E7A5E]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#55675A] uppercase tracking-wider mb-1">
                      Weight ({pet.weightUnit || 'kg'})
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={editWeight}
                      onChange={(e) => setEditWeight(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F3] border border-[#EDE8DE] text-sm text-[#1F2E23] focus:outline-hidden focus:border-[#4E7A5E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#55675A] uppercase tracking-wider mb-1">
                      Age (Years)
                    </label>
                    <input
                      type="number"
                      value={editAgeYears}
                      onChange={(e) => setEditAgeYears(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F3] border border-[#EDE8DE] text-sm text-[#1F2E23] focus:outline-hidden focus:border-[#4E7A5E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#55675A] uppercase tracking-wider mb-1">
                    Dietary & Health Notes
                  </label>
                  <textarea
                    rows={2}
                    value={editDietaryNotes}
                    onChange={(e) => setEditDietaryNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F3] border border-[#EDE8DE] text-sm text-[#1F2E23] focus:outline-hidden focus:border-[#4E7A5E]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#55675A] uppercase tracking-wider mb-1">
                    Primary Vet & Phone
                  </label>
                  <input
                    type="text"
                    value={editVetName}
                    onChange={(e) => setEditVetName(e.target.value)}
                    placeholder="Doctor or Clinic Name"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F3] border border-[#EDE8DE] text-sm text-[#1F2E23] focus:outline-hidden focus:border-[#4E7A5E] mb-2"
                  />
                  <input
                    type="text"
                    value={editVetPhone}
                    onChange={(e) => setEditVetPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F3] border border-[#EDE8DE] text-sm text-[#1F2E23] focus:outline-hidden focus:border-[#4E7A5E]"
                  />
                </div>

                <div className="pt-2 flex items-center space-x-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2.5 rounded-xl border border-[#EDE8DE] text-xs font-bold text-[#55675A] hover:bg-[#FAF8F3] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#4E7A5E] hover:bg-[#3E654C] text-white text-xs font-bold cursor-pointer shadow-xs"
                  >
                    Save Changes
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
