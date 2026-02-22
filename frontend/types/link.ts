import { LinkType } from "./link_type";

export interface Link{
    id: number;
    url: string;
    label?: string;
    link_type: LinkType;
}