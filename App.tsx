import React, { useState, useEffect, useCallback } from 'react';
import { Workout } from './types';
import Header from './components/Header';
import HistoryPage from './pages/HistoryPage';
import LogWorkoutPage from './pages/LogWorkoutPage';

type Page = 'history' | 'log';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('history');
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    try {
      const savedWorkouts = localStorage.getItem('morse-workouts');
      return savedWorkouts ? JSON.parse(savedWorkouts) : [];
    } catch (error) {
      console.error("Failed to parse workouts from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('morse-workouts', JSON.stringify(workouts));
    } catch (error) {
      console.error("Failed to save workouts to localStorage", error);
    }
  }, [workouts]);

  const handleNavigate = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const handleSaveWorkout = useCallback(() => {
    if (currentWorkout) {
      setWorkouts(prevWorkouts => [currentWorkout, ...prevWorkouts]);
      setCurrentWorkout(null); // Clear the current workout after saving
      setCurrentPage('history');
    }
  }, [currentWorkout]);

  const handleUpdateWorkout = useCallback((updatedWorkout: Workout) => {
    setWorkouts(prevWorkouts => 
      prevWorkouts.map(w => w.id === updatedWorkout.id ? updatedWorkout : w)
    );
  }, []);
  
  const handleDeleteWorkout = useCallback((workoutId: string) => {
    if (window.confirm('Are you sure you want to delete this workout? This action cannot be undone.')) {
        setWorkouts(prevWorkouts => prevWorkouts.filter(w => w.id !== workoutId));
    }
  }, []);

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen font-sans">
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
        <main className="mt-8">
          {currentPage === 'history' && (
            <HistoryPage 
              workouts={workouts} 
              onNavigate={handleNavigate}
              onWorkoutUpdate={handleUpdateWorkout}
              onWorkoutDelete={handleDeleteWorkout}
            />
          )}
          {currentPage === 'log' && (
            <LogWorkoutPage 
              currentWorkout={currentWorkout}
              onCurrentWorkoutUpdate={setCurrentWorkout}
              onSaveWorkout={handleSaveWorkout} 
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;