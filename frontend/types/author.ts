export interface Author {
  id: number;
  first_name: string;
  last_name: string;
  bio?: string;
  profile_image_path?: string;
  quotes?: any[];
}