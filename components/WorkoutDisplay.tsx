import React from 'react';
import { Workout, Exercise } from '../types';
import ExerciseCard from './ExerciseCard';

interface WorkoutDisplayProps {
  workout: Workout;
  onWorkoutUpdate: (updatedWorkout: Workout) => void;
  onWorkoutDelete?: (workoutId: string) => void;
}

const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ workout, onWorkoutUpdate, onWorkoutDelete }) => {
  
  const handleExerciseUpdate = (updatedExercise: Exercise) => {
    const updatedExercises = workout.exercises.map(ex => 
      ex.id === updatedExercise.id ? updatedExercise : ex
    );
    // Recalculate total volume based on updated exercises
    const newTotalVolume = updatedExercises.reduce((total, ex) => total + ex.volume, 0);

    const updatedWorkout = {
      ...workout,
      exercises: updatedExercises,
      totalVolume: newTotalVolume,
    };
    onWorkoutUpdate(updatedWorkout);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Workout Log: {workout.date}</h2>
            </div>
            {onWorkoutDelete && (
                <button 
                    onClick={() => onWorkoutDelete(workout.id)} 
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete workout"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center mt-4">
            <div className="bg-gray-100 p-3 rounded-md">
                <p className="text-sm text-gray-500">Total Exercises</p>
                <p className="text-2xl font-semibold text-blue-600">{workout.exercises.length}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-md">
                <p className="text-sm text-gray-500">Total Sets</p>
                <p className="text-2xl font-semibold text-blue-600">{workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-md col-span-2 md:col-span-1">
                <p className="text-sm text-gray-500">Total Volume</p>
                <p className="text-2xl font-semibold text-blue-600">{workout.totalVolume.toLocaleString()} lbs</p>
            </div>
        </div>
      </header>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {workout.exercises.length > 0 ? (
            workout.exercises.map((exercise, index) => (
            <ExerciseCard 
                key={exercise.id} 
                exercise={exercise} 
                isLast={index === workout.exercises.length - 1}
                onExerciseUpdate={handleExerciseUpdate}
            />
            ))
        ) : (
            <p className="p-6 text-center text-gray-500">No exercises have been logged for this workout yet.</p>
        )}
      </div>
    </div>
  );
};

export default WorkoutDisplay;