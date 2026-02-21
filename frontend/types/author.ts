import { Link } from "./link";
import { Quote } from "./quote";

export interface Author {
  id: number;
  first_name: string;
  last_name: string;
  bio?: string;
  profile_image_path?: string;
  links: Link[];
  quotes?: Quote[];
}