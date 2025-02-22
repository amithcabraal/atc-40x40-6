import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Exercise, WorkoutStore } from '../types';

const initialWorkoutState = {
  currentExercise: 0,
  isResting: false,
  timeRemaining: 40,
  exercises: [],
  isActive: false,
  isPaused: false,
  isGettingReady: false,
};

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      workout: initialWorkoutState,
      startWorkout: (exercises: Exercise[]) => {
        console.log('Starting workout with exercises:', exercises);
        set({ 
          workout: { 
            ...initialWorkoutState, 
            exercises,
            isActive: true,
            isGettingReady: true,
            timeRemaining: 20,
          } 
        });
      },
      startExercises: () => 
        set((state) => ({
          workout: {
            ...state.workout,
            isGettingReady: false,
            timeRemaining: 40,
          }
        })),
      pauseWorkout: () =>
        set((state) => ({ workout: { ...state.workout, isPaused: true } })),
      resumeWorkout: () =>
        set((state) => ({ workout: { ...state.workout, isPaused: false } })),
      stopWorkout: () => set({ workout: initialWorkoutState }),
      nextExercise: () =>
        set((state) => ({
          workout: {
            ...state.workout,
            currentExercise: state.workout.currentExercise + 1,
            isResting: false,
            timeRemaining: 40,
          },
        })),
      skipExercise: () =>
        set((state) => {
          const isLastExercise = state.workout.currentExercise >= state.workout.exercises.length - 1;
          return {
            workout: {
              ...state.workout,
              currentExercise: isLastExercise ? state.workout.currentExercise : state.workout.currentExercise + 1,
              isResting: false,
              timeRemaining: 40,
            },
          };
        }),
      setTimeRemaining: (time: number) =>
        set((state) => ({ workout: { ...state.workout, timeRemaining: time } })),
      toggleRest: () =>
        set((state) => ({
          workout: {
            ...state.workout,
            isResting: !state.workout.isResting,
            timeRemaining: state.workout.isResting ? 40 : 20,
          },
        })),
    }),
    {
      name: 'workout-storage',
    }
  )
);