// Play section sample data. Shapes mirror future DB tables (activities, coach_profiles, bookings).
import type { SPORTS } from "@/lib/data";

export const ACTIVITY_TYPES = ["Private Lessons", "Semi-Private Lessons", "Group Clinics", "Live Ball", "Cardio Tennis", "Beginner Classes", "Intermediate Clinics", "Advanced Clinics", "Junior Clinics", "Pickleball Lessons", "Pickleball Open Play", "Padel Lessons", "Squash Lessons", "Hitting Sessions", "Camps", "Social Events"] as const;
export const SKILL_LEVELS = ["Beginner", "Advanced Beginner", "Intermediate", "Advanced", "All Levels"] as const;
export const NTRP_LEVELS = ["2.5", "3.0", "3.5", "4.0", "4.5+", "Open Level"] as const;
export const AGE_GROUPS = ["Adults", "Juniors", "All Ages", "Seniors"] as const;
export const PLAY_AREAS = ["Santa Monica", "Beverly Hills", "West Hollywood", "Pasadena", "Studio City", "Culver City", "Manhattan Beach", "Downtown Los Angeles"];

export type Activity = {
  id: string; title: string; type: (typeof ACTIVITY_TYPES)[number]; sport: (typeof SPORTS)[number];
  hostId: string; coachName?: string; venue: string; area: string;
  date: string; time: string; duration: number; level: (typeof SKILL_LEVELS)[number]; ntrp?: (typeof NTRP_LEVELS)[number][];
  levelLabel: string; ageGroup: (typeof AGE_GROUPS)[number]; price: number; priceUnit?: string;
  maxPlayers: number; spotsLeft: number; rating: number; reviews: number;
  description: string; bring: string[];
};

export const CANCELLATION_POLICY = "Free cancellation up to 24 hours before start. Within 24 hours, 50% is refunded. No-shows are not refunded.";

export const COACH_INFO: Record<string, { sports: string[]; experience: string; certs: string[]; levels: string[] }> = {
  "coach-marcus": { sports: ["Tennis", "Pickleball"], experience: "14 years coaching, former D1 player at UCLA", certs: ["USPTA Elite Professional", "PPR Certified"], levels: ["Beginner", "Intermediate", "Advanced"] },
  "coach-maya": { sports: ["Tennis"], experience: "9 years coaching juniors and adults", certs: ["USPTA Professional", "SafePlay"], levels: ["Beginner", "Advanced Beginner", "Intermediate"] },
};

