export type Category = 'studios' | 'minivillas' | 'villas' | 'all';

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
}

export interface Review {
  id: number;
  author: string;
  date: string;
  rating: number;
  text: string;
  avatar: string;
}
