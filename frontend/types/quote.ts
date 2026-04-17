import { Author } from "./author";

export interface Quote {
  id: number;
  text: string;
  likes: number;
  author: Author;
}