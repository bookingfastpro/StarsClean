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

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}
