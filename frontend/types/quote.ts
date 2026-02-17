import { Author } from "./author";

export interface Quote {
  id: number;
  text: string;
  likes: number;
  author_id: number;
  author: Author; // Hier steckt dein verschachteltes Author-Objekt drin
}