import React, { useState } from 'react';
import { useWorkoutStore } from '../store/workoutStore';
import { Timer } from './Timer';
import { Play, Pause, Square, Star, SkipForward } from 'lucide-react';
import { Exercise } from '../types';

interface Props {
  onComplete: (exercises: Exercise[], rating?: number, notes?: string) => void;
}

export const ExerciseDisplay: React.FC<Props> = ({ onComplete }) => {
  const { workout, pauseWorkout, resumeWorkout, stopWorkout, startExercises, skipExercise } = useWorkoutStore();
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [showRating, setShowRating] = useState(false);
  
  const currentExercise = workout.exercises[workout.currentExercise];

  const handleComplete = () => {
    onComplete(workout.exercises, rating, notes);
    stopWorkout();
  };

  if (showRating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
          <h2 className="text-2xl font-bold mb-4">Rate Your Workout</h2>
          <div className="flex justify-center space-x-2 mb-6">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => setRating(value)}
                className={`p-2 ${rating >= value ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                <Star className="w-8 h-8 fill-current" />
              </button>
            ))}
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about your workout (optional)"
            className="w-full p-4 border rounded-lg mb-4"
            rows={4}
          />
          <button
            onClick={handleComplete}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
          >
            Save Workout
          </button>
        </div>
      </div>
    );
  }

  if (!workout.isActive) return null;

  const handleStop = () => {
    setShowRating(true);
  };

  if (workout.isGettingReady) {
    const nextExercise = workout.exercises[0];
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full text-center">
          <h2 className="text-3xl font-bold mb-6 text-blue-600">Get Ready!</h2>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">First Exercise:</h3>
            <p className="text-2xl text-gray-800 mb-4">{nextExercise.title}</p>
            <p className="text-gray-600">{nextExercise.instructions}</p>
          </div>
          <div className="mb-8">
            <Timer onComplete={() => startExercises()} />
          </div>
          <p className="text-sm text-gray-500">
            Get in position and prepare for your workout!
          </p>
        </div>
      </div>
    );
  }

  const isLastExercise = workout.currentExercise >= workout.exercises.length - 1;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full text-center">
        {workout.isResting ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-600">Rest Period</h2>
            <p className="text-xl">Next up: {workout.exercises[workout.currentExercise + 1]?.title}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-800">{currentExercise.title}</h1>
            <p className="text-xl">{currentExercise.instructions}</p>
          </div>
        )}
        
        <div className="my-8">
          <Timer onComplete={handleStop} />
        </div>

        <div className="flex justify-center space-x-4">
          {workout.isPaused ? (
            <button
              onClick={resumeWorkout}
              className="p-4 bg-green-500 text-white rounded-full hover:bg-green-600"
            >
              <Play size={24} />
            </button>
          ) : (
            <button
              onClick={pauseWorkout}
              className="p-4 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
            >
              <Pause size={24} />
            </button>
          )}
          {!isLastExercise && !workout.isResting && (
            <button
              onClick={skipExercise}
              className="p-4 bg-purple-500 text-white rounded-full hover:bg-purple-600"
              title="Skip Exercise"
            >
              <SkipForward size={24} />
            </button>
          )}
          <button
            onClick={handleStop}
            className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <Square size={24} />
          </button>
        </div>

        <div className="mt-6">
          <p className="text-gray-600">
            Exercise {workout.currentExercise + 1} of {workout.exercises.length}
          </p>
        </div>
      </div>
    </div>
  );
};