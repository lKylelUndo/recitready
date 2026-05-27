export const APP_NAME = "RecitReady"

export const COLORS = {
  background: "#f3f3f5",
  primary: "#051843",
  accent: "#2596be",
} as const

export const NAV_LINKS = {
  public: [
    { href: "/#features", label: "Features" },
    { href: "/#how-it-works", label: "How it works" },
  ],
  guest: [
    { href: "/login", label: "Log in" },
    { href: "/register", label: "Get started" },
  ],
  app: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/practice/new", label: "Practice" },
    { href: "/history", label: "History" },
  ],
} as const

export const DIFFICULTY_MODES = [
  {
    id: "easy",
    label: "Easy",
    description: "Basic recall questions with direct, simple questioning.",
  },
  {
    id: "medium",
    label: "Medium",
    description: "Explanatory and analytical questions with moderate follow-ups.",
  },
  {
    id: "hard",
    label: "Hard",
    description: "Critical thinking questions with deeper follow-up questioning.",
  },
] as const

export const TEACHER_MODES = [
  {
    id: "friendly",
    label: "Friendly Teacher",
    description: "Supportive tone with encouraging, lighter feedback.",
  },
  {
    id: "strict",
    label: "Strict Teacher",
    description: "Formal questioning with more critical feedback.",
  },
  {
    id: "terror",
    label: "Terror Teacher",
    description: "High-pressure questioning that simulates terror recitation.",
  },
] as const

export const MOCK_HISTORY = [
  {
    id: "1",
    topic: "Database Normalization",
    difficulty: "Medium",
    teacherMode: "Strict Teacher",
    score: 85,
    date: "May 24, 2026",
  },
  {
    id: "2",
    topic: "Object-Oriented Programming",
    difficulty: "Easy",
    teacherMode: "Friendly Teacher",
    score: 92,
    date: "May 22, 2026",
  },
  {
    id: "3",
    topic: "Capstone Defense — System Architecture",
    difficulty: "Hard",
    teacherMode: "Terror Teacher",
    score: 74,
    date: "May 18, 2026",
  },
] as const
