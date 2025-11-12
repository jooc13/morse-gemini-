import React, { useMemo, useState } from 'react';
import { Workout, SetData } from '../types';
import { ExerciseIcon } from '../components/ExerciseIcon';

interface PerformanceRecord {
    date: string;
    sets: SetData[];
}

interface AggregatedExercise {
    name: string;
    bodyPart: string;
    history: PerformanceRecord[];
}

interface ExercisesPageProps {
  workouts: Workout[];
}

const ExercisesPage: React.FC<ExercisesPageProps> = ({ workouts }) => {
    const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

    const aggregatedExercises = useMemo<AggregatedExercise[]>(() => {
        const exerciseMap = new Map<string, AggregatedExercise>();

        workouts.forEach(workout => {
            workout.exercises.forEach(exercise => {
                const existing = exerciseMap.get(exercise.name.toLowerCase());
                const performanceRecord: PerformanceRecord = {
                    date: workout.date,
                    sets: exercise.sets,
                };

                if (existing) {
                    existing.history.push(performanceRecord);
                    // Sort history by date descending
                    existing.history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                } else {
                    exerciseMap.set(exercise.name.toLowerCase(), {
                        name: exercise.name,
                        bodyPart: exercise.bodyPart,
                        history: [performanceRecord],
                    });
                }
            });
        });

        return Array.from(exerciseMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [workouts]);

    const handleToggleExercise = (exerciseName: string) => {
        setExpandedExercise(prev => (prev === exerciseName ? null : exerciseName));
    };

    if (aggregatedExercises.length === 0) {
        return (
            <div className="text-center text-gray-600 p-8 sm:p-12 bg-white border border-gray-200 rounded-lg animate-fade-in">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Exercises Logged</h2>
                <p>Your exercise database will appear here once you log a workout.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm animate-fade-in">
            <div className="p-5 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Exercise Database</h2>
                <p className="text-gray-500 mt-1">Click on an exercise to view your performance history.</p>
            </div>
            <div className="divide-y divide-gray-200">
                {aggregatedExercises.map(exercise => (
                    <div key={exercise.name}>
                        <button
                            onClick={() => handleToggleExercise(exercise.name)}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 focus:outline-none"
                        >
                            <div className="flex items-center">
                                <ExerciseIcon exerciseName={exercise.name} className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
                                <div>
                                    <p className="text-lg font-bold text-gray-800">{exercise.name}</p>
                                    <p className="text-sm text-gray-500">{exercise.bodyPart}</p>
                                </div>
                            </div>
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${expandedExercise === exercise.name ? 'transform rotate-180' : ''}`} 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {expandedExercise === exercise.name && (
                            <div className="px-5 pb-5 bg-gray-50 animate-fade-in-down">
                                <h4 className="text-md font-semibold text-gray-700 pt-4 pb-2">Performance History</h4>
                                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                    {exercise.history.map((record, index) => (
                                        <div key={`${record.date}-${index}`} className="bg-white p-3 rounded-lg border border-gray-200">
                                            <p className="font-semibold text-gray-800 mb-2">{record.date}</p>
                                            <table className="w-full text-left text-sm">
                                                <thead>
                                                    <tr className="border-b border-gray-200">
                                                        <th className="p-2 font-medium text-gray-500">Set</th>
                                                        <th className="p-2 font-medium text-gray-500">Reps</th>
                                                        <th className="p-2 font-medium text-gray-500 text-right">Weight</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {record.sets.map(set => (
                                                        <tr key={set.id}>
                                                            <td className="p-2 text-gray-700">{index + 1}</td>
                                                            <td className="p-2 text-gray-700">{set.reps}</td>
                                                            <td className="p-2 text-gray-700 text-right">{set.weight} {set.unit}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExercisesPage;
