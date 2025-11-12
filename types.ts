export interface SetData {
  id: string;
  reps: number;
  weight: number;
  unit: 'lbs' | 'kg';
}

export interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  sets: SetData[];
  volume: number; 
}

export interface Workout {
  id: string;
  date: string; // YYYY-MM-DD
  exercises: Exercise[];
  totalVolume: number;
}

// FIX: Define ParsedWorkoutData and related types for data returned from Gemini API.
/**
 * Data structure for a set as parsed from Gemini.
 * Lacks an 'id'.
 */
export interface ParsedSet {
  reps: number;
  weight: number;
  unit: 'lbs' | 'kg';
}

/**
 * Data structure for an exercise as parsed from Gemini.
 * Lacks 'id' and 'volume'.
 */
export interface ParsedExercise {
  name: string;
  bodyPart: string;
  sets: ParsedSet[];
}

/**
 * Data structure for a workout as parsed from Gemini.
 * This is the raw data before it's processed and saved to the database.
 * Lacks 'id' and 'totalVolume'.
 */
export interface ParsedWorkoutData {
  date: string;
  exercises: ParsedExercise[];
}
