import React from 'react';
import { Workout } from '../types';
import ExerciseCard from './ExerciseCard';

interface WorkoutDisplayProps {
  workout: Workout;
}

const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ workout }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <header className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-2">Workout Log: {workout.date}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-700 p-3 rounded-md">
                <p className="text-sm text-gray-400">Total Exercises</p>
                <p className="text-2xl font-semibold text-blue-400">{workout.exercises.length}</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-md">
                <p className="text-sm text-gray-400">Total Sets</p>
                <p className="text-2xl font-semibold text-purple-400">{workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)}</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-md col-span-2 md:col-span-1">
                <p className="text-sm text-gray-400">Total Volume</p>
                <p className="text-2xl font-semibold text-green-400">{workout.totalVolume.toLocaleString()} lbs</p>
            </div>
        </div>
      </header>
      
      <div className="space-y-6">
        {workout.exercises.map((exercise, index) => (
          <ExerciseCard key={index} exercise={exercise} />
        ))}
      </div>
    </div>
  );
};

export default WorkoutDisplay;