const A = (a: Activity) => a;
export const ACTIVITIES: Activity[] = [
  A({ id: "sat-intermediate-live-ball", title: "Saturday Intermediate Live Ball", type: "Live Ball", sport: "Tennis", hostId: "riviera-racquet-club", coachName: "Coach Marcus", venue: "Santa Monica Tennis Center", area: "Santa Monica", date: "2026-10-10", time: "10:00 AM", duration: 90, level: "Intermediate", ntrp: ["3.5", "4.0"], levelLabel: "3.5–4.0 Level", ageGroup: "Adults", price: 35, maxPlayers: 8, spotsLeft: 4, rating: 4.9, reviews: 86, description: "Fast-paced, coach-fed live ball. Rotate in and out of points with players at your level. Great cardio and match-play reps.", bring: ["Racquet", "Water", "Court shoes"] }),
  A({ id: "marcus-private", title: "Private Lesson with Coach Marcus", type: "Private Lessons", sport: "Tennis", hostId: "coach-marcus", coachName: "Coach Marcus", venue: "Beverly Hills Tennis Club", area: "Beverly Hills", date: "2026-10-11", time: "8:00 AM", duration: 60, level: "All Levels", ntrp: ["Open Level"], levelLabel: "All levels", ageGroup: "All Ages", price: 95, priceUnit: "/hour", maxPlayers: 1, spotsLeft: 1, rating: 5.0, reviews: 42, description: "One-on-one session tailored to your game — technique, tactics or match prep. Video review available.", bring: ["Racquet", "Water"] }),
  A({ id: "marcus-intermediate-clinic", title: "Intermediate Clinic", type: "Intermediate Clinics", sport: "Tennis", hostId: "coach-marcus", coachName: "Coach Marcus", venue: "Beverly Hills Tennis Club", area: "Beverly Hills", date: "2026-10-13", time: "6:30 PM", duration: 90, level: "Intermediate", ntrp: ["3.0", "3.5"], levelLabel: "3.0–3.5 Level", ageGroup: "Adults", price: 40, maxPlayers: 6, spotsLeft: 2, rating: 4.9, reviews: 31, description: "Drill-based clinic focused on consistency, net play and doubles positioning.", bring: ["Racquet", "Water", "Court shoes"] }),
  A({ id: "sunset-open-play", title: "Evening Pickleball Open Play", type: "Pickleball Open Play", sport: "Pickleball", hostId: "sunset-pickle", venue: "Sunset Pickleball Co.", area: "West Hollywood", date: "2026-10-09", time: "7:00 PM", duration: 120, level: "All Levels", levelLabel: "All levels", ageGroup: "Adults", price: 15, maxPlayers: 24, spotsLeft: 11, rating: 4.8, reviews: 140, description: "Paddle-stack rotation across 12 courts. Loaner paddles available.", bring: ["Paddle (or borrow one)", "Water"] }),
  A({ id: "sunset-beginner-pb", title: "Pickleball 101", type: "Beginner Classes", sport: "Pickleball", hostId: "sunset-pickle", venue: "Sunset Pickleball Co.", area: "West Hollywood", date: "2026-10-10", time: "9:00 AM", duration: 75, level: "Beginner", levelLabel: "Beginner", ageGroup: "All Ages", price: 30, maxPlayers: 12, spotsLeft: 5, rating: 4.9, reviews: 67, description: "Rules, scoring, dinks and serves — everything you need to join open play.", bring: ["Athletic shoes", "Water"] }),
  A({ id: "maya-junior", title: "Junior Development Clinic", type: "Junior Clinics", sport: "Tennis", hostId: "coach-maya", coachName: "Coach Maya R.", venue: "Manhattan Beach Courts", area: "Manhattan Beach", date: "2026-10-12", time: "4:00 PM", duration: 60, level: "Advanced Beginner", levelLabel: "Ages 8–12", ageGroup: "Juniors", price: 28, maxPlayers: 8, spotsLeft: 3, rating: 5.0, reviews: 22, description: "Fun, structured clinic building fundamentals through games.", bring: ["Racquet (loaners available)", "Water", "Hat"] }),
  A({ id: "riviera-cardio", title: "Cardio Tennis Sunrise", type: "Cardio Tennis", sport: "Tennis", hostId: "riviera-racquet-club", venue: "Riviera Racquet Club", area: "Santa Monica", date: "2026-10-14", time: "6:30 AM", duration: 60, level: "All Levels", ntrp: ["Open Level"], levelLabel: "All levels", ageGroup: "Adults", price: 25, maxPlayers: 12, spotsLeft: 7, rating: 4.7, reviews: 54, description: "High-energy drills set to music. Burn calories, hit a lot of balls.", bring: ["Racquet", "Water", "Towel"] }),
  A({ id: "padel-intro", title: "Intro to Padel", type: "Padel Lessons", sport: "Padel", hostId: "court-supply", venue: "Pasadena Padel Club", area: "Pasadena", date: "2026-10-11", time: "11:00 AM", duration: 60, level: "Beginner", levelLabel: "Beginner", ageGroup: "Adults", price: 45, maxPlayers: 4, spotsLeft: 2, rating: 4.8, reviews: 18, description: "Learn the walls, the bandeja and the basics of doubles padel.", bring: ["Athletic shoes", "Water"] }),
  A({ id: "bh-advanced", title: "Advanced Match Play Clinic", type: "Advanced Clinics", sport: "Tennis", hostId: "bh-tennis-club", coachName: "Coach Marcus", venue: "Beverly Hills Tennis Club", area: "Beverly Hills", date: "2026-10-15", time: "7:00 PM", duration: 90, level: "Advanced", ntrp: ["4.5+"], levelLabel: "4.5+ Level", ageGroup: "Adults", price: 50, maxPlayers: 8, spotsLeft: 6, rating: 4.9, reviews: 28, description: "Situational play and pattern work for competitive players.", bring: ["Racquet", "Water"] }),
  A({ id: "bh-social", title: "Friday Night Mixer", type: "Social Events", sport: "Tennis", hostId: "bh-tennis-club", venue: "Beverly Hills Tennis Club", area: "Beverly Hills", date: "2026-10-16", time: "6:00 PM", duration: 150, level: "All Levels", ntrp: ["3.0", "3.5", "4.0"], levelLabel: "3.0–4.0 Level", ageGroup: "Adults", price: 30, maxPlayers: 32, spotsLeft: 14, rating: 4.8, reviews: 39, description: "Round-robin doubles followed by drinks on the terrace.", bring: ["Racquet"] }),
  A({ id: "squash-studio-city", title: "Squash Fundamentals", type: "Squash Lessons", sport: "Squash", hostId: "court-supply", venue: "Studio City Squash", area: "Studio City", date: "2026-10-13", time: "12:00 PM", duration: 60, level: "Beginner", levelLabel: "Beginner", ageGroup: "Adults", price: 40, maxPlayers: 4, spotsLeft: 4, rating: 4.6, reviews: 12, description: "Grip, swing and movement on the squash court.", bring: ["Non-marking shoes", "Eye protection"] }),
  A({ id: "culver-camp", title: "Fall Break Tennis Camp", type: "Camps", sport: "Tennis", hostId: "coach-maya", coachName: "Coach Maya R.", venue: "Culver City Park Courts", area: "Culver City", date: "2026-10-19", time: "9:00 AM", duration: 240, level: "All Levels", levelLabel: "Ages 7–14", ageGroup: "Juniors", price: 85, priceUnit: "/day", maxPlayers: 20, spotsLeft: 9, rating: 4.9, reviews: 15, description: "Half-day camp: drills, games, match play and snacks.", bring: ["Racquet", "Lunch", "Sunscreen"] }),
];

