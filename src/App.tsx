import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PetCareDashboard } from './components/PetCareDashboard';
import { AddPetPage } from './components/AddPetPage';
import { MobileFrame } from './components/MobileFrame';
import { INITIAL_PETS, INITIAL_LOGS } from './data/initialPets';
import { Pet, CareLog } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'add-pet' | 'dashboard'>('welcome');
  const [previousScreen, setPreviousScreen] = useState<'welcome' | 'dashboard'>('welcome');
  const [pets, setPets] = useState<Pet[]>(() => {
    try {
      const saved = localStorage.getItem('petpals_pets_v6');
      if (saved) {
        const parsed = JSON.parse(saved);
        // ensure default fields like activities, dietSchedules, healthRecords exist
        return parsed.map((p: Pet) => {
          const initialMatch = INITIAL_PETS.find((ip) => ip.id === p.id);
          return {
            ...p,
            activities: p.activities || initialMatch?.activities || [],
            dietSchedules: p.dietSchedules || initialMatch?.dietSchedules || [],
            healthRecords: p.healthRecords || initialMatch?.healthRecords || [],
          };
        });
      }
      return INITIAL_PETS;
    } catch {
      return INITIAL_PETS;
    }
  });

  const [selectedPetId, setSelectedPetId] = useState<string>(() => {
    return INITIAL_PETS[0]?.id || 'pet-oliver';
  });

  const [logs, setLogs] = useState<CareLog[]>(() => {
    try {
      const saved = localStorage.getItem('petpals_logs_v6');
      return saved ? JSON.parse(saved) : INITIAL_LOGS;
    } catch {
      return INITIAL_LOGS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('petpals_pets_v6', JSON.stringify(pets));
    } catch {
      // ignore
    }
  }, [pets]);

  useEffect(() => {
    try {
      localStorage.setItem('petpals_logs_v6', JSON.stringify(logs));
    } catch {
      // ignore
    }
  }, [logs]);

  const handleUpdatePet = (updatedPet: Pet) => {
    setPets((prev) => prev.map((p) => (p.id === updatedPet.id ? updatedPet : p)));
  };

  const handleOpenAddPet = (fromScreen: 'welcome' | 'dashboard') => {
    setPreviousScreen(fromScreen);
    setCurrentScreen('add-pet');
  };

  const handleBackFromAddPet = () => {
    setCurrentScreen(previousScreen);
  };

  const handleSkipToDashboard = () => {
    setCurrentScreen('dashboard');
  };

  const handleSavePet = (newPet: Pet) => {
    setPets((prev) => [newPet, ...prev]);
    setSelectedPetId(newPet.id);
    
    // Add default care items for new pet
    const newPetLogs: CareLog[] = [
      {
        id: `log-${Date.now()}-1`,
        petId: newPet.id,
        type: 'meal',
        title: 'Morning Breakfast',
        detail: newPet.dietaryNotes || 'Fresh meal & clean water',
        time: '08:00 AM',
        date: 'Today',
        completed: false,
      },
      {
        id: `log-${Date.now()}-2`,
        petId: newPet.id,
        type: 'water',
        title: 'Hydration Bowl',
        detail: 'Fresh water bowl refill',
        time: '09:00 AM',
        date: 'Today',
        completed: false,
      },
      {
        id: `log-${Date.now()}-3`,
        petId: newPet.id,
        type: 'walk',
        title: newPet.species === 'dog' ? `Walk ${newPet.name}` : `Play & Enrichment Time`,
        detail: newPet.species === 'dog' ? '30 min walk' : '15 min interactive toy play',
        time: '11:00 AM',
        date: 'Today',
        completed: false,
      },
      {
        id: `log-${Date.now()}-4`,
        petId: newPet.id,
        type: 'meal',
        title: 'Evening Dinner',
        detail: 'Scheduled dinner portion',
        time: '06:30 PM',
        date: 'Today',
        completed: false,
      },
    ];

    setLogs((prev) => [...newPetLogs, ...prev]);
    setCurrentScreen('dashboard');
  };

  const handleToggleLog = (logId: string) => {
    setLogs((prev) =>
      prev.map((log) =>
        log.id === logId ? { ...log, completed: !log.completed } : log
      )
    );
  };

  const handleAddNewLog = (newLogData: Omit<CareLog, 'id'>) => {
    const createdLog: CareLog = {
      ...newLogData,
      id: `log-${Date.now()}`,
    };
    setLogs((prev) => [createdLog, ...prev]);
  };

  return (
    <MobileFrame>
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          onAddPet={() => handleOpenAddPet('welcome')}
          onSkip={handleSkipToDashboard}
        />
      )}

      {currentScreen === 'add-pet' && (
        <AddPetPage
          onBack={handleBackFromAddPet}
          onSave={handleSavePet}
        />
      )}

      {currentScreen === 'dashboard' && (
        <PetCareDashboard
          pets={pets}
          selectedPetId={selectedPetId}
          onSelectPet={(id) => setSelectedPetId(id)}
          onOpenAddPet={() => handleOpenAddPet('dashboard')}
          onReturnToWelcome={() => setCurrentScreen('welcome')}
          logs={logs}
          onToggleLog={handleToggleLog}
          onAddLog={handleAddNewLog}
          onUpdatePet={handleUpdatePet}
        />
      )}
    </MobileFrame>
  );
}
