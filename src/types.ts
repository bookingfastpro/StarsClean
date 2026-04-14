export type Category = 'studios' | 'minivillas' | 'villas' | 'appartements' | 'all';

export interface Property {
  id?: string;
  title: string;
  category: Category;
  location: string;
  capacity: string;
  bathrooms: number;
  pmr: boolean;
  beds: number;
  desc: string;
  images: string[];
  features: string[];
  isVisible?: boolean;
}

export interface Review {
  id: number;
  author: string;
  date: string;
  rating: number;
  text: string;
  avatar: string;
}

export interface Service {
  id: string;
  title: string;
  desc: string;
  longDesc: string;
  icon: string; // Icon name from lucide-react
  images: string[];
}
