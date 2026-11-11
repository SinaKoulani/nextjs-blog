export type CategoryDescription = Record<string, unknown>;

export interface Category {
  id: number;
  name: string;
  description: CategoryDescription | null;
}

export interface Tag {
  id: number;
  name: string;
}
