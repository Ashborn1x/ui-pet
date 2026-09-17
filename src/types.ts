export type PetSpecies = 'dog' | 'cat' | 'rabbit' | 'bird' | 'other';

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  gender?: 'male' | 'female' | 'unspecified';
  birthDate?: string;
  ageYears: number;
  ageMonths: number;
  weight: number;
  weightUnit: 'lbs' | 'kg';
  avatarUrl: string;
  microchipId?: string;
  dietaryNotes?: string;
  vetName?: string;
  vetPhone?: string;
}

export type CareType = 'meal' | 'water' | 'walk' | 'meds' | 'vet' | 'weight' | 'note';

export interface CareLog {
  id: string;
  petId: string;
  type: CareType;
  title: string;
  detail: string;
  time: string;
  date: string;
  completed: boolean;
}

export interface DailyGoal {
  mealsCount: number;
  mealsDone: number;
  waterDone: boolean;
  walkMinutesTarget: number;
  walkMinutesDone: number;
  medsTaken: boolean;
}
