import { Pet, CareLog } from '../types';

export const DEFAULT_AVATARS = [
  {
    id: 'clay-dog',
    name: 'Clay Golden Pup',
    url: '/src/assets/images/clay_pet_care_simple_1789625871275.jpg',
  },
  {
    id: 'clay-wellness-pup',
    name: 'Wellness Pup',
    url: '/src/assets/images/clay_pet_wellness_1789625894177.jpg',
  },
  {
    id: 'clay-duo',
    name: 'Clay Pup & Kitten',
    url: '/src/assets/images/clay_cat_daily_routine_1789625909416.jpg',
  },
  {
    id: 'dog-hero',
    name: 'Puppy',
    url: '/src/assets/images/cartoon_dog_avatar_1789624318697.jpg',
  },
  {
    id: 'cat-hero',
    name: 'Kitten',
    url: '/src/assets/images/cartoon_cat_avatar_1789624329620.jpg',
  },
  {
    id: 'clay-bunny',
    name: 'Bunny',
    url: '/src/assets/images/clay_bunny_avatar_1789626440507.jpg',
  }
];

export const INITIAL_PETS: Pet[] = [
  {
    id: 'pet-1',
    name: 'Oliver',
    species: 'dog',
    breed: 'Golden Retriever Mix',
    ageYears: 2,
    ageMonths: 4,
    weight: 28.5,
    weightUnit: 'lbs',
    avatarUrl: '/src/assets/images/cartoon_dog_avatar_1789624318697.jpg',
    dietaryNotes: '1 cup salmon kibble twice daily. Sensitive tummy.',
    vetName: 'Dr. Katherine Wells (Sage Hill Vet)',
    vetPhone: '(555) 382-9012',
  },
  {
    id: 'pet-2',
    name: 'Luna',
    species: 'cat',
    breed: 'Calico Shorthair',
    ageYears: 1,
    ageMonths: 8,
    weight: 8.2,
    weightUnit: 'lbs',
    avatarUrl: '/src/assets/images/cartoon_cat_avatar_1789624329620.jpg',
    dietaryNotes: 'Wet food in the morning, dry crunchies in evening.',
    vetName: 'Dr. Katherine Wells (Sage Hill Vet)',
    vetPhone: '(555) 382-9012',
  }
];

export const INITIAL_LOGS: CareLog[] = [
  {
    id: 'log-1',
    petId: 'pet-1',
    type: 'meal',
    title: 'Morning Breakfast',
    detail: '1 cup Salmon & Sweet Potato kibble',
    time: '08:15 AM',
    date: 'Today',
    completed: true,
  },
  {
    id: 'log-2',
    petId: 'pet-1',
    type: 'water',
    title: 'Water Refill',
    detail: 'Fresh filtered bowl with ice cubes',
    time: '09:00 AM',
    date: 'Today',
    completed: true,
  },
  {
    id: 'log-3',
    petId: 'pet-1',
    type: 'walk',
    title: 'Neighborhood Stroll',
    detail: '35 minutes around the park',
    time: '10:30 AM',
    date: 'Today',
    completed: true,
  },
  {
    id: 'log-4',
    petId: 'pet-1',
    type: 'meds',
    title: 'Daily Omega-3 Chew',
    detail: 'Coat & Joint supplement chewable',
    time: '01:00 PM',
    date: 'Today',
    completed: false,
  },
  {
    id: 'log-5',
    petId: 'pet-1',
    type: 'meal',
    title: 'Evening Dinner',
    detail: '1 cup kibble + warm bone broth',
    time: '06:30 PM',
    date: 'Today',
    completed: false,
  }
];
