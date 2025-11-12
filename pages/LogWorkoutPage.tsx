import React, { useState, useCallback, useRef } from 'react';
import { Workout, Exercise, SetData, ParsedExercise, ParsedSet } from '../types';
import { parseWorkoutFromAudio } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import WorkoutDisplay from '../components/WorkoutDisplay';
import { UploadIcon } from '../components/icons/UploadIcon';
import { LoaderIcon } from '../components/icons/LoaderIcon';

interface LogWorkoutPageProps {
    currentWorkout: Workout | null;
    // FIX: The type for a state updater function from `useState` should be `React.Dispatch<React.SetStateAction<...>>`
    // to correctly support functional updates. The previous type `(workout: Workout | null) => void` only allowed passing a value.
    onCurrentWorkoutUpdate: React.Dispatch<React.SetStateAction<Workout | null>>;
    onSaveWorkout: () => void;
}

const LogWorkoutPage: React.FC<LogWorkoutPageProps> = ({ currentWorkout, onCurrentWorkoutUpdate, onSaveWorkout }) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    setIsProcessing(true);
    setError(null);
    const filesArray = Array.from(files);

    try {
      const parsedWorkouts = await Promise.all(
        filesArray.map(async (file) => {
          const { base64, mimeType } = await fileToBase64(file);
          return await parseWorkoutFromAudio(base64, mimeType);
        })
      );

      onCurrentWorkoutUpdate(currentWorkout => {
        let newWorkout = currentWorkout ? { ...currentWorkout, exercises: [...currentWorkout.exercises] } : {
          id: crypto.randomUUID(),
          date: new Date().toISOString().split('T')[0],
          exercises: [],
          totalVolume: 0,
        };

        parsedWorkouts.forEach(parsedData => {
            if (!currentWorkout) {
              newWorkout.date = parsedData.date || newWorkout.date;
            }

            parsedData.exercises.forEach((parsedEx: ParsedExercise) => {
                const exerciseVolume = parsedEx.sets.reduce((vol, set) => vol + set.reps * set.weight, 0);
                const existingExercise = newWorkout.exercises.find(
                    (ex) => ex.name.toLowerCase() === parsedEx.name.toLowerCase()
                );

                if (existingExercise) {
                    const newSets: SetData[] = parsedEx.sets.map((set: ParsedSet) => ({
                        ...set,
                        id: crypto.randomUUID(),
                    }));
                    existingExercise.sets.push(...newSets);
                    existingExercise.volume += exerciseVolume;
                } else {
                    const newExercise: Exercise = {
                        ...parsedEx,
                        id: crypto.randomUUID(),
                        volume: exerciseVolume,
                        sets: parsedEx.sets.map((set: ParsedSet) => ({
                            ...set,
                            id: crypto.randomUUID(),
                        })),
                    };
                    newWorkout.exercises.push(newExercise);
                }
            });
        });
        
        newWorkout.totalVolume = newWorkout.exercises.reduce((total, ex) => total + ex.volume, 0);
        return newWorkout;
      });

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An API error occurred.';
      setError(`Failed to process files. ${errorMessage}`);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [onCurrentWorkoutUpdate]);
  
  const handleWorkoutUpdate = useCallback((updatedWorkout: Workout) => {
    onCurrentWorkoutUpdate(updatedWorkout);
  }, [onCurrentWorkoutUpdate]);

  const handleSave = () => {
    if(currentWorkout) {
        onSaveWorkout();
    }
  }

  return (
    <div className="animate-fade-in">
        <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm mb-8">
        <div className="flex flex-col items-center">
            <label htmlFor="audio-upload" className="w-full cursor-pointer bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors duration-300">
            <UploadIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <span className="text-lg font-semibold text-gray-700">
                {isProcessing ? `Processing ${fileInputRef.current?.files?.length || ''} file(s)...` : 'Upload workout audio'}
            </span>
            <p className="text-sm text-gray-500 mt-1">
                Exercises will be added to the current workout log.
            </p>
            </label>
            <input
            id="audio-upload"
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isProcessing}
            ref={fileInputRef}
            multiple
            />
        </div>
        </div>
        
        {isProcessing && (
        <div className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg p-12 text-center mb-8">
            <LoaderIcon className="w-16 h-16 animate-spin text-blue-500" />
            <p className="text-xl font-semibold mt-4 text-gray-800">Analyzing your workout...</p>
            <p className="text-gray-500">Extracting exercises, sets, and reps.</p>
        </div>
        )}

        {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-center mb-8">
            <p className="font-bold">An error occurred</p>
            <p>{error}</p>
        </div>
        )}
        
        <div className="space-y-8">
        {currentWorkout ? (
            <>
                <WorkoutDisplay workout={currentWorkout} onWorkoutUpdate={handleWorkoutUpdate} />
                <div className="flex justify-end">
                    <button 
                        onClick={handleSave}
                        disabled={isProcessing}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-transform duration-200 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        Finish &amp; Save Workout
                    </button>
                </div>
            </>
        ) : (
            !isProcessing && (
                <div className="text-center text-gray-500 p-8 bg-white border border-gray-200 rounded-lg">
                    <p className="text-lg">Upload an audio file to start a new workout log.</p>
                </div>
            )
        )}
        </div>
    </div>
  );
};

export default LogWorkoutPage;