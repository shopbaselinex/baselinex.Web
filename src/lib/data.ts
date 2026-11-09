import r1 from "@/assets/p-racquet1.jpg";
import r2 from "@/assets/p-racquet2.jpg";
import paddle from "@/assets/p-paddle.jpg";
import shoes from "@/assets/p-shoes.jpg";
import bag from "@/assets/p-bag.jpg";

export const SPORTS = ["Tennis", "Pickleball", "Padel", "Squash", "Racquetball"] as const;
export const CATEGORIES = ["Racquets", "Paddles", "Shoes", "Apparel", "Bags", "Accessories", "Training Equipment"] as const;
export const CONDITIONS = ["New", "Like New", "Excellent", "Good", "Fair"] as const;
export const SELLER_TYPES = ["Player", "Coach", "Tennis Club", "Pickleball Club", "Pro Shop"] as const;
export const NEIGHBORHOODS = ["Santa Monica", "Beverly Hills", "West Hollywood", "Pasadena", "Studio City", "Manhattan Beach"];

export type Seller = {
  id: string; name: string; type: (typeof SELLER_TYPES)[number]; location: string;
  verified: boolean; rating: number; sales: number; since: string; about: string; initials: string;
};

export const SELLERS: Seller[] = [
  { id: "riviera-racquet-club", name: "Riviera Racquet Club", type: "Tennis Club", location: "Santa Monica", verified: true, rating: 4.9, sales: 312, since: "2024", initials: "RR", about: "A members' tennis club on the Westside since 1962. We rotate demo racquets every season — this is where they find new homes." },
  { id: "sunset-pickle", name: "Sunset Pickleball Co.", type: "Pickleball Club", location: "West Hollywood", verified: true, rating: 4.8, sales: 188, since: "2024", initials: "SP", about: "Twelve courts, open play daily. Selling last-gen paddles and club apparel." },
  { id: "court-supply", name: "Court Supply Pro Shop", type: "Pro Shop", location: "Pasadena", verified: true, rating: 4.9, sales: 540, since: "2023", initials: "CS", about: "Full-service pro shop and stringing studio. Discontinued and previous-generation inventory." },
  { id: "coach-maya", name: "Coach Maya R.", type: "Coach", location: "Manhattan Beach", verified: true, rating: 5.0, sales: 46, since: "2025", initials: "MR", about: "USPTA coach. Selling lightly used frames from my teaching rotation." },
  { id: "dan-k", name: "Dan K.", type: "Player", location: "Studio City", verified: false, rating: 4.7, sales: 12, since: "2025", initials: "DK", about: "4.5 NTRP. Always testing new frames." },
  { id: "coach-marcus", name: "Coach Marcus", type: "Coach", location: "Beverly Hills", verified: true, rating: 5.0, sales: 64, since: "2024", initials: "CM", about: "Former UCLA player teaching across the Westside. Private lessons, live ball and clinics — plus gear from my own bag." },
  { id: "bh-tennis-club", name: "Beverly Hills Tennis Club", type: "Tennis Club", location: "Beverly Hills", verified: true, rating: 4.9, sales: 205, since: "2024", initials: "BH", about: "Eight hard courts, full clinic program and a pro shop. Demo frames rotate monthly." },
];

export type Product = {
  id: string; brand: string; name: string; model: string; year: string; sport: (typeof SPORTS)[number];
  category: (typeof CATEGORIES)[number]; price: number; retail: number; condition: (typeof CONDITIONS)[number];
  sellerId: string; shipping: boolean; pickup: boolean; demo?: boolean; image: string;
  specs: Record<string, string>; description: string;
};

