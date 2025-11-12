
export interface SetData {
  reps: number;
  weight: number;
  unit: 'lbs' | 'kg';
}

export interface Exercise {
  name: string;
  sets: SetData[];
  volume: number; // Calculated: sum(reps * weight)
}

export interface Workout {
  date: string; // YYYY-MM-DD
  exercises: Exercise[];
  totalVolume: number; // Calculated: sum of all exercise volumes
}

// Type for the data parsed directly from Gemini API before calculations
export interface ParsedWorkoutData {
  date: string;
  exercises: Omit<Exercise, 'volume'>[];
}
