import type { Pet } from "@/components/petia/FloatingBubble";

export const MOCK_PETS: Pet[] = [
  {
    id: "1",
    name: "Luna",
    breed: "Golden Retriever",
    age: "3y",
    weight: "28kg",
    img: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "2",
    name: "Milo",
    breed: "British Shorthair",
    age: "2y",
    weight: "5kg",
    img: "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=400",
  },
];

export interface PetDetails {
  petId: string;
  species: "Dog" | "Cat";
  sex: "Male" | "Female";
  neutered: boolean;
  dob: string;
  vetName: string;
  vetPhone: string;
  vetAddress: string;
  conditions: string[];
  allergies: string[];
}

export const PET_DETAILS: Record<string, PetDetails> = {
  "1": {
    petId: "1",
    species: "Dog",
    sex: "Female",
    neutered: true,
    dob: "Mar 12, 2022",
    vetName: "Dr. Patel",
    vetPhone: "+1 (415) 555-0117",
    vetAddress: "Bay Animal Hospital, San Francisco",
    conditions: ["Mild seasonal allergies"],
    allergies: ["Chicken"],
  },
  "2": {
    petId: "2",
    species: "Cat",
    sex: "Male",
    neutered: true,
    dob: "Jul 4, 2023",
    vetName: "Dr. Nguyen",
    vetPhone: "+1 (415) 555-0142",
    vetAddress: "Mission Cat Clinic, San Francisco",
    conditions: [],
    allergies: ["Dairy"],
  },
};

export type MoodId = "energetic" | "happy" | "normal" | "quiet" | "lethargic";

export interface MoodEntry {
  date: string;
  mood: MoodId;
  note?: string;
}

export const MOCK_MOODS: Record<string, MoodEntry[]> = {
  "1": [
    { date: "Apr 7", mood: "happy" },
    { date: "Apr 6", mood: "energetic", note: "Long park walk" },
    { date: "Apr 5", mood: "happy" },
    { date: "Apr 4", mood: "normal" },
    { date: "Apr 3", mood: "energetic" },
    { date: "Apr 2", mood: "quiet", note: "Slept most of the afternoon" },
    { date: "Apr 1", mood: "happy" },
  ],
  "2": [
    { date: "Apr 7", mood: "normal" },
    { date: "Apr 6", mood: "quiet" },
    { date: "Apr 5", mood: "happy" },
    { date: "Apr 4", mood: "normal" },
    { date: "Apr 3", mood: "lethargic", note: "Skipped breakfast" },
    { date: "Apr 2", mood: "normal" },
    { date: "Apr 1", mood: "energetic" },
  ],
};

export const MOOD_SCORE: Record<MoodId, number> = {
  energetic: 5,
  happy: 4,
  normal: 3,
  quiet: 2,
  lethargic: 1,
};

export interface WeightEntry {
  date: string;
  kg: number;
}

export const MOCK_WEIGHT: Record<string, WeightEntry[]> = {
  "1": [
    { date: "Jan 1", kg: 27.4 },
    { date: "Feb 1", kg: 27.9 },
    { date: "Mar 1", kg: 28.1 },
    { date: "Apr 1", kg: 28.0 },
  ],
  "2": [
    { date: "Jan 1", kg: 4.6 },
    { date: "Feb 1", kg: 4.8 },
    { date: "Mar 1", kg: 4.9 },
    { date: "Apr 1", kg: 5.0 },
  ],
};

export type ReminderCategory =
  | "Vaccination"
  | "Medication"
  | "Deworming"
  | "Grooming"
  | "Vet Visit"
  | "General";

export interface ReminderEntry {
  id: string;
  petId: string;
  title: string;
  category: ReminderCategory;
  due: string;
  recurrence: "One-time" | "Weekly" | "Monthly" | "Yearly";
  done: boolean;
  overdue?: boolean;
  notes?: string;
}

export const MOCK_REMINDERS: ReminderEntry[] = [
  { id: "r1", petId: "1", title: "Annual rabies booster", category: "Vaccination", due: "Apr 21, 9:00 AM", recurrence: "Yearly", done: false },
  { id: "r2", petId: "1", title: "Heartworm tablet", category: "Medication", due: "Today, 8:00 AM", recurrence: "Monthly", done: false },
  { id: "r3", petId: "2", title: "Dewormer dose", category: "Deworming", due: "Apr 3, 7:00 PM", recurrence: "Monthly", done: false, overdue: true },
  { id: "r4", petId: "1", title: "Grooming appointment", category: "Grooming", due: "Apr 15, 11:00 AM", recurrence: "Monthly", done: false },
  { id: "r5", petId: "1", title: "Annual check-up", category: "Vet Visit", due: "May 4, 10:00 AM", recurrence: "Yearly", done: false },
];

export interface VetVisit {
  id: string;
  petId: string;
  date: string;
  reason: string;
  clinic: string;
  vet: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  followUp?: string;
}

