export type PetSpecies = 'dog' | 'cat' | 'rabbit' | 'bird' | 'other';

export interface ScheduledActivity {
  id: string;
  petId: string;
  title: string;
  time: string;
  frequency: string;
  notify: boolean;
  notes?: string;
  completedToday?: boolean;
}

export interface DietSchedule {
  id: string;
  petId: string;
  title: string;
  time: string;
  portion: string;
  frequency: string;
  notify: boolean;
  notes?: string;
  fedToday?: boolean;
}

export interface HealthRecord {
  id: string;
  petId: string;
  type: 'vaccine' | 'checkup' | 'treatment' | 'dental' | 'surgery' | 'lab';
  title: string;
  date: string;
  provider?: string;
  batchNumber?: string;
  status: 'Completed' | 'Up to date' | 'Due Soon';
  notes?: string;
}

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
  activities?: ScheduledActivity[];
  dietSchedules?: DietSchedule[];
  healthRecords?: HealthRecord[];
  photos?: string[];
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
