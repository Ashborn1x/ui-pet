import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Check, 
  Dog, 
  Cat, 
  Rabbit, 
  Bird, 
  Sparkles, 
  Camera, 
  Upload, 
  Calendar,
  Bone,
  PawPrint,
  ChevronDown,
  Venus,
  Mars,
  Weight as WeightIcon,
  Stethoscope
} from 'lucide-react';
import { Pet, PetSpecies } from '../types';
import { DEFAULT_AVATARS } from '../data/initialPets';

interface AddPetPageProps {
  onBack: () => void;
  onSave: (pet: Pet) => void;
}

export const AddPetPage: React.FC<AddPetPageProps> = ({
  onBack,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('dog');
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [birthDate, setBirthDate] = useState<string>('2025-04-09');
  const [breed, setBreed] = useState('Labrador');
  const [weight, setWeight] = useState<number>(24);
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
  const [avatarUrl, setAvatarUrl] = useState<string>(DEFAULT_AVATARS[0].url);
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [vetName, setVetName] = useState('');
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Format YYYY-MM-DD to MM/DD/YYYY as seen in screenshot
  const formatDisplayDate = (isoDate: string) => {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      return `${m}/${d}/${y}`;
    }
    return isoDate;
  };

  // Calculate age from birthDate
  const calculateAge = (dob: string): { years: number; months: number } => {
    if (!dob) return { years: 1, months: 0 };
    const birth = new Date(dob);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    return { 
      years: Math.max(0, years), 
      months: Math.max(0, months) 
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const { years, months } = calculateAge(birthDate);

    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      name: name.trim(),
      species,
      breed: breed.trim() || (species === 'dog' ? 'Labrador' : species === 'cat' ? 'Domestic Shorthair' : 'Companion Pet'),
      gender,
      birthDate: birthDate || undefined,
      ageYears: years,
      ageMonths: months,
      weight: Number(weight) || 10,
      weightUnit,
      avatarUrl,
      dietaryNotes: dietaryNotes.trim() || undefined,
      vetName: vetName.trim() || undefined,
    };

    onSave(newPet);
  };

  const speciesList: { key: PetSpecies; label: string; icon: React.ReactNode; defaultAvatar: string; addLabel: string }[] = [
    { key: 'dog', label: 'Dog', icon: <Dog className="w-4 h-4" />, defaultAvatar: DEFAULT_AVATARS[0].url, addLabel: 'Add Puppy' },
    { key: 'cat', label: 'Cat', icon: <Cat className="w-4 h-4" />, defaultAvatar: DEFAULT_AVATARS[4].url, addLabel: 'Add Kitten' },
    { key: 'rabbit', label: 'Rabbit', icon: <Rabbit className="w-4 h-4" />, defaultAvatar: DEFAULT_AVATARS[5]?.url || DEFAULT_AVATARS[0].url, addLabel: 'Add Bunny' },
    { key: 'bird', label: 'Bird', icon: <Bird className="w-4 h-4" />, defaultAvatar: DEFAULT_AVATARS[2].url, addLabel: 'Add Bird' },
    { key: 'other', label: 'Other', icon: <Sparkles className="w-4 h-4" />, defaultAvatar: DEFAULT_AVATARS[1].url, addLabel: 'Add Pet' },
  ];

  const currentSpeciesConfig = speciesList.find((s) => s.key === species) || speciesList[0];
  const submitButtonText = currentSpeciesConfig.addLabel;

  return (
    <div
      id="add-pet-page-root"
      className="flex flex-col w-full h-full min-h-[640px] bg-[#F7F5EE] text-[#222E26] overflow-y-auto select-none"
    >
      {/* Mobile Top App Bar */}
      <header
        id="add-pet-header"
        className="sticky top-0 z-30 bg-[#FAF8F2]/95 backdrop-blur-md px-5 pt-3 pb-3 border-b border-[#E7E3D8] flex items-center justify-between"
      >
        <button
          id="add-pet-back-btn"
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-2xl bg-white border border-[#E0DBD0] shadow-xs flex items-center justify-center text-[#475A4D] hover:text-[#1E2B21] transition-all cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className="text-center">
          <h1 id="add-pet-page-title" className="text-[15px] font-extrabold text-[#202E24] tracking-tight">
            Add Pet
          </h1>
          <p className="text-[11px] font-semibold text-[#5B7163]">New Companion</p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="text-xs font-bold text-[#6D8073] hover:text-[#202E24] px-2 py-1 transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </header>

      {/* Main Page Scrollable Form Area */}
      <main className="flex-1 p-5 space-y-5 pb-28">
        {/* Avatar Showcase & Selector Card (Retaining the theme and 3D pet avatars) */}
        <section
          id="avatar-selection-card"
          className="clay-card rounded-3xl p-4 flex flex-col items-center text-center relative"
        >
          {/* Selected Preview with Camera Upload Button */}
          <div className="relative mb-2.5">
            <div className="w-22 h-22 rounded-3xl overflow-hidden border-3 border-[#557A63] shadow-[0_10px_20px_-4px_rgba(65,99,78,0.25),inset_0_2px_2px_rgba(255,255,255,0.6)] bg-white">
              <img
                src={avatarUrl}
                alt="Pet preview avatar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload custom photo"
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#557A63] text-white border-2 border-white flex items-center justify-center shadow-md hover:bg-[#466652] transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          <p className="text-xs font-bold text-[#35473B] mb-0.5">
            {name ? name : 'Choose an avatar'}
          </p>
          <p className="text-[11px] text-[#718578] mb-2.5">
            Select 3D style or upload your pet’s photo
          </p>

          {/* Horizontal Avatar Presets */}
          <div className="w-full flex items-center justify-center space-x-2 overflow-x-auto py-1">
            {DEFAULT_AVATARS.map((av) => {
              const isSelected = avatarUrl === av.url;
              return (
                <button
                  type="button"
                  key={av.id}
                  onClick={() => setAvatarUrl(av.url)}
                  className={`relative w-11 h-11 rounded-2xl overflow-hidden p-0.5 border-2 transition-all cursor-pointer flex-shrink-0 ${
                    isSelected
                      ? 'border-[#557A63] scale-105 shadow-[0_4px_10px_rgba(65,99,78,0.28)]'
                      : 'border-[#E0DBD0] opacity-75 hover:opacity-100 hover:border-[#557A63]/50'
                  }`}
                >
                  <img
                    src={av.url}
                    alt={av.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#557A63]/25 flex items-center justify-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#557A63] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-2 h-2 stroke-[3]" />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-11 h-11 rounded-2xl border-2 border-dashed border-[#CFC9BA] hover:border-[#557A63] bg-[#F3F0E6] flex flex-col items-center justify-center text-[#687C70] hover:text-[#557A63] transition-colors cursor-pointer flex-shrink-0"
              title="Upload Photo"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="text-[8px] font-bold mt-0.5">Custom</span>
            </button>
          </div>
        </section>

        {/* Species / Pet Type Selector Pills */}
        <section id="pet-species-section" className="space-y-1.5">
          <label className="block text-[13px] font-bold text-[#2A3B30] tracking-tight">
            Pet Type
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {speciesList.map((item) => {
              const isSelected = species === item.key;
              return (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => {
                    setSpecies(item.key);
                    setAvatarUrl(item.defaultAvatar);
                  }}
                  className={`py-2 px-1 rounded-2xl text-center flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'clay-pill-active font-bold shadow-sm scale-[1.02]'
                      : 'clay-pill text-[#536559] hover:bg-[#EFECE3]'
                  }`}
                >
                  {item.icon}
                  <span className="text-[11px] leading-tight font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Form Fields Styled Exactly to Reference Mockup */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field 1: Pet Name */}
          <div id="field-pet-name">
            <label
              htmlFor="input-pet-name"
              className="block text-[13px] font-bold text-[#2A3B30] tracking-tight mb-1.5"
            >
              Name <span className="text-[#C86448]">*</span>
            </label>
            <div className="relative flex items-center w-full rounded-2xl bg-white border border-[#DCD6C8] shadow-[0_2px_6px_rgba(40,55,45,0.03),inset_0_1.5px_2px_rgba(0,0,0,0.02)] focus-within:border-[#557A63] focus-within:ring-2 focus-within:ring-[#557A63]/20 transition-all">
              <div className="pl-4 pr-3 text-[#557A63] flex items-center justify-center">
                <PawPrint className="w-5 h-5 stroke-[2]" />
              </div>
              <input
                id="input-pet-name"
                type="text"
                required
                placeholder="e.g. Milo, Bella, Charlie"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-3.5 pr-4 bg-transparent text-[#202E24] text-[15px] font-medium placeholder-[#9CA9A0] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Field 2: Gender (Matching Reference Image) */}
          <div id="field-pet-gender" className="relative">
            <label className="block text-[13px] font-bold text-[#2A3B30] tracking-tight mb-1.5">
              Gender
            </label>

            {/* Pill Container Matching Reference */}
            <div
              onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
              className="relative flex items-center justify-between w-full py-3.5 px-4 rounded-2xl bg-white border border-[#DCD6C8] shadow-[0_2px_6px_rgba(40,55,45,0.03),inset_0_1.5px_2px_rgba(0,0,0,0.02)] cursor-pointer hover:border-[#557A63]/60 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="text-[#557A63] flex items-center justify-center">
                  {gender === 'female' ? (
                    <Venus className="w-5 h-5 stroke-[2.2]" />
                  ) : (
                    <Mars className="w-5 h-5 stroke-[2.2]" />
                  )}
                </div>
                <span className="text-[15px] font-medium text-[#202E24] capitalize">
                  {gender === 'female' ? 'Female' : 'Male'}
                </span>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-[#7A8C80] transition-transform duration-200 ${
                  isGenderDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </div>

            {/* Gender Selection Dropdown Popover */}
            {isGenderDropdownOpen && (
              <div
                id="gender-dropdown-menu"
                className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white rounded-2xl border border-[#DCD6C8] shadow-lg p-1.5 space-y-1"
              >
                <button
                  type="button"
                  onClick={() => {
                    setGender('female');
                    setIsGenderDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left cursor-pointer transition-colors ${
                    gender === 'female'
                      ? 'bg-[#EBF2ED] text-[#223026] font-bold'
                      : 'text-[#485B4E] hover:bg-[#F6F4ED]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Venus className="w-4 h-4 text-[#557A63]" />
                    <span className="text-sm">Female</span>
                  </div>
                  {gender === 'female' && <Check className="w-4 h-4 text-[#557A63]" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGender('male');
                    setIsGenderDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left cursor-pointer transition-colors ${
                    gender === 'male'
                      ? 'bg-[#EBF2ED] text-[#223026] font-bold'
                      : 'text-[#485B4E] hover:bg-[#F6F4ED]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Mars className="w-4 h-4 text-[#557A63]" />
                    <span className="text-sm">Male</span>
                  </div>
                  {gender === 'male' && <Check className="w-4 h-4 text-[#557A63]" />}
                </button>
              </div>
            )}
          </div>

          {/* Field 3: Date of birth (optional) (Matching Reference Image) */}
          <div id="field-pet-dob">
            <label
              htmlFor="input-pet-dob"
              className="block text-[13px] font-bold text-[#2A3B30] tracking-tight mb-1.5"
            >
              Date of birth (optional)
            </label>

            {/* Pill Container with Calendar Icon and Formatted Date */}
            <div
              onClick={() => {
                if (dateInputRef.current) {
                  try {
                    dateInputRef.current.showPicker();
                  } catch {
                    dateInputRef.current.focus();
                  }
                }
              }}
              className="relative flex items-center justify-between w-full py-3.5 px-4 rounded-2xl bg-white border border-[#DCD6C8] shadow-[0_2px_6px_rgba(40,55,45,0.03),inset_0_1.5px_2px_rgba(0,0,0,0.02)] cursor-pointer hover:border-[#557A63]/60 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="text-[#557A63] flex items-center justify-center">
                  <Calendar className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[15px] font-medium text-[#202E24]">
                  {birthDate ? formatDisplayDate(birthDate) : 'MM/DD/YYYY'}
                </span>
              </div>

              <ChevronDown className="w-4 h-4 text-[#7A8C80]" />

              {/* Native Date Picker Hidden Trigger */}
              <input
                ref={dateInputRef}
                id="input-pet-dob"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
          </div>

          {/* Field 4: Breed (Matching Reference Image with Bone Icon) */}
          <div id="field-pet-breed">
            <label
              htmlFor="input-pet-breed"
              className="block text-[13px] font-bold text-[#2A3B30] tracking-tight mb-1.5"
            >
              Breed
            </label>
            <div className="relative flex items-center w-full rounded-2xl bg-white border border-[#DCD6C8] shadow-[0_2px_6px_rgba(40,55,45,0.03),inset_0_1.5px_2px_rgba(0,0,0,0.02)] focus-within:border-[#557A63] focus-within:ring-2 focus-within:ring-[#557A63]/20 transition-all">
              <div className="pl-4 pr-3 text-[#557A63] flex items-center justify-center">
                <Bone className="w-5 h-5 stroke-[2]" />
              </div>
              <input
                id="input-pet-breed"
                type="text"
                placeholder="e.g. Labrador, Golden Retriever"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full py-3.5 pr-4 bg-transparent text-[#202E24] text-[15px] font-medium placeholder-[#9CA9A0] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Field 5: Weight (Pill style matching theme) */}
          <div id="field-pet-weight">
            <label className="block text-[13px] font-bold text-[#2A3B30] tracking-tight mb-1.5">
              Weight
            </label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 flex items-center rounded-2xl bg-white border border-[#DCD6C8] shadow-[0_2px_6px_rgba(40,55,45,0.03),inset_0_1.5px_2px_rgba(0,0,0,0.02)] focus-within:border-[#557A63]">
                <div className="pl-4 pr-3 text-[#557A63] flex items-center justify-center">
                  <WeightIcon className="w-5 h-5 stroke-[2]" />
                </div>
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  value={weight}
                  onChange={(e) => setWeight(Math.max(0.1, Number(e.target.value)))}
                  className="w-full py-3.5 pr-4 bg-transparent text-[#202E24] text-[15px] font-bold focus:outline-hidden"
                />
              </div>

              {/* Unit Toggle Pill */}
              <div className="flex bg-[#EFECE3] p-1 rounded-2xl border border-[#DCD6C8]">
                <button
                  type="button"
                  onClick={() => setWeightUnit('lbs')}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    weightUnit === 'lbs' ? 'bg-white text-[#202E24] shadow-xs' : 'text-[#617467]'
                  }`}
                >
                  lbs
                </button>
                <button
                  type="button"
                  onClick={() => setWeightUnit('kg')}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    weightUnit === 'kg' ? 'bg-white text-[#202E24] shadow-xs' : 'text-[#617467]'
                  }`}
                >
                  kg
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Optional Details (Vet / Notes) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowOptionalDetails(!showOptionalDetails)}
              className="text-xs font-bold text-[#557A63] hover:text-[#385542] flex items-center space-x-1.5 cursor-pointer py-1"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>{showOptionalDetails ? 'Hide Vet & Diet Notes' : '+ Add Vet & Diet Notes (Optional)'}</span>
            </button>

            {showOptionalDetails && (
              <div className="mt-3 p-4 rounded-2xl bg-white border border-[#DCD6C8] space-y-3 shadow-xs">
                <div>
                  <label htmlFor="input-vet-name" className="block text-xs font-bold text-[#44574A] mb-1">
                    Primary Vet / Clinic
                  </label>
                  <input
                    id="input-vet-name"
                    type="text"
                    placeholder="e.g. Dr. Wells · Sage Hill Vet"
                    value={vetName}
                    onChange={(e) => setVetName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F3] border border-[#DDD8CB] text-xs text-[#202E24] focus:outline-hidden focus:border-[#557A63]"
                  />
                </div>

                <div>
                  <label htmlFor="input-diet-notes" className="block text-xs font-bold text-[#44574A] mb-1">
                    Feeding Habits or Food Sensitivity
                  </label>
                  <textarea
                    id="input-diet-notes"
                    rows={2}
                    placeholder="e.g. 1 cup salmon kibble twice daily"
                    value={dietaryNotes}
                    onChange={(e) => setDietaryNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F3] border border-[#DDD8CB] text-xs text-[#202E24] focus:outline-hidden focus:border-[#557A63]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button Matching Screenshot Pill ("Add Puppy" / "Add Kitten" / "Add Pet") */}
          <div className="pt-3">
            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 rounded-full clay-btn-primary font-bold text-[16px] flex items-center justify-center space-x-2 cursor-pointer shadow-[0_8px_20px_-3px_rgba(65,99,78,0.36)]"
            >
              <span>{submitButtonText}</span>
            </motion.button>
          </div>
        </form>
      </main>
    </div>
  );
};