export const activityById = (id: string) => ACTIVITIES.find((a) => a.id === id);
export const activitiesByHost = (id: string) => ACTIVITIES.filter((a) => a.hostId === id || (id === "coach-marcus" && a.coachName === "Coach Marcus"));
export const fmtDate = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
export const fmtDuration = (m: number) => (m % 60 ? `${m} minutes` : `${m / 60} hour${m > 60 ? "s" : ""}`);

export const REVIEWS = [
  { name: "Jess L.", rating: 5, text: "Perfect level match and tons of balls. Coach kept every point moving." },
  { name: "Andre P.", rating: 5, text: "Well organized, friendly group. Already booked next week." },
  { name: "Priya S.", rating: 4, text: "Great drills — wish it were a bit longer!" },
];

export const PLAYERS = [
  { name: "Sam T.", initials: "ST", sport: "Tennis", area: "Santa Monica", level: "NTRP 4.0", times: "Weekday mornings", courts: "Memorial Park", style: "Competitive" },
  { name: "Lena W.", initials: "LW", sport: "Pickleball", area: "West Hollywood", level: "DUPR 3.75", times: "Evenings", courts: "Plummer Park", style: "Casual" },
  { name: "Chris O.", initials: "CO", sport: "Tennis", area: "Pasadena", level: "NTRP 3.5", times: "Weekends", courts: "Brookside", style: "Casual" },
  { name: "Nina K.", initials: "NK", sport: "Padel", area: "Culver City", level: "Intermediate", times: "Weekend mornings", courts: "Any", style: "Competitive" },
  { name: "Jordan M.", initials: "JM", sport: "Tennis", area: "Beverly Hills", level: "NTRP 4.5", times: "Lunch hours", courts: "Roxbury Park", style: "Competitive" },
  { name: "Ava R.", initials: "AR", sport: "Pickleball", area: "Manhattan Beach", level: "DUPR 3.0", times: "Weekends", courts: "Live Oak Park", style: "Casual" },
];
