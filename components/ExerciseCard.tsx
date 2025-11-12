import React, { useState, useCallback } from 'react';
import { Exercise, SetData } from '../types';
import { ExerciseIcon } from './ExerciseIcon';
import { EditableField } from './EditableField';

interface ExerciseCardProps {
  exercise: Exercise;
  isLast: boolean;
  onExerciseUpdate: (updatedExercise: Exercise) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, isLast, onExerciseUpdate }) => {
  const handleNameUpdate = useCallback((newName: string) => {
    onExerciseUpdate({ ...exercise, name: newName });
  }, [exercise, onExerciseUpdate]);

  const handleSetUpdate = useCallback((setIndex: number, newReps: string, newWeight: string) => {
    const updatedSets = exercise.sets.map((set, index) => {
      if (index === setIndex) {
        return { ...set, reps: parseInt(newReps, 10) || 0, weight: parseFloat(newWeight) || 0 };
      }
      return set;
    });
    
    // Recalculate volume for the exercise after set update
    const newVolume = updatedSets.reduce((sum, set) => sum + set.reps * set.weight, 0);

    onExerciseUpdate({ ...exercise, sets: updatedSets, volume: newVolume });
  }, [exercise, onExerciseUpdate]);

  return (
    <div className={`p-5 ${!isLast ? 'border-b border-gray-200' : ''}`}>
      <div className="flex items-center mb-4">
        <ExerciseIcon exerciseName={exercise.name} className="w-8 h-8 text-blue-600 mr-3 flex-shrink-0" />
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-gray-900 inline">
            <EditableField value={exercise.name} onSave={handleNameUpdate} />
          </h3>
          <span className="text-sm italic text-gray-500 ml-2">{exercise.bodyPart}</span>
        </div>
        <span className="ml-auto text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full flex-shrink-0">
          Volume: {exercise.volume.toLocaleString()} lbs
        </span>
      </div>
      <div className="overflow-x-auto pl-11">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="p-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">Set</th>
                <th className="p-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">Reps</th>
                <th className="p-2 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">Weight</th>
              </tr>
            </thead>
            <tbody>
              {exercise.sets.map((set, index) => (
                <tr key={set.id} className="border-b border-gray-200 last:border-b-0">
                  <td className="p-3 font-medium text-gray-800">{index + 1}</td>
                  <td className="p-3 text-gray-800">
                     <EditableField 
                        value={set.reps} 
                        onSave={(newReps) => handleSetUpdate(index, newReps, String(set.weight))}
                        inputType="number"
                     />
                  </td>
                  <td className="p-3 text-gray-800 text-right">
                    <EditableField 
                        value={set.weight} 
                        onSave={(newWeight) => handleSetUpdate(index, String(set.reps), newWeight)}
                        inputType="number"
                     />
                    <span className="text-gray-400 ml-1">{set.unit}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
};

export default ExerciseCard;