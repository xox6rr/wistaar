import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface ReadingProgress {
  book_id: string;
  current_chapter: number;
  scroll_position: number;
  last_read_at: string;
}

export function useReadingProgress(bookId: string | undefined) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress on mount
  useEffect(() => {
    if (!user || !bookId) {
      setIsLoading(false);
      return;
    }

    const loadProgress = async () => {
      try {
        const { data, error } = await supabase
          .from("reading_progress")
          .select("book_id, current_chapter, scroll_position, last_read_at")
          .eq("user_id", user.id)
          .eq("book_id", bookId)
          .maybeSingle();

        if (error) {
          console.error("Error loading reading progress:", error);
        } else if (data) {
          setProgress(data);
        }
      } catch (err) {
        console.error("Failed to load reading progress:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [user, bookId]);

  // Save progress
  const saveProgress = useCallback(
    async (chapter: number, scrollPosition: number = 0) => {
      if (!user || !bookId) return;

      try {
        const { error } = await supabase
          .from("reading_progress")
          .upsert(
            {
              user_id: user.id,
              book_id: bookId,
              current_chapter: chapter,
              scroll_position: scrollPosition,
              last_read_at: new Date().toISOString(),
            },
            {
              onConflict: "user_id,book_id",
            }
          );

        if (error) {
          console.error("Error saving reading progress:", error);
        } else {
          setProgress({
            book_id: bookId,
            current_chapter: chapter,
            scroll_position: scrollPosition,
            last_read_at: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error("Failed to save reading progress:", err);
      }
    },
    [user, bookId]
  );

  return {
    progress,
    isLoading,
    saveProgress,
    isAuthenticated: !!user,
  };
}
