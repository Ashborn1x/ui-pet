import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Camera, 
  PawPrint, 
  ChevronDown, 
  Check,
  Dog,
  Cat,
  Rabbit,
  Bird,
  Sparkles,
  Weight as WeightIcon,
  Bone
} from 'lucide-react';
import { Pet, PetSpecies } from '../types';

interface AddPetPageProps {
  onBack: () => void;
  onSave: (pet: Pet) => void;
}

const COMMON_BREEDS: Record<PetSpecies, string[]> = {
  dog: [
    'Golden Retriever',
    'Labrador Retriever',
    'French Bulldog',
    'German Shepherd',
    'Poodle',
    'Beagle',
    'Corgi',
    'Dachshund',
    'Mixed Dog'
  ],
  cat: [
    'Domestic Shorthair',
    'Calico',
    'Persian',
    'Maine Coon',
    'Siamese',
    'Ragdoll',
    'Bengal',
    'British Shorthair'
  ],
  rabbit: [
    'Holland Lop',
    'Netherland Dwarf',
    'Mini Rex',
    'Lionhead',
    'Flemish Giant'
  ],
  bird: [
    'Parakeet / Budgie',
    'Cockatiel',
    'Canary',
    'Lovebird',
    'Conure'
  ],
  other: [
    'Hamster',
    'Guinea Pig',
    'Ferret',
    'Hedgehog',
    'Other Companion'
  ]
};

