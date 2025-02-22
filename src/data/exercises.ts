import { Exercise } from '../types';

export const exerciseData: Exercise[] = [
  {
    title: "Jumping Jacks",
    instructions: "Stand with feet together, jump while spreading arms and legs, then return to start position. Repeat.",
    categories: ["Aerobic", "Lower body", "Upper body"],
    body_part_focus: ["Legs", "Arms", "Full body"]
  },
  {
    title: "High Knees",
    instructions: "Run in place while lifting your knees as high as possible, engaging your core.",
    categories: ["Aerobic", "Core", "Lower body"],
    body_part_focus: ["Legs", "Abs"]
  },
  // ... all other exercises remain the same
  {
    title: "Bodyweight Squats",
    instructions: "Stand with feet shoulder-width, bend knees, lower hips down, push back up.",
    categories: ["Mixed"],
    body_part_focus: ["Full body"]
  }
];