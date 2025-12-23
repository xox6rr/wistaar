import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Bookmark {
  id: string;
  book_id: string;
  chapter_number: number;
  scroll_position: number;
  note: string | null;
  highlighted_text: string | null;
  created_at: string;
}

export function useBookmarks(bookId: string | undefined) {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load bookmarks on mount
  useEffect(() => {
    if (!user || !bookId) {
      setIsLoading(false);
      return;
    }

    const loadBookmarks = async () => {
      try {
        const { data, error } = await supabase
          .from("bookmarks")
          .select("*")
          .eq("user_id", user.id)
          .eq("book_id", bookId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error loading bookmarks:", error);
        } else if (data) {
          setBookmarks(data);
        }
      } catch (err) {
        console.error("Failed to load bookmarks:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookmarks();
  }, [user, bookId]);

  // Add bookmark
  const addBookmark = useCallback(
    async (
      chapterNumber: number,
      scrollPosition: number = 0,
      note?: string,
      highlightedText?: string
    ) => {
      if (!user || !bookId) return null;

      try {
        const { data, error } = await supabase
          .from("bookmarks")
          .insert({
            user_id: user.id,
            book_id: bookId,
            chapter_number: chapterNumber,
            scroll_position: scrollPosition,
            note: note || null,
            highlighted_text: highlightedText || null,
          })
          .select()
          .single();

        if (error) {
          console.error("Error adding bookmark:", error);
          return null;
        }

        if (data) {
          setBookmarks((prev) => [data, ...prev]);
          return data;
        }
      } catch (err) {
        console.error("Failed to add bookmark:", err);
      }
      return null;
    },
    [user, bookId]
  );

  // Update bookmark
  const updateBookmark = useCallback(
    async (bookmarkId: string, note: string) => {
      if (!user) return false;

      try {
        const { error } = await supabase
          .from("bookmarks")
          .update({ note })
          .eq("id", bookmarkId)
          .eq("user_id", user.id);

        if (error) {
          console.error("Error updating bookmark:", error);
          return false;
        }

        setBookmarks((prev) =>
          prev.map((b) => (b.id === bookmarkId ? { ...b, note } : b))
        );
        return true;
      } catch (err) {
        console.error("Failed to update bookmark:", err);
        return false;
      }
    },
    [user]
  );

  // Delete bookmark
  const deleteBookmark = useCallback(
    async (bookmarkId: string) => {
      if (!user) return false;

      try {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("id", bookmarkId)
          .eq("user_id", user.id);

        if (error) {
          console.error("Error deleting bookmark:", error);
          return false;
        }

        setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
        return true;
      } catch (err) {
        console.error("Failed to delete bookmark:", err);
        return false;
      }
    },
    [user]
  );

  return {
    bookmarks,
    isLoading,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    isAuthenticated: !!user,
  };
}
