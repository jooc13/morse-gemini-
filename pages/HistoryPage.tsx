import React from 'react';
import { Workout } from '../types';
import WorkoutDisplay from '../components/WorkoutDisplay';

interface HistoryPageProps {
  workouts: Workout[];
  onNavigate: (page: 'history' | 'log') => void;
  onWorkoutUpdate: (updatedWorkout: Workout) => void;
  onWorkoutDelete: (workoutId: string) => void;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ workouts, onNavigate, onWorkoutUpdate, onWorkoutDelete }) => {
  if (workouts.length === 0) {
    return (
      <div className="text-center text-gray-600 p-8 sm:p-12 bg-white border border-gray-200 rounded-lg animate-fade-in">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome to morse!</h2>
        <p className="mb-6">You haven't logged any workouts yet.</p>
        <button 
          onClick={() => onNavigate('log')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 hover:scale-105"
        >
          Log Your First Workout
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {workouts.map(workout => (
        <WorkoutDisplay 
            key={workout.id} 
            workout={workout} 
            onWorkoutUpdate={onWorkoutUpdate}
            onWorkoutDelete={onWorkoutDelete}
        />
      ))}
    </div>
  );
};

export default HistoryPage;