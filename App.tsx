import React, { useState, useCallback, useRef } from 'react';
import { Workout } from './types';
import { parseWorkoutFromAudio } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import WorkoutDisplay from './components/WorkoutDisplay';
import { UploadIcon } from './components/icons/UploadIcon';
import { LoaderIcon } from './components/icons/LoaderIcon';

const App: React.FC = () => {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const acceptedMimeTypes = ['audio/wav', 'audio/x-wav', 'audio/m4a', 'audio/mp4', 'audio/x-m4a'];
    const fileNameLower = file.name.toLowerCase();
    const isValidMime = acceptedMimeTypes.includes(file.type);
    const isValidExtension = fileNameLower.endsWith('.wav') || fileNameLower.endsWith('.m4a');

    if (!isValidMime && !isValidExtension) {
        setError('Please upload a valid .wav or .m4a file.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setFileName(file.name);

    try {
      const { base64, mimeType } = await fileToBase64(file);
      const parsedData = await parseWorkoutFromAudio(base64, mimeType);
      
      let newExercisesTotalVolume = 0;
      const newExercisesWithVolume = parsedData.exercises.map(exercise => {
        const exerciseVolume = exercise.sets.reduce((sum, set) => sum + set.reps * set.weight, 0);
        newExercisesTotalVolume += exerciseVolume;
        return { ...exercise, volume: exerciseVolume };
      });
      
      setWorkout(prevWorkout => {
        if (!prevWorkout) {
          // This is the first upload, create the workout
          return {
            date: parsedData.date,
            exercises: newExercisesWithVolume,
            totalVolume: newExercisesTotalVolume,
          };
        } else {
          // This is a subsequent upload, add to the existing workout
          const combinedExercises = [...prevWorkout.exercises, ...newExercisesWithVolume];
          const newTotalVolume = prevWorkout.totalVolume + newExercisesTotalVolume;

          // Note: For now, we are just appending. If the same exercise is in multiple files, it will appear multiple times.
          return {
            ...prevWorkout,
            exercises: combinedExercises,
            totalVolume: newTotalVolume,
          };
        }
      });
      
    } catch (err) {
      console.error(err);
      setError('Failed to process workout. The AI could not understand the audio, or an API error occurred.');
    } finally {
      setIsLoading(false);
      setFileName(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, []);

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen font-sans">
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            morse
          </h1>
          <p className="text-gray-400 mt-2">
            Upload your workout audio (.wav, .m4a) and let AI do the logging.
          </p>
        </header>

        <main>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 md:p-8 shadow-2xl mb-8">
            <div className="flex flex-col items-center">
              <label htmlFor="audio-upload" className="w-full cursor-pointer bg-gray-700 hover:bg-gray-600 border-2 border-dashed border-gray-500 rounded-lg p-8 text-center transition-colors duration-300">
                <UploadIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <span className="text-lg font-semibold text-gray-300">
                  {isLoading && fileName ? `Processing: ${fileName}` : 'Click to upload .wav or .m4a file'}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  Your workout will be processed by Gemini
                </p>
              </label>
              <input
                id="audio-upload"
                type="file"
                accept="audio/wav,audio/m4a,audio/mp4,.wav,.m4a"
                className="hidden"
                onChange={handleFileChange}
                disabled={isLoading}
                ref={fileInputRef}
              />
            </div>
          </div>
          
          {isLoading && (
            <div className="flex flex-col items-center justify-center bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
              <LoaderIcon className="w-16 h-16 animate-spin text-blue-400" />
              <p className="text-xl font-semibold mt-4 text-gray-300">Analyzing your workout...</p>
              <p className="text-gray-400">This might take a moment.</p>
            </div>
          )}

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg p-4 text-center">
              <p className="font-bold">An error occurred</p>
              <p>{error}</p>
            </div>
          )}
          
          <div className="space-y-8">
            {workout && (
              <WorkoutDisplay key={workout.totalVolume} workout={workout} />
            )}
          </div>

          {!workout && !isLoading && !error && (
            <div className="text-center text-gray-500 p-8">
                <p>Your logged workout will appear here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;