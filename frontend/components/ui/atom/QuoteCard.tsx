"use client"

import { useState, useEffect } from "react"
import { Check, DownloadIcon, Heart, Share2 } from "lucide-react"
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
import { Author } from "@/types/author"
import Link from "next/link"
import QuoteDownloadDialog from "../organisms/QuoteDownloadDialog"
import QuoteExportCard from "./QuoteExportCard"


interface QuoteCardProps {
  id: number;
  text: string;
  author: Author;
  likes: number;
}

export default function QuoteCard({ id, text, author, likes: initialLikes = 0 }: QuoteCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(initialLikes);
  const authorName = `${author.first_name} ${author.last_name}`;
  const [urlCopied, setUrlCopied] = useState(false);

  useEffect(() => {
    const likedQuotes = JSON.parse(localStorage.getItem("liked_quotes") || "[]");
    setIsLiked(likedQuotes.includes(id));
  }, [id]);

  useEffect(() => {
    setLocalLikes(initialLikes);
  }, [initialLikes]);

  // The Mutation (The API-Call)
  const mutation = useMutation({
  mutationFn: (shouldLike: boolean) => 
    shouldLike ? incrementLike(id) : decrementLike(id),
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
      setLocalLikes(prev => prev + 1);
    } else {
      const updated = likedQuotes.filter((quoteId: number) => quoteId !== id);
      localStorage.setItem("liked_quotes", JSON.stringify(updated));
      setLocalLikes(prev => prev - 1);
    }
    
    setIsLiked(nextLikedState);

    // 2. Der Mutation EXPLIZIT sagen, was sie tun soll
    // Wir geben das Ziel als Argument mit
    mutation.mutate(nextLikedState); 
  };

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}/quote/${id}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setUrlCopied(true);
      
      // Reset the icon again after 2 seconds
      setTimeout(() => setUrlCopied(false), 2000);
      
      // Optional: Ein Toast-Feedback (falls du Sonner oder Toast UI nutzt)
      // toast.success("Link kopiert!");
    } catch (err) {
      console.error("Error while copying url:", err);
    }
  }

  return (
    <Card>
      <CardContent>
        <p className="text-lg italic text-slate-800">"{text}"</p>
        <p className="text-sm font-bold mt-2 text-slate-500 uppercase tracking-wider">
          <span>- </span>          
          <Link 
            href={`/authors/${author.id}`} 
            className="hover:text-rose-600 transition-colors cursor-pointer underline-offset-4 hover:underline"
          >
            {authorName}
          </Link>
        </p>
      </CardContent>
      <CardFooter className="flex flew-row gap-2">
        <Button 
        onClick={toggleLike}
        variant="outline"
        className={cn(
            "gap-2 transition-colors",
            isLiked ? "text-rose-600 hover:text-rose-700 hover:bg-rose-50" : "text-slate-500"
          )}>
          <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
          <span>{localLikes}</span>
        </Button>
        <Button 
        onClick={handleCopyLink}
        variant="outline"
        className="h-9 px-2 text-slate-400 hover:text-rose-500 transition-colors"
        >
          {urlCopied ? (
          <>
            <Check className="h-4 w-4 mr-2 text-green-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-green-500">Copied to clipboard</span>
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4 mr-2" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Share</span>
          </>
        )}
        </Button>
        
        <QuoteDownloadDialog 
          className="max-h-[95vh] flex flex-col" 
          trigger={
          <Button 
          variant="outline"
          className="h-9 px-2 text-slate-400 hover:text-rose-500 transition-colors"
          >
            <DownloadIcon />
            <span>Download as PNG</span>
          </Button>
        }>
          <QuoteExportCard text={text} author={author}/>
        </QuoteDownloadDialog>
      </CardFooter>
    </Card>
  )
}