const P = (p: Product) => p;
export const PRODUCTS: Product[] = [
  P({ id: "wilson-blade-98-v9", brand: "Wilson", name: "Blade 98 V9", model: "Blade 98 16x19", year: "2024", sport: "Tennis", category: "Racquets", price: 159, retail: 279, condition: "Excellent", sellerId: "riviera-racquet-club", shipping: true, pickup: true, demo: true, image: r1, description: "Club demo frame, used for roughly 10 hits. Freshly strung.", specs: { "Grip size": "4 3/8", "Head size": "98 sq in", Weight: "305 g", "String pattern": "16x19", Balance: "7 pts HL", Length: "27 in", Strings: "Luxilon ALU Power", Tension: "52 lbs", "Stringing date": "Sep 2026", Cosmetic: "Light paint chips on bumper", Frame: "No cracks" } }),
  P({ id: "babolat-pure-aero", brand: "Babolat", name: "Pure Aero", model: "Pure Aero 100", year: "2023", sport: "Tennis", category: "Racquets", price: 145, retail: 269, condition: "Good", sellerId: "dan-k", shipping: true, pickup: true, image: r2, description: "Played one season. Grip replaced last month.", specs: { "Grip size": "4 1/4", "Head size": "100 sq in", Weight: "300 g", "String pattern": "16x19", Balance: "4 pts HL", Length: "27 in", Strings: "RPM Blast", Tension: "55 lbs", Cosmetic: "Scuffs at 10 and 2", Frame: "No cracks" } }),
  P({ id: "head-speed-mp", brand: "Head", name: "Speed MP", model: "Speed MP 2024", year: "2024", sport: "Tennis", category: "Racquets", price: 175, retail: 269, condition: "Like New", sellerId: "court-supply", shipping: true, pickup: false, demo: true, image: r1, description: "Previous-generation demo from our shop wall.", specs: { "Grip size": "4 1/2", "Head size": "100 sq in", Weight: "300 g", "String pattern": "16x19", Balance: "4 pts HL", Length: "27 in", Cosmetic: "Near perfect", Frame: "No cracks" } }),
  P({ id: "yonex-ezone-98", brand: "Yonex", name: "EZONE 98", model: "EZONE 98 7th Gen", year: "2022", sport: "Tennis", category: "Racquets", price: 129, retail: 259, condition: "Good", sellerId: "coach-maya", shipping: true, pickup: true, image: r2, description: "Teaching frame, well cared for.", specs: { "Grip size": "4 3/8", "Head size": "98 sq in", Weight: "305 g", "String pattern": "16x19", Balance: "6 pts HL", Length: "27 in" } }),
  P({ id: "selkirk-vanguard", brand: "Selkirk", name: "Vanguard Power Air", model: "Invikta", year: "2023", sport: "Pickleball", category: "Paddles", price: 119, retail: 249, condition: "Excellent", sellerId: "sunset-pickle", shipping: true, pickup: true, demo: true, image: paddle, description: "Club demo paddle. Edge guard intact.", specs: { Thickness: "16 mm", Shape: "Elongated", Weight: "7.9 oz", Material: "Carbon fiber", "Grip size": "4.25 in" } }),
  P({ id: "joola-perseus", brand: "Joola", name: "Ben Johns Perseus", model: "Perseus 16mm", year: "2024", sport: "Pickleball", category: "Paddles", price: 165, retail: 279, condition: "Like New", sellerId: "sunset-pickle", shipping: true, pickup: true, image: paddle, description: "Used twice. Grit still sharp.", specs: { Thickness: "16 mm", Shape: "Standard", Weight: "8.0 oz", Material: "Carbon friction", "Grip size": "4.25 in" } }),
  P({ id: "wilson-padel-bag", brand: "Wilson", name: "Pro Staff Padel + Bag", model: "Pro Staff V2", year: "2024", sport: "Padel", category: "Bags", price: 189, retail: 340, condition: "Excellent", sellerId: "court-supply", shipping: true, pickup: false, image: bag, description: "Racket and matching bag, discontinued colorway.", specs: { Weight: "360 g", Shape: "Round", Material: "Carbon" } }),
  P({ id: "court-shoes-white", brand: "Lacoste", name: "Court Classic", model: "Carnaby", year: "2025", sport: "Tennis", category: "Shoes", price: 69, retail: 120, condition: "New", sellerId: "riviera-racquet-club", shipping: true, pickup: true, image: shoes, description: "New in box, men's 10.", specs: { Size: "US 10", Surface: "All court" } }),
];

export const sellerById = (id: string) => SELLERS.find((s) => s.id === id)!;
export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);
export const sellerItemCount = (id: string) => PRODUCTS.filter((p) => p.sellerId === id).length;
