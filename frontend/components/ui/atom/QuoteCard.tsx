"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { incrementLike, decrementLike } from "@/lib/api"
import { cn } from "@/lib/utils"

// components/QuoteCard.tsx
interface QuoteCardProps {
  id: number;
  text: string;
  authorName: string;
  likes: number;
}

export default function QuoteCard({ id, text, authorName, likes = 0 }: QuoteCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const likedQuotes = JSON.parse(localStorage.getItem("liked_quotes") || "[]");
    setIsLiked(likedQuotes.includes(id));
  }, [id]);

  // The Mutation (The API-Call)
  const mutation = useMutation({
  // Wir nehmen 'shouldLike' als Argument entgegen
  mutationFn: (shouldLike: boolean) => 
    shouldLike ? incrementLike(id) : decrementLike(id),
  
  onSuccess: () => {
    // Das sorgt dafür, dass die Zahlen auf dem Dashboard frisch vom Server kommen
    queryClient.invalidateQueries({ queryKey: ["quotes"] });
    queryClient.invalidateQueries({ queryKey: ["quote-daily"] });
  },
});

  const toggleLike = () => {
    const likedQuotes = JSON.parse(localStorage.getItem("liked_quotes") || "[]");
    
    // Wir berechnen den NEUEN Status lokal in einer Variable, 
    // anstatt uns auf den (noch alten) State zu verlassen.
    const currentlyLiked = isLiked; 
    const nextLikedState = !currentlyLiked;

    // 1. LocalStorage & UI State sofort updaten
    if (nextLikedState) {
      localStorage.setItem("liked_quotes", JSON.stringify([...likedQuotes, id]));
    } else {
      const updated = likedQuotes.filter((quoteId: number) => quoteId !== id);
      localStorage.setItem("liked_quotes", JSON.stringify(updated));
    }
    
    setIsLiked(nextLikedState);

    // 2. Der Mutation EXPLIZIT sagen, was sie tun soll
    // Wir geben das Ziel als Argument mit
    mutation.mutate(nextLikedState); 
  };

  return (
    <Card>
      <CardContent>
        <p className="text-lg italic text-slate-800">"{text}"</p>
        <p className="text-sm font-bold mt-2 text-slate-500 uppercase tracking-wider">
          - {authorName}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
        onClick={toggleLike}
        variant="outline"
        className={cn(
            "gap-2 transition-colors",
            isLiked ? "text-rose-600 hover:text-rose-700 hover:bg-rose-50" : "text-slate-500"
          )}>
          <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
          <span>{likes}</span>
        </Button>
      </CardFooter>
    </Card>
  )
}