export const AddPetPage: React.FC<AddPetPageProps> = ({
  onBack,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('dog');
  const [breed, setBreed] = useState('Golden Retriever');
  const [weightValue, setWeightValue] = useState('24');
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
  const [avatarUrl, setAvatarUrl] = useState<string>(
    '/src/assets/images/golden_retriever_photo_1789664976220.jpg'
  );

  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isBreedDropdownOpen, setIsBreedDropdownOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSelectSpecies = (selected: PetSpecies) => {
    setSpecies(selected);
    setIsTypeDropdownOpen(false);
    // Suggest first common breed for that species
    if (COMMON_BREEDS[selected] && COMMON_BREEDS[selected].length > 0) {
      setBreed(COMMON_BREEDS[selected][0]);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your pet’s name');
      return;
    }

    const parsedWeight = parseFloat(weightValue) || 10;

    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      name: name.trim(),
      species,
      breed: breed.trim() || (species === 'dog' ? 'Golden Retriever' : 'Companion Pet'),
      ageYears: 2,
      ageMonths: 0,
      weight: parsedWeight,
      weightUnit,
      avatarUrl,
    };

    onSave(newPet);
  };

  const getSpeciesDisplayName = (s: PetSpecies) => {
    switch (s) {
      case 'dog': return 'Dog';
      case 'cat': return 'Cat';
      case 'rabbit': return 'Rabbit';
      case 'bird': return 'Bird';
      case 'other': return 'Other';
    }
  };

  const getSpeciesIcon = (s: PetSpecies) => {
    switch (s) {
      case 'dog': return <Dog className="w-5 h-5" />;
      case 'cat': return <Cat className="w-5 h-5" />;
      case 'rabbit': return <Rabbit className="w-5 h-5" />;
      case 'bird': return <Bird className="w-5 h-5" />;
      case 'other': return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div
      id="add-pet-screen"
      className="flex flex-col justify-between w-full h-full min-h-[640px] bg-[#F7F4EC] text-[#1F2E23] overflow-y-auto select-none px-6 pt-3 pb-5"
    >
      {/* Hidden File Input for Custom Photo Upload */}
      <input
        ref={fileInputRef}
        id="pet-photo-file-input"
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      <div className="w-full">
        {/* Top iOS Style Status Bar Indicator */}
        <div
          id="status-bar-area"
          className="flex items-center justify-between text-[#1F2E23] text-xs font-semibold py-1 mb-2"
        >
          <span className="font-bold text-[14px]">9:41</span>
          <div className="flex items-center space-x-1.5 opacity-80">
            {/* Cell Bars */}
            <div className="flex items-end space-x-0.5 h-3">
              <span className="w-0.5 h-1 bg-[#1F2E23] rounded-full" />
              <span className="w-0.5 h-1.5 bg-[#1F2E23] rounded-full" />
              <span className="w-0.5 h-2 bg-[#1F2E23] rounded-full" />
              <span className="w-0.5 h-2.5 bg-[#1F2E23] rounded-full" />
            </div>
            {/* Wifi Icon */}
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 4c4.08 0 7.78 1.66 10.46 4.35l-2.12 2.12C18.17 8.3 15.25 7 12 7s-6.17 1.3-8.34 3.47L1.54 8.35C4.22 5.66 7.92 4 12 4zm0 6c2.58 0 4.93 1.05 6.64 2.76l-2.12 2.12A6.48 6.48 0 0012 13c-1.8 0-3.43.73-4.52 1.88l-2.12-2.12C7.07 11.05 9.42 10 12 10zm0 6c1.1 0 2.05.45 2.83 1.17L12 20.35l-2.83-3.18C9.95 16.45 10.9 16 12 16z" />
            </svg>
            {/* Battery Icon */}
            <div className="w-5 h-2.5 rounded-sm border border-[#1F2E23] p-0.5 flex items-center">
              <div className="w-full h-full bg-[#1F2E23] rounded-xs" />
            </div>
          </div>
        </div>

        {/* Circular Back Button Matching Mockup */}
        <button
          id="add-pet-back-button"
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="w-10 h-10 rounded-full bg-[#EAE5DA] hover:bg-[#DFD9CD] text-[#2C3B30] flex items-center justify-center transition-colors cursor-pointer shadow-xs mt-1"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Header Title & Subtitle Matching Mockup */}
        <div className="mt-4 mb-5">
          <h1
            id="add-pet-headline"
            className="text-[28px] sm:text-[30px] font-extrabold text-[#1F2E23] tracking-tight leading-[1.15]"
          >
            Add a Pet
          </h1>
          <p className="text-[14px] text-[#718276] leading-snug font-normal mt-1.5">
            Tell us a little about your pet.<br />
            We’ll take care of the rest.
          </p>
        </div>

        {/* Pet Photo Card Matching Reference Mockup */}
        <section
          id="add-pet-photo-card"
          aria-label="Pet photo section"
          className="w-full rounded-[28px] bg-[#FAF8F3] p-4 flex items-center justify-between border border-[#EDE8DE] shadow-[0_4px_20px_rgba(40,55,45,0.03)]"
        >
          {/* Left: Add Photo Circular Action */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-22 h-22 rounded-full bg-[#E4ECE7] hover:bg-[#D9E4DD] active:scale-95 transition-all flex flex-col items-center justify-center text-[#557A63] cursor-pointer shadow-xs"
            title="Upload custom photo"
          >
            <Camera className="w-6 h-6 stroke-[1.8] text-[#557A63]" />
            <span className="text-[11.5px] font-medium text-[#557A63] mt-1 tracking-tight">
              Add Photo
            </span>
          </button>

          {/* Right: Golden Retriever / Pet Photo Display */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-38 sm:w-44 h-26 rounded-[20px] overflow-hidden bg-[#ECE8DC] shadow-xs cursor-pointer border border-[#EDE8DE] group"
            title="Click to change photo"
          >
            <img
              id="selected-pet-photo"
              src={avatarUrl}
              alt="Pet preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[11px] font-bold text-white bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs">
                Change
              </span>
            </div>
          </div>
        </section>

        {/* Input Details Container Card (Unified List with 4 Rows) */}
        <section
          id="add-pet-fields-card"
          className="mt-4 rounded-[28px] bg-[#FAF8F3] border border-[#EDE8DE] divide-y divide-[#EDE8DE]/85 shadow-[0_4px_20px_rgba(40,55,45,0.03)] overflow-hidden"
        >
          {/* Row 1: Name */}
          <div id="form-row-name" className="p-3.5 sm:p-4 flex items-center space-x-3.5">
            {/* Green Badge with Paw Icon */}
            <div className="w-11 h-11 rounded-full bg-[#E4ECE7] text-[#557A63] flex items-center justify-center flex-shrink-0">
              <PawPrint className="w-5 h-5 stroke-[2]" />
            </div>

            <div className="flex-1 min-w-0">
              <label
                htmlFor="pet-name-input"
                className="block text-[13px] font-bold text-[#1F2E23] leading-none mb-1 cursor-text"
              >
                Name
              </label>
              <input
                id="pet-name-input"
                type="text"
                placeholder="Enter your pet’s name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                className="w-full bg-transparent text-[14px] text-[#1F2E23] placeholder-[#A0B0A5] focus:outline-hidden font-normal"
              />
            </div>
          </div>

          {/* Row 2: Type (Interactive Selector) */}
          <div id="form-row-type" className="relative">
            <div
              onClick={() => {
                setIsTypeDropdownOpen(!isTypeDropdownOpen);
                setIsBreedDropdownOpen(false);
              }}
              className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer hover:bg-[#F5F2EA]/60 transition-colors"
            >
              <div className="flex items-center space-x-3.5 min-w-0">
                {/* Tan/Apricot Badge with Dog / Species Icon */}
                <div className="w-11 h-11 rounded-full bg-[#F2E5D5] text-[#A67140] flex items-center justify-center flex-shrink-0">
                  {getSpeciesIcon(species)}
                </div>

                <div className="min-w-0">
                  <span className="block text-[13px] font-bold text-[#1F2E23] leading-none mb-1">
                    Type
                  </span>
                  <span className="block text-[14px] text-[#1F2E23] font-normal truncate">
                    {getSpeciesDisplayName(species)}
                  </span>
                </div>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-[#8C9C90] transition-transform duration-200 ${
                  isTypeDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </div>

            {/* Inline Animated Dropdown for Pet Type */}
            <AnimatePresence>
              {isTypeDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#F4F0E6] px-3.5 py-2.5 border-t border-[#EDE8DE] grid grid-cols-2 gap-1.5"
                >
                  {(['dog', 'cat', 'rabbit', 'bird', 'other'] as PetSpecies[]).map((sp) => {
                    const isSelected = species === sp;
                    return (
                      <button
                        type="button"
                        key={sp}
                        onClick={() => handleSelectSpecies(sp)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#627C6B] text-white shadow-xs'
                            : 'bg-white/80 text-[#304135] hover:bg-white'
                        }`}
                      >
                        <span className={isSelected ? 'text-white' : 'text-[#627C6B]'}>
                          {getSpeciesIcon(sp)}
                        </span>
                        <span className="capitalize">{getSpeciesDisplayName(sp)}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Row 3: Breed (Interactive Selector / Input) */}
          <div id="form-row-breed" className="relative">
            <div
              onClick={() => {
                setIsBreedDropdownOpen(!isBreedDropdownOpen);
                setIsTypeDropdownOpen(false);
              }}
              className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer hover:bg-[#F5F2EA]/60 transition-colors"
            >
              <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                {/* Coral/Peach Badge with Cute Bear/Dog Face / Bone Icon */}
                <div className="w-11 h-11 rounded-full bg-[#F8DFD7] text-[#C46A55] flex items-center justify-center flex-shrink-0">
                  <Bone className="w-5 h-5 stroke-[2]" />
                </div>

                <div className="min-w-0 flex-1 pr-2">
                  <span className="block text-[13px] font-bold text-[#1F2E23] leading-none mb-1">
                    Breed
                  </span>
                  <input
                    id="pet-breed-input"
                    type="text"
                    placeholder="Select breed"
                    value={breed}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setBreed(e.target.value)}
                    className="w-full bg-transparent text-[14px] text-[#1F2E23] placeholder-[#A0B0A5] focus:outline-hidden font-normal"
                  />
                </div>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-[#8C9C90] transition-transform duration-200 ${
                  isBreedDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </div>

            {/* Quick Popular Breed Suggestion Dropdown */}
            <AnimatePresence>
              {isBreedDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#F4F0E6] px-3.5 py-2.5 border-t border-[#EDE8DE] max-h-48 overflow-y-auto space-y-1"
                >
                  <p className="text-[10px] uppercase font-bold text-[#7D8F82] tracking-wider mb-1 px-1">
                    Popular {getSpeciesDisplayName(species)} Breeds
                  </p>
                  <div className="grid grid-cols-1 gap-1">
                    {(COMMON_BREEDS[species] || COMMON_BREEDS.dog).map((b) => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => {
                          setBreed(b);
                          setIsBreedDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition-colors cursor-pointer ${
                          breed === b
                            ? 'bg-[#627C6B] text-white'
                            : 'bg-white/80 text-[#304135] hover:bg-white'
                        }`}
                      >
                        <span>{b}</span>
                        {breed === b && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Row 4: Weight */}
          <div id="form-row-weight" className="p-3.5 sm:p-4 flex items-center space-x-3.5">
            {/* Green Badge with Weight / Food Bag Icon */}
            <div className="w-11 h-11 rounded-full bg-[#E4ECE7] text-[#557A63] flex items-center justify-center flex-shrink-0">
              <WeightIcon className="w-5 h-5 stroke-[2]" />
            </div>

            <div className="flex-1 min-w-0">
              <label
                htmlFor="pet-weight-input"
                className="block text-[13px] font-bold text-[#1F2E23] leading-none mb-1 cursor-text"
              >
                Weight
              </label>
              <div className="flex items-center">
                <input
                  id="pet-weight-input"
                  type="text"
                  placeholder="Enter weight (kg or lbs)"
                  value={weightValue}
                  onChange={(e) => setWeightValue(e.target.value.replace(/[^0.5-9.]/g, ''))}
                  className="w-full bg-transparent text-[14px] text-[#1F2E23] placeholder-[#A0B0A5] focus:outline-hidden font-normal"
                />
              </div>
            </div>

            {/* Quick unit pill toggle */}
            <div className="flex bg-[#EAE4D7] p-0.5 rounded-full border border-[#DDD6C8] text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setWeightUnit('lbs')}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  weightUnit === 'lbs'
                    ? 'bg-white text-[#1F2E23] shadow-2xs'
                    : 'text-[#6C7E72] hover:text-[#1F2E23]'
                }`}
              >
                lbs
              </button>
              <button
                type="button"
                onClick={() => setWeightUnit('kg')}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  weightUnit === 'kg'
                    ? 'bg-white text-[#1F2E23] shadow-2xs'
                    : 'text-[#6C7E72] hover:text-[#1F2E23]'
                }`}
              >
                kg
              </button>
            </div>
          </div>
        </section>

        {/* Validation Error Message if any */}
        {errorMsg && (
          <p className="text-center text-xs font-semibold text-[#B9553E] mt-2">
            {errorMsg}
          </p>
        )}
      </div>

      {/* Bottom Sticky Action Area: Save & Cancel & Home Bar */}
      <div id="add-pet-bottom-actions" className="w-full pt-6 flex flex-col items-center">
        {/* Save Button Matching Reference Mockup */}
        <motion.button
          id="add-pet-save-btn"
          type="button"
          whileTap={{ scale: 0.985 }}
          onClick={() => handleSubmit()}
          className="w-full py-4 rounded-full bg-[#627C6B] hover:bg-[#556D5D] text-white font-bold text-[16px] shadow-[0_6px_20px_rgba(98,124,107,0.28)] transition-all cursor-pointer text-center"
        >
          Save
        </motion.button>

        {/* Cancel Button Matching Reference Mockup */}
        <button
          id="add-pet-cancel-btn"
          type="button"
          onClick={onBack}
          className="text-[14px] font-medium text-[#65776C] hover:text-[#1F2E23] pt-3 pb-1.5 transition-colors cursor-pointer text-center"
        >
          Cancel
        </button>

        {/* iOS Home Indicator Bar */}
        <div className="w-32 h-1 bg-[#D0C9BA] rounded-full mt-2" />
      </div>
    </div>
  );
};
