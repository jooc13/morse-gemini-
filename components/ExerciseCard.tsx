import React from 'react';
import { Exercise } from '../types';
import { ExerciseIcon } from './ExerciseIcon';

interface ExerciseCardProps {
  exercise: Exercise;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg hover:border-gray-600">
      <div className="p-5">
        <div className="flex items-center mb-4">
          <ExerciseIcon exerciseName={exercise.name} className="w-8 h-8 text-blue-400 mr-3 flex-shrink-0" />
          <h3 className="text-xl font-bold text-white">{exercise.name}</h3>
          <span className="ml-auto text-sm font-medium text-gray-400 bg-gray-700 px-3 py-1 rounded-full">
            Volume: {exercise.volume.toLocaleString()} lbs
          </span>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-600">
                <tr>
                  <th className="p-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">Set</th>
                  <th className="p-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">Reps</th>
                  <th className="p-2 text-sm font-semibold text-gray-400 uppercase tracking-wider text-right">Weight</th>
                </tr>
              </thead>
              <tbody>
                {exercise.sets.map((set, index) => (
                  <tr key={index} className="border-b border-gray-700 last:border-b-0">
                    <td className="p-3 font-medium text-gray-300">{index + 1}</td>
                    <td className="p-3 text-gray-200">{set.reps}</td>
                    <td className="p-3 text-gray-200 text-right">{set.weight} <span className="text-gray-500">{set.unit}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;