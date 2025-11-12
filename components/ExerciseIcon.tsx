import React from 'react';
import { BenchPressIcon } from './icons/exercises/BenchPressIcon';
import { BicepCurlIcon } from './icons/exercises/BicepCurlIcon';
import { DeadliftIcon } from './icons/exercises/DeadliftIcon';
import { GenericLiftingIcon } from './icons/exercises/GenericLiftingIcon';
import { OverheadPressIcon } from './icons/exercises/OverheadPressIcon';
import { SquatIcon } from './icons/exercises/SquatIcon';

interface ExerciseIconProps extends React.SVGProps<SVGSVGElement> {
  exerciseName: string;
}

export const ExerciseIcon: React.FC<ExerciseIconProps> = ({ exerciseName, ...props }) => {
  const name = exerciseName.toLowerCase();

  if (name.includes('bench') || name.includes('chest press')) {
    return <BenchPressIcon {...props} />;
  }
  if (name.includes('squat')) {
    return <SquatIcon {...props} />;
  }
  if (name.includes('deadlift') || name.includes('rdl')) {
    return <DeadliftIcon {...props} />;
  }
  if (name.includes('overhead press') || name.includes('shoulder press') || name.includes('ohp')) {
    return <OverheadPressIcon {...props} />;
  }
  if (name.includes('curl')) {
    return <BicepCurlIcon {...props} />;
  }
  
  return <GenericLiftingIcon {...props} />;
};
