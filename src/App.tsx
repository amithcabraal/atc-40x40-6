import React, { useState, useEffect } from 'react';
import { Exercise, Session } from './types';
import { useWorkoutStore } from './store/workoutStore';
import { ExerciseDisplay } from './components/ExerciseDisplay';
import { WorkoutHistory } from './components/WorkoutHistory';
import { Calendar, List, Menu, Settings, Sun, Moon, HelpCircle, Share2, Shield } from 'lucide-react';
import { exerciseData } from './data/exercises';

function App() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { workout, startWorkout } = useWorkoutStore();

  useEffect(() => {
    const welcomeShown = localStorage.getItem('welcomeShown');
    if (welcomeShown) {
      setShowWelcome(false);
    }

    const darkModePreference = localStorage.getItem('darkMode');
    setDarkMode(darkModePreference === 'true');

    const savedSessions = localStorage.getItem('workout-sessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }

    // Add navigation protection
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (workout.isActive) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [workout.isActive]);

  const saveSession = (exercises: Exercise[], rating?: number, notes?: string) => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      exercises,
      rating,
      notes
    };

    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    localStorage.setItem('workout-sessions', JSON.stringify(updatedSessions));
  };

  const startNewWorkout = () => {
    // Randomly select 40 exercises, trying to mix categories
    const categorizedExercises = exerciseData.reduce((acc, exercise) => {
      const category = exercise.categories[0];
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(exercise);
      return acc;
    }, {} as Record<string, Exercise[]>);

    const selectedExercises: Exercise[] = [];
    const categories = Object.keys(categorizedExercises);
    
    // First, try to get an even distribution from each category
    const exercisesPerCategory = Math.floor(40 / categories.length);
    categories.forEach(category => {
      const exercises = categorizedExercises[category];
      const shuffled = [...exercises].sort(() => Math.random() - 0.5);
      selectedExercises.push(...shuffled.slice(0, exercisesPerCategory));
    });

    // Fill remaining slots randomly
    const remaining = 40 - selectedExercises.length;
    if (remaining > 0) {
      const allRemaining = exerciseData.filter(ex => !selectedExercises.includes(ex));
      const shuffled = [...allRemaining].sort(() => Math.random() - 0.5);
      selectedExercises.push(...shuffled.slice(0, remaining));
    }

    // Shuffle final selection
    const finalSelection = selectedExercises.sort(() => Math.random() - 0.5);
    console.log('Starting workout with exercises:', finalSelection.length);
    startWorkout(finalSelection);
  };

  const dismissWelcome = () => {
    localStorage.setItem('welcomeShown', 'true');
    setShowWelcome(false);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark');
  };

  if (workout.isActive) {
    return <ExerciseDisplay onComplete={saveSession} />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Workout App</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md">
            <h2 className="text-2xl font-bold mb-4">Welcome to Workout App!</h2>
            <p className="mb-6">
              Get ready for an amazing workout experience. This app will help you:
              - Complete 40-second exercises with 20-second rests
              - Track your progress
              - Save and repeat your favorite workouts
            </p>
            <button
              onClick={dismissWelcome}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <button
              onClick={startNewWorkout}
              className="w-full bg-blue-500 text-white py-4 rounded-lg text-xl font-bold hover:bg-blue-600 mb-8"
            >
              Start New Workout
            </button>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              {exerciseData.length} exercises available
            </div>
            <WorkoutHistory
              sessions={sessions}
              onRepeat={(session) => startWorkout(session.exercises)}
            />
          </div>
        </div>
      </main>

      {/* Menu */}
      {showMenu && (
        <div className="fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-800 shadow-lg p-4">
          <div className="space-y-4">
            <button className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
            <button className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <HelpCircle className="w-5 h-5" />
              <span>Help</span>
            </button>
            <button className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
            <button className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Shield className="w-5 h-5" />
              <span>Privacy Policy</span>
            </button>
            <div className="border-t dark:border-gray-700 pt-4">
              <p className="text-sm font-semibold mb-2">Theme</p>
              <select
                onChange={(e) => {
                  switch (e.target.value) {
                    case 'dark':
                      setDarkMode(true);
                      localStorage.setItem('darkMode', 'true');
                      break;
                    case 'light':
                      setDarkMode(false);
                      localStorage.setItem('darkMode', 'false');
                      break;
                    case 'system':
                      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                      setDarkMode(isDark);
                      localStorage.setItem('darkMode', String(isDark));
                      break;
                  }
                }}
                className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;