export const MOCK_VET_VISITS: VetVisit[] = [
  { id: "v1", petId: "1", date: "Mar 22, 2026", reason: "Itchy ears check", clinic: "Bay Animal Hospital", vet: "Dr. Patel", diagnosis: "Mild ear inflammation", treatment: "Otic drops, 7 days", followUp: "Apr 5, 2026" },
  { id: "v2", petId: "1", date: "Jan 14, 2026", reason: "Annual exam", clinic: "Bay Animal Hospital", vet: "Dr. Patel", diagnosis: "Healthy", treatment: "DHPP booster administered" },
  { id: "v3", petId: "2", date: "Feb 3, 2026", reason: "Vaccination", clinic: "Mission Cat Clinic", vet: "Dr. Nguyen", diagnosis: "Healthy", treatment: "FVRCP booster" },
];

export interface WeeklyInsight {
  id: string;
  petId: string;
  weekOf: string;
  moodTrend: string;
  foodInsights: string;
  healthSummary: string;
  recommendations: string[];
  current?: boolean;
}

export const MOCK_INSIGHTS: WeeklyInsight[] = [
  {
    id: "wi1",
    petId: "1",
    weekOf: "Apr 1 – Apr 7",
    moodTrend: "Mostly happy with a single quiet day. Mood is trending positive vs last week.",
    foodInsights: "All scans came back Good. Royal Canin Adult Medium remains the best match.",
    healthSummary: "Skin entry from Apr 6 is being observed. No new concerns logged this week.",
    recommendations: [
      "Add a 15-min evening walk on quiet days to boost mood balance.",
      "Schedule the upcoming annual rabies booster on Apr 21.",
      "Keep an eye on the left ear; take a follow-up photo Apr 8.",
    ],
    current: true,
  },
  {
    id: "wi2",
    petId: "1",
    weekOf: "Mar 25 – Mar 31",
    moodTrend: "Stable, happy week with one energetic spike on Saturday.",
    foodInsights: "1 Okay scan flagged a generic kibble — recommended brand swap.",
    healthSummary: "No new health diary entries.",
    recommendations: ["Maintain current feeding routine.", "Consider a longer Sunday walk."],
  },
];

export interface ScanHistoryEntry {
  id: string;
  date: string;
  title: string;
  brand: string;
  score: "Good" | "Okay" | "Not Recommended";
  thumb: string;
}

export const MOCK_SCAN_HISTORY: ScanHistoryEntry[] = [
  { id: "s1", date: "Apr 6", title: "Adult Medium Dry Food", brand: "Royal Canin", score: "Good", thumb: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&q=80&w=200" },
  { id: "s2", date: "Apr 3", title: "Generic Brand Kibble", brand: "PetCo", score: "Okay", thumb: "https://images.unsplash.com/photo-1585846416660-d6da8d2b3a36?auto=format&fit=crop&q=80&w=200" },
  { id: "s3", date: "Mar 30", title: "Chicken Treats", brand: "Treaty Co.", score: "Not Recommended", thumb: "https://images.unsplash.com/photo-1601758174039-86d44e0c6a16?auto=format&fit=crop&q=80&w=200" },
  { id: "s4", date: "Mar 22", title: "Salmon Fillet (cooked)", brand: "Home meal", score: "Good", thumb: "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?auto=format&fit=crop&q=80&w=200" },
];

export interface OcrVetVisit {
  date: string;
  reason: string;
  clinic: string;
  vet: string;
}

export interface OcrVaccination {
  name: string;
  given: string;
  nextDue?: string;
}

export interface OcrMedication {
  name: string;
  dose: string;
  unit: string;
  frequency: string;
  start: string;
  end: string;
}

export interface OcrResult {
  visits: OcrVetVisit[];
  vaccinations: OcrVaccination[];
  medications: OcrMedication[];
  warnings: string[];
}

export const MOCK_OCR_RESULT: OcrResult = {
  visits: [
    { date: "Nov 14, 2024", reason: "Annual wellness exam", clinic: "Bay Animal Hospital", vet: "Dr. Patel" },
    { date: "Jun 3, 2024", reason: "Itchy ears check", clinic: "Bay Animal Hospital", vet: "Dr. Patel" },
    { date: "Feb 9, 2023", reason: "Spay surgery", clinic: "Bay Animal Hospital", vet: "Dr. Lin" },
  ],
  vaccinations: [
    { name: "Rabies (3-year)", given: "Nov 14, 2024", nextDue: "Nov 14, 2027" },
    { name: "DHPP booster", given: "Nov 14, 2024", nextDue: "Nov 14, 2025" },
    { name: "Bordetella", given: "Jun 3, 2024", nextDue: "Jun 3, 2025" },
    { name: "Leptospirosis", given: "Nov 14, 2024" },
  ],
  medications: [
    { name: "Apoquel", dose: "5.4", unit: "mg", frequency: "Once daily", start: "Jun 3, 2024", end: "Jun 17, 2024" },
    { name: "NexGard", dose: "1", unit: "chew", frequency: "Monthly", start: "Jan 1, 2024", end: "Dec 1, 2024" },
  ],
  warnings: [
    "Image 3: handwriting on the prescription was partly illegible — please verify the dose.",
  ],
};
