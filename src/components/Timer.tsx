import React, { useEffect } from 'react';
import { useWorkoutStore } from '../store/workoutStore';

interface Props {
  onComplete?: () => void;
}

export const Timer: React.FC<Props> = ({ onComplete }) => {
  const { workout, setTimeRemaining, toggleRest, nextExercise } = useWorkoutStore();

  useEffect(() => {
    if (!workout.isActive || workout.isPaused) return;

    const timer = setInterval(() => {
      if (workout.timeRemaining > 0) {
        setTimeRemaining(workout.timeRemaining - 1);
      } else {
        if (workout.isResting) {
          if (workout.currentExercise >= workout.exercises.length - 1) {
            clearInterval(timer);
            if (onComplete) {
              onComplete();
            }
            return;
          }
          nextExercise();
        } else {
          toggleRest();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [workout.timeRemaining, workout.isResting, workout.isActive, workout.isPaused]);

  const minutes = Math.floor(workout.timeRemaining / 60);
  const seconds = workout.timeRemaining % 60;

  return (
    <div className="text-6xl font-bold">
      {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
};