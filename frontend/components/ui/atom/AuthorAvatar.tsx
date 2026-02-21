import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Author } from "@/types/author"

interface AuthorAvatarProps {
    author: Author,
}

export default function AuthorAvatar({ author } : AuthorAvatarProps) {
  const isValidPath = 
    author.profile_image_path && 
    author.profile_image_path !== "string" && 
    (author.profile_image_path.startsWith("http") || author.profile_image_path.startsWith("/"));


  return (
    <Avatar size="lg">
      {isValidPath && (
        <AvatarImage
          src={author.profile_image_path}
          alt={`${author.first_name} ${author.last_name}`}
          className="grayscale"
        />
      )}
      <AvatarFallback>
        {`${author.first_name?.charAt(0).toUpperCase() || "?"} ${author.last_name?.charAt(0).toUpperCase() || "?"}`}
      </AvatarFallback>
    </Avatar>
  )
}