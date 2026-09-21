import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  SquarePen,
  Plus,
  Footprints,
  Utensils,
  Syringe,
  Image as ImageIcon,
  Bell,
  BellOff,
  Clock,
  Trash2,
  X,
  Upload,
  Camera,
  Maximize2
} from 'lucide-react';
import { Pet, CareLog, ScheduledActivity, DietSchedule, HealthRecord } from '../types';

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
  onBack,
  onUpdatePet,
}) => {
  // Tabs: Activity | Diet | Health | Gallery
  const [activeTab, setActiveTab] = useState<'activity' | 'diet' | 'health' | 'gallery'>('activity');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals & UI states
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isAddDietOpen, setIsAddDietOpen] = useState(false);
  const [isAddHealthOpen, setIsAddHealthOpen] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simple Add Activity State
  const [actTitle, setActTitle] = useState('Walking everyday');
  const [actTime, setActTime] = useState('07:00 AM');
  const [actNotify, setActNotify] = useState(true);

  // Simple Add Diet State
  const [dietTitle, setDietTitle] = useState('Eat Breakfast');
  const [dietTime, setDietTime] = useState('07:30 AM');
  const [dietNotify, setDietNotify] = useState(true);

  // Simple Add Health Timeline State
  const [healthTitle, setHealthTitle] = useState('Anti-Rabies Vaccine');
  const [healthDate, setHealthDate] = useState('May 15, 2026');

  // Edit Basic Info State
  const [editName, setEditName] = useState(pet.name);
  const [editBreed, setEditBreed] = useState(pet.breed);
  const [editAgeYears, setEditAgeYears] = useState(pet.ageYears.toString());
  const [editWeight, setEditWeight] = useState(pet.weight.toString());

  // Default gallery photos if none saved yet
  const defaultPhotos = [
    pet.avatarUrl,
    '/src/assets/images/clay_pet_care_simple_1789625871275.jpg',
    '/src/assets/images/clay_pet_wellness_1789625894177.jpg',
    '/src/assets/images/clay_cat_daily_routine_1789625909416.jpg',
  ];
  const petPhotos: string[] = pet.photos && pet.photos.length > 0 ? pet.photos : defaultPhotos;

  // Data lists
  const activities: ScheduledActivity[] = pet.activities || [
    {
      id: 'act-1',
      petId: pet.id,
      title: 'Walking everyday',
      time: '07:00 AM',
      frequency: 'Everyday',
      notify: true,
      completedToday: false,
    },
  ];

  const dietSchedules: DietSchedule[] = pet.dietSchedules || [
    {
      id: 'diet-1',
      petId: pet.id,
      title: 'Eat Breakfast',
      time: '07:30 AM',
      portion: '',
      frequency: 'Everyday',
      notify: true,
    },
    {
      id: 'diet-2',
      petId: pet.id,
      title: 'Eat Dinner',
      time: '06:00 PM',
      portion: '',
      frequency: 'Everyday',
      notify: true,
    },
  ];

  const healthRecords: HealthRecord[] = pet.healthRecords || [
    {
      id: 'rec-1',
      petId: pet.id,
      type: 'vaccine',
      title: 'Anti-Rabies Vaccine',
      date: 'May 15, 2026',
      status: 'Completed',
    },
    {
      id: 'rec-2',
      petId: pet.id,
      type: 'vaccine',
      title: 'DHPP Booster',
      date: 'Feb 12, 2026',
      status: 'Completed',
    },
    {
      id: 'rec-3',
      petId: pet.id,
      type: 'checkup',
      title: 'Annual Vet Checkup',
      date: 'Aug 18, 2025',
      status: 'Completed',
    },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2400);
  };

  // Activity handlers
  const handleToggleActivityNotify = (id: string) => {
    const updated = activities.map((a) => {
      if (a.id === id) {
        const next = !a.notify;
        showToast(next ? `🔔 Notification set for ${a.time}` : `🔕 Notification turned off`);
        return { ...a, notify: next };
      }
      return a;
    });
    onUpdatePet({ ...pet, activities: updated });
  };

  const handleDeleteActivity = (id: string) => {
    const updated = activities.filter((a) => a.id !== id);
    onUpdatePet({ ...pet, activities: updated });
    showToast('Activity removed');
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitle.trim()) return;
    const newItem: ScheduledActivity = {
      id: `act-${Date.now()}`,
      petId: pet.id,
      title: actTitle.trim(),
      time: actTime.trim() || '07:00 AM',
      frequency: 'Everyday',
      notify: actNotify,
      completedToday: false,
    };
    onUpdatePet({ ...pet, activities: [...activities, newItem] });
    setIsAddActivityOpen(false);
    showToast(actNotify ? `🔔 Notification set for ${newItem.time}` : 'Activity added');
  };

  // Diet handlers
  const handleToggleDietNotify = (id: string) => {
    const updated = dietSchedules.map((d) => {
      if (d.id === id) {
        const next = !d.notify;
        showToast(next ? `🔔 Reminder set for ${d.time}` : `🔕 Reminder turned off`);
        return { ...d, notify: next };
      }
      return d;
    });
    onUpdatePet({ ...pet, dietSchedules: updated });
  };

  const handleDeleteDiet = (id: string) => {
    const updated = dietSchedules.filter((d) => d.id !== id);
    onUpdatePet({ ...pet, dietSchedules: updated });
    showToast('Meal removed');
  };

  const handleAddDiet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dietTitle.trim()) return;
    const newItem: DietSchedule = {
      id: `diet-${Date.now()}`,
      petId: pet.id,
      title: dietTitle.trim(),
      time: dietTime.trim() || '07:30 AM',
      portion: '',
      frequency: 'Everyday',
      notify: dietNotify,
    };
    onUpdatePet({ ...pet, dietSchedules: [...dietSchedules, newItem] });
    setIsAddDietOpen(false);
    showToast(dietNotify ? `🔔 Reminder set for ${newItem.time}` : 'Meal added');
  };

  // Health timeline handlers
  const handleDeleteHealth = (id: string) => {
    const updated = healthRecords.filter((h) => h.id !== id);
    onUpdatePet({ ...pet, healthRecords: updated });
    showToast('Timeline record removed');
  };

  const handleAddHealth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!healthTitle.trim()) return;
    const newItem: HealthRecord = {
      id: `rec-${Date.now()}`,
      petId: pet.id,
      type: 'vaccine',
      title: healthTitle.trim(),
      date: healthDate.trim() || 'Today',
      status: 'Completed',
    };
    onUpdatePet({ ...pet, healthRecords: [newItem, ...healthRecords] });
    setIsAddHealthOpen(false);
    showToast('Added to health timeline');
  };

  // Gallery Photo Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        const updatedPhotos = [result, ...petPhotos];
        onUpdatePet({ ...pet, photos: updatedPhotos });
        showToast('Photo added to gallery');
        setIsAddPhotoOpen(false);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input so user can pick the same file again if desired
    e.target.value = '';
  };

  const handleAddPhotoByUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrlInput.trim()) return;
    const updatedPhotos = [photoUrlInput.trim(), ...petPhotos];
    onUpdatePet({ ...pet, photos: updatedPhotos });
    setPhotoUrlInput('');
    setIsAddPhotoOpen(false);
    showToast('Photo added to gallery');
  };

  const handleDeletePhoto = (indexToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedPhotos = petPhotos.filter((_, i) => i !== indexToDelete);
    onUpdatePet({ ...pet, photos: updatedPhotos });
    if (selectedPhoto === petPhotos[indexToDelete]) {
      setSelectedPhoto(null);
    }
    showToast('Photo removed');
  };

  const handleSetAsProfileAvatar = (photoUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdatePet({ ...pet, avatarUrl: photoUrl });
    showToast(`Set as ${pet.name}'s profile photo`);
    setSelectedPhoto(null);
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePet({
      ...pet,
      name: editName.trim() || pet.name,
      breed: editBreed.trim() || pet.breed,
      ageYears: parseInt(editAgeYears, 10) || pet.ageYears,
      weight: parseFloat(editWeight) || pet.weight,
    });
    setIsEditingInfo(false);
    showToast('Profile updated');
  };

  return (
    <div className="relative h-full w-full bg-white text-[#1F2E23] flex flex-col overflow-hidden">
      {/* Gentle Floating Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 inset-x-0 mx-auto w-fit max-w-[90%] z-50 bg-[#1E3326] text-white text-[13px] font-semibold py-2 px-4 rounded-full shadow-lg flex items-center space-x-2"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* TOP 50%: PET PICTURE HERO WITH SUBTLE FADE & INFORMATION OVERLAY          */}
      {/* ========================================================================= */}
      <div className="relative w-full h-1/2 min-h-[300px] max-h-[50%] bg-[#EAE5DA] overflow-hidden flex-shrink-0">
        {/* Full Pet Photo - High quality presentation with guaranteed fallback */}
        <img
          src={pet.avatarUrl || '/src/assets/images/golden_retriever_photo_1789664976220.jpg'}
          alt={pet.name}
          onError={(e) => {
            // Safe fallback if a custom uploaded URL or path failed
            const target = e.currentTarget as HTMLImageElement;
            if (!target.src.includes('golden_retriever_photo')) {
              target.src = '/src/assets/images/golden_retriever_photo_1789664976220.jpg';
            }
          }}
          className="w-full h-full object-cover object-center"
        />

        {/* Soft Fading Opacity Gradient: gently fades into white at the bottom border */}
        <div 
          className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/75 to-transparent pointer-events-none" 
        />

        {/* Top Floating Navigation & Actions Bar */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="w-10 h-10 rounded-full bg-[#1A261E]/90 backdrop-blur-md text-white flex items-center justify-center shadow-lg hover:bg-black active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-bold text-[#1F2E23] bg-white/85 backdrop-blur-md px-3.5 py-1 rounded-full shadow-xs border border-white/60">
            Details
          </span>

          <button
            type="button"
            onClick={() => {
              setEditName(pet.name);
              setEditBreed(pet.breed);
              setEditAgeYears(pet.ageYears.toString());
              setEditWeight(pet.weight.toString());
              setIsEditingInfo(true);
            }}
            aria-label="Edit pet"
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md text-[#1F2E23] hover:bg-white active:scale-95 transition-all cursor-pointer"
          >
            <SquarePen className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Pet Name & Badge Floating Right Above the Bottom Transition */}
        <div className="absolute inset-x-0 bottom-0 px-5 pb-2.5 z-10 flex items-end justify-between">
          <div>
            <h1 className="text-[28px] font-black text-[#111A13] tracking-tight leading-none drop-shadow-2xs">
              {pet.name}
            </h1>
            <p className="text-[13.5px] text-[#4A5E50] font-semibold mt-1">
              {pet.breed}
            </p>
          </div>

          {/* Quick Pet Badge / Stats Tag */}
          <div className="flex items-center space-x-1.5 bg-[#1F2E23] text-white px-3 py-1.5 rounded-full shadow-md">
            <span className="text-[12px] font-bold">
              {pet.ageYears} yrs · {pet.weight} {pet.weightUnit || 'lbs'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM 50%: INFORMATION, SCHEDULES & GALLERY TABS                         */}
      {/* ========================================================================= */}
      <div className="relative z-10 h-1/2 flex-1 bg-white px-5 pt-2 pb-6 flex flex-col overflow-y-auto scrollbar-none">
        {/* 4 Simple Tabs: Activity | Diet | Health | Gallery */}
        <div className="p-1 bg-[#F5F2EB] rounded-full flex items-center flex-shrink-0">
          {(['activity', 'diet', 'health', 'gallery'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-full text-[13px] font-bold capitalize transition-all cursor-pointer text-center ${
                  isActive
                    ? 'bg-[#2E5B42] text-white shadow-xs'
                    : 'text-[#6D8072] hover:text-[#1F2E23]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="mt-5 flex-1">
          {/* ========================================================================= */}
          {/* 1. ACTIVITY TAB                                                           */}
          {/* ========================================================================= */}
          {activeTab === 'activity' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#7A8C80]">
                  Daily Activities
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActTitle('Walking everyday');
                    setActTime('07:00 AM');
                    setActNotify(true);
                    setIsAddActivityOpen(true);
                  }}
                  className="text-[12.5px] font-bold text-[#2E5B42] hover:text-[#1F3D2C] flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Activity</span>
                </button>
              </div>

              {activities.length === 0 ? (
                <div className="p-6 text-center text-[13px] text-[#7A8C80] bg-[#FAF8F5] rounded-2xl border border-[#EDE8DE]">
                  No activities added yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {activities.map((act) => (
                    <div
                      key={act.id}
                      className="p-3.5 rounded-2xl bg-white border border-[#EDE8DE] flex items-center justify-between gap-3 shadow-2xs hover:border-[#DDD6C8] transition-colors"
                    >
                      {/* Left: Icon & Info */}
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#EAF4ED] text-[#2E5B42] flex items-center justify-center flex-shrink-0">
                          <Footprints className="w-4.5 h-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-bold text-[#1F2E23] truncate">
                            {act.title}
                          </p>
                          <div className="flex items-center space-x-1 text-[12px] text-[#718276] mt-0.5">
                            <Clock className="w-3 h-3 text-[#94A59A]" />
                            <span>{act.time}</span>
                            <span>·</span>
                            <span>{act.frequency || 'Everyday'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Simple Notify Bell Toggle & Delete */}
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleActivityNotify(act.id)}
                          title={act.notify ? 'Reminding at ' + act.time : 'Notifications off'}
                          className={`px-2.5 py-1 rounded-full text-[11.5px] font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                            act.notify
                              ? 'bg-[#EAF4ED] text-[#2E5B42] border border-[#CFE5D5]'
                              : 'bg-[#F2ECE1] text-[#85776B]'
                          }`}
                        >
                          {act.notify ? (
                            <>
                              <Bell className="w-3 h-3 text-[#2E5B42]" />
                              <span>Notify ON</span>
                            </>
                          ) : (
                            <>
                              <BellOff className="w-3 h-3 text-[#85776B]" />
                              <span>Off</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteActivity(act.id)}
                          title="Delete activity"
                          className="w-7 h-7 rounded-full text-[#BAC2BB] hover:text-[#C15444] flex items-center justify-center cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. DIET TAB (Simple: e.g. Eat Breakfast, 7:30 AM, notify toggle)           */}
          {/* ========================================================================= */}
          {activeTab === 'diet' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#7A8C80]">
                  Diet & Feeding
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setDietTitle('Eat Breakfast');
                    setDietTime('07:30 AM');
                    setDietNotify(true);
                    setIsAddDietOpen(true);
                  }}
                  className="text-[12.5px] font-bold text-[#2E5B42] hover:text-[#1F3D2C] flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Meal</span>
                </button>
              </div>

              {dietSchedules.length === 0 ? (
                <div className="p-6 text-center text-[13px] text-[#7A8C80] bg-[#FAF8F5] rounded-2xl border border-[#EDE8DE]">
                  No feeding schedule added yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {dietSchedules.map((meal) => (
                    <div
                      key={meal.id}
                      className="p-3.5 rounded-2xl bg-white border border-[#EDE8DE] flex items-center justify-between gap-3 shadow-2xs hover:border-[#DDD6C8] transition-colors"
                    >
                      {/* Left: Icon & Meal info */}
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#FEF4E6] text-[#D8821B] flex items-center justify-center flex-shrink-0">
                          <Utensils className="w-4.5 h-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-bold text-[#1F2E23] truncate">
                            {meal.title}
                          </p>
                          <div className="flex items-center space-x-1 text-[12px] text-[#718276] mt-0.5">
                            <Clock className="w-3 h-3 text-[#94A59A]" />
                            <span>{meal.time}</span>
                            <span>·</span>
                            <span>Everyday</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Simple Notify Bell Toggle & Delete */}
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleDietNotify(meal.id)}
                          title={meal.notify ? 'Reminding at ' + meal.time : 'Notifications off'}
                          className={`px-2.5 py-1 rounded-full text-[11.5px] font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                            meal.notify
                              ? 'bg-[#FEF4E6] text-[#B87019] border border-[#F6E1C4]'
                              : 'bg-[#F2ECE1] text-[#85776B]'
                          }`}
                        >
                          {meal.notify ? (
                            <>
                              <Bell className="w-3 h-3 text-[#B87019]" />
                              <span>Notify ON</span>
                            </>
                          ) : (
                            <>
                              <BellOff className="w-3 h-3 text-[#85776B]" />
                              <span>Off</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteDiet(meal.id)}
                          title="Delete meal"
                          className="w-7 h-7 rounded-full text-[#BAC2BB] hover:text-[#C15444] flex items-center justify-center cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. HEALTH TAB (Clean simple history timeline, e.g. Anti-Rabies Vaccine)     */}
          {/* ========================================================================= */}
          {activeTab === 'health' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#7A8C80]">
                  Health History Timeline
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setHealthTitle('Anti-Rabies Vaccine');
                    setHealthDate('May 15, 2026');
                    setIsAddHealthOpen(true);
                  }}
                  className="text-[12.5px] font-bold text-[#2E5B42] hover:text-[#1F3D2C] flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add History</span>
                </button>
              </div>

              {healthRecords.length === 0 ? (
                <div className="p-6 text-center text-[13px] text-[#7A8C80] bg-[#FAF8F5] rounded-2xl border border-[#EDE8DE]">
                  No health history recorded yet.
                </div>
              ) : (
                <div className="relative pl-6 space-y-4 pt-1">
                  {/* Clean vertical timeline line */}
                  <div className="absolute left-[11px] top-2.5 bottom-2.5 w-0.5 bg-[#E8E2D5]" />

                  {healthRecords.map((record) => (
                    <div key={record.id} className="relative group">
                      {/* Timeline dot / icon pin */}
                      <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-[#EAF4ED] border-2 border-white text-[#2E5B42] flex items-center justify-center shadow-xs">
                        <Syringe className="w-3 h-3" />
                      </div>

                      {/* Content Card */}
                      <div className="p-3 rounded-2xl bg-white border border-[#EDE8DE] flex items-center justify-between shadow-2xs hover:border-[#DDD6C8] transition-colors">
                        <div>
                          <h4 className="text-[13.5px] font-bold text-[#1F2E23]">
                            {record.title}
                          </h4>
                          <p className="text-[12px] text-[#718276] mt-0.5">
                            {record.date}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteHealth(record.id)}
                          title="Delete record"
                          className="w-7 h-7 rounded-full text-[#BAC2BB] hover:text-[#C15444] flex items-center justify-center cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. GALLERY TAB (Simple, clean photo grid with add and preview)            */}
          {/* ========================================================================= */}
          {activeTab === 'gallery' && (
            <div className="space-y-3">
              {/* Header with Add Photo Button */}
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#7A8C80]">
                  {petPhotos.length} {petPhotos.length === 1 ? 'Photo' : 'Photos'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddPhotoOpen(true)}
                  className="text-[12.5px] font-bold text-[#2E5B42] hover:text-[#1F3D2C] flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Photo</span>
                </button>
              </div>

              {/* Hidden File Input for Device Upload */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />

              {/* Photos Grid */}
              {petPhotos.length === 0 ? (
                <div className="p-8 text-center bg-[#FAF8F5] rounded-2xl border border-[#EDE8DE]">
                  <ImageIcon className="w-8 h-8 text-[#A8B8AD] mx-auto mb-2" />
                  <p className="text-[13px] font-semibold text-[#1F2E23]">No photos in gallery</p>
                  <p className="text-[12px] text-[#718276] mt-0.5">Add favorite memories of {pet.name}</p>
                  <button
                    type="button"
                    onClick={() => setIsAddPhotoOpen(true)}
                    className="mt-3 px-4 py-2 rounded-xl bg-[#2E5B42] text-white text-xs font-bold shadow-xs hover:bg-[#234532] cursor-pointer"
                  >
                    Upload Photo
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {petPhotos.map((photoUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedPhoto(photoUrl)}
                      className="group relative aspect-square rounded-2xl overflow-hidden bg-[#EFECE6] border border-[#EDE8DE] cursor-pointer shadow-2xs hover:shadow-md transition-all"
                    >
                      <img
                        src={photoUrl}
                        alt={`${pet.name} photo ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Current Profile Avatar Tag */}
                      {photoUrl === pet.avatarUrl && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs">
                          Profile
                        </div>
                      )}

                      {/* Hover Overlay with Delete & Expand */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
                        <span className="text-[11px] text-white font-medium flex items-center space-x-1">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleDeletePhoto(idx, e)}
                          title="Remove photo"
                          className="w-7 h-7 rounded-full bg-white/90 text-[#C15444] hover:bg-white flex items-center justify-center shadow-xs cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FULL-SCREEN PHOTO PREVIEW MODAL                                           */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between text-white z-10">
              <span className="text-sm font-semibold">{pet.name}'s Photo</span>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Center */}
            <div className="flex-1 flex items-center justify-center p-2 min-h-0">
              <img
                src={selectedPhoto}
                alt={pet.name}
                className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl"
              />
            </div>

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-center space-x-3 py-2">
              {selectedPhoto !== pet.avatarUrl && (
                <button
                  type="button"
                  onClick={(e) => handleSetAsProfileAvatar(selectedPhoto, e)}
                  className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-md transition-colors cursor-pointer"
                >
                  Set as Profile Avatar
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="px-4 py-2 rounded-full bg-[#2E5B42] text-white text-xs font-bold hover:bg-[#234532] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* ADD PHOTO MODAL (Choose Upload or Link)                                   */}
      {/* ========================================================================= */}
      {isAddPhotoOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-xl border border-[#EDE8DE]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-bold text-[#1F2E23]">Add to Gallery</h3>
              <button
                type="button"
                onClick={() => setIsAddPhotoOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F5F2EB] text-[#718276] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Option 1: Upload from device */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-4 rounded-2xl border-2 border-dashed border-[#CFD9D2] hover:border-[#2E5B42] bg-[#FAF8F5] flex flex-col items-center justify-center text-center cursor-pointer transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-[#EAF4ED] text-[#2E5B42] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-[13px] font-bold text-[#1F2E23]">
                  Choose from Device
                </span>
                <span className="text-[11px] text-[#718276] mt-0.5">
                  PNG, JPG, or GIF from your photo library
                </span>
              </button>

              <div className="flex items-center space-x-2 text-xs text-[#94A59A]">
                <div className="flex-1 h-px bg-[#EAE4D7]" />
                <span>or paste link</span>
                <div className="flex-1 h-px bg-[#EAE4D7]" />
              </div>

              {/* Option 2: Paste URL */}
              <form onSubmit={handleAddPhotoByUrl} className="space-y-3">
                <input
                  type="url"
                  value={photoUrlInput}
                  onChange={(e) => setPhotoUrlInput(e.target.value)}
                  placeholder="https://example.com/pet.jpg"
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-sm text-[#1F2E23] focus:outline-none focus:border-[#2E5B42]"
                />
                <button
                  type="submit"
                  disabled={!photoUrlInput.trim()}
                  className="w-full py-2.5 rounded-xl bg-[#2E5B42] disabled:bg-[#BAC2BB] hover:bg-[#234532] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Add by URL
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SIMPLE ADD ACTIVITY MODAL                                                 */}
      {/* ========================================================================= */}
      {isAddActivityOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-xl border border-[#EDE8DE]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-bold text-[#1F2E23]">Add Activity</h3>
              <button
                type="button"
                onClick={() => setIsAddActivityOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F5F2EB] text-[#718276] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddActivity} className="space-y-3.5">
              <div>
                <label className="text-[12px] font-bold text-[#55675A] block mb-1">
                  Activity Name
                </label>
                <input
                  type="text"
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  placeholder="e.g. Walking everyday"
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-sm text-[#1F2E23] focus:outline-none focus:border-[#2E5B42]"
                  required
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#55675A] block mb-1">
                  Time
                </label>
                <input
                  type="text"
                  value={actTime}
                  onChange={(e) => setActTime(e.target.value)}
                  placeholder="e.g. 07:00 AM"
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-sm text-[#1F2E23] focus:outline-none focus:border-[#2E5B42]"
                  required
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#EDE8DE]">
                <div>
                  <span className="text-[13px] font-bold text-[#1F2E23] block">
                    Notify Me
                  </span>
                  <span className="text-[11px] text-[#718276]">
                    Send a reminder at {actTime || 'this time'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={actNotify}
                  onChange={(e) => setActNotify(e.target.checked)}
                  className="w-5 h-5 accent-[#2E5B42] rounded cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#2E5B42] hover:bg-[#234532] text-white text-sm font-bold shadow-sm transition-all cursor-pointer mt-2"
              >
                Save Activity
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SIMPLE ADD DIET MODAL (No notes, just title and time)                      */}
      {/* ========================================================================= */}
      {isAddDietOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-xl border border-[#EDE8DE]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-bold text-[#1F2E23]">Add Meal</h3>
              <button
                type="button"
                onClick={() => setIsAddDietOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F5F2EB] text-[#718276] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDiet} className="space-y-3.5">
              <div>
                <label className="text-[12px] font-bold text-[#55675A] block mb-1">
                  Meal Name
                </label>
                <input
                  type="text"
                  value={dietTitle}
                  onChange={(e) => setDietTitle(e.target.value)}
                  placeholder="e.g. Eat Breakfast"
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-sm text-[#1F2E23] focus:outline-none focus:border-[#2E5B42]"
                  required
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#55675A] block mb-1">
                  Time
                </label>
                <input
                  type="text"
                  value={dietTime}
                  onChange={(e) => setDietTime(e.target.value)}
                  placeholder="e.g. 07:30 AM"
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-sm text-[#1F2E23] focus:outline-none focus:border-[#2E5B42]"
                  required
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#EDE8DE]">
                <div>
                  <span className="text-[13px] font-bold text-[#1F2E23] block">
                    Notify Me
                  </span>
                  <span className="text-[11px] text-[#718276]">
                    Send a reminder at {dietTime || 'this time'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={dietNotify}
                  onChange={(e) => setDietNotify(e.target.checked)}
                  className="w-5 h-5 accent-[#2E5B42] rounded cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#2E5B42] hover:bg-[#234532] text-white text-sm font-bold shadow-sm transition-all cursor-pointer mt-2"
              >
                Save Meal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SIMPLE ADD HEALTH TIMELINE MODAL                                          */}
      {/* ========================================================================= */}
      {isAddHealthOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-xl border border-[#EDE8DE]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-bold text-[#1F2E23]">Add to Timeline</h3>
              <button
                type="button"
                onClick={() => setIsAddHealthOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F5F2EB] text-[#718276] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddHealth} className="space-y-3.5">
              <div>
                <label className="text-[12px] font-bold text-[#55675A] block mb-1">
                  History or Vaccine Title
                </label>
                <input
                  type="text"
                  value={healthTitle}
                  onChange={(e) => setHealthTitle(e.target.value)}
                  placeholder="e.g. Anti-Rabies Vaccine"
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-sm text-[#1F2E23] focus:outline-none focus:border-[#2E5B42]"
                  required
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#55675A] block mb-1">
                  Date
                </label>
                <input
                  type="text"
                  value={healthDate}
                  onChange={(e) => setHealthDate(e.target.value)}
                  placeholder="e.g. May 15, 2026"
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-sm text-[#1F2E23] focus:outline-none focus:border-[#2E5B42]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#2E5B42] hover:bg-[#234532] text-white text-sm font-bold shadow-sm transition-all cursor-pointer mt-2"
              >
                Save Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT BASIC PET INFO MODAL                                                 */}
      {/* ========================================================================= */}
      {isEditingInfo && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-xl border border-[#EDE8DE]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-bold text-[#1F2E23]">Edit Pet Info</h3>
              <button
                type="button"
                onClick={() => setIsEditingInfo(false)}
                className="w-7 h-7 rounded-full bg-[#F5F2EB] text-[#718276] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveInfo} className="space-y-3.5">
              <div>
                <label className="text-[12px] font-bold text-[#55675A] block mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-sm text-[#1F2E23] focus:outline-none focus:border-[#2E5B42]"
                  required
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#55675A] block mb-1">
                  Breed
                </label>
                <input
                  type="text"
                  value={editBreed}
                  onChange={(e) => setEditBreed(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-sm text-[#1F2E23] focus:outline-none focus:border-[#2E5B42]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[12px] font-bold text-[#55675A] block mb-1">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    value={editAgeYears}
                    onChange={(e) => setEditAgeYears(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-sm text-[#1F2E23] focus:outline-none focus:border-[#2E5B42]"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-[#55675A] block mb-1">
                    Weight ({pet.weightUnit || 'lbs'})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editWeight}
                    onChange={(e) => setEditWeight(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-sm text-[#1F2E23] focus:outline-none focus:border-[#2E5B42]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#2E5B42] hover:bg-[#234532] text-white text-sm font-bold shadow-sm transition-all cursor-pointer mt-2"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
