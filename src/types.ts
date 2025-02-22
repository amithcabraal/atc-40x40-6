export interface Exercise {
  id?: number;
  title: string;
  instructions: string;
  categories: string[];
  body_part_focus: string[];
}

export interface Session {
  id: string;
  created_at: string;
  exercises: Exercise[];
  rating?: number;
  notes?: string;
}

export interface WorkoutState {
  currentExercise: number;
  isResting: boolean;
  timeRemaining: number;
  exercises: Exercise[];
  isActive: boolean;
  isPaused: boolean;
  isGettingReady: boolean;
}

export interface WorkoutStore {
  workout: WorkoutState;
  startWorkout: (exercises: Exercise[]) => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  stopWorkout: () => void;
  nextExercise: () => void;
  setTimeRemaining: (time: number) => void;
  toggleRest: () => void;
  startExercises: () => void;
  skipExercise: () => void;
}