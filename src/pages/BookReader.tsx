import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBookChapters } from "@/hooks/useBookChapters";
import { useApprovedBooks } from "@/hooks/useApprovedBooks";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import PageFlipBook, { type PageFlipBookRef } from "@/components/reader/PageFlipBook";
import ReaderToolbar from "@/components/reader/ReaderToolbar";

export default function BookReader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: books } = useApprovedBooks();
  const { data: chapters, isLoading } = useBookChapters(id);
  const flipBookRef = useRef<PageFlipBookRef>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(17);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const book = books?.find((b) => b.id === id);

  // Auto-hide controls after inactivity
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      if (isFullscreen) setShowControls(false);
    }, 4000);
  }, [isFullscreen]);

  useEffect(() => {
    const handleMouseMove = () => resetControlsTimer();
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, [resetControlsTimer]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        flipBookRef.current?.flipNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        flipBookRef.current?.flipPrev();
      } else if (e.key === "Escape" && isFullscreen) {
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isFullscreen]);

  // Fullscreen change listener
  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    resetControlsTimer();
  }, [resetControlsTimer]);

  const adjustFontSize = useCallback((delta: number) => {
    setFontSize((prev) => Math.min(26, Math.max(14, prev + delta)));
  }, []);

  // Find current chapter based on page
  const getCurrentChapter = useCallback(() => {
    if (!chapters || chapters.length === 0) return 1;
    // Simple heuristic: find which chapter this page belongs to
    const totalPages = flipBookRef.current?.getTotalPages() || 1;
    const pagesPerChapter = totalPages / chapters.length;
    return Math.min(chapters.length, Math.floor(currentPage / pagesPerChapter) + 1);
  }, [chapters, currentPage]);

  const goToChapter = useCallback((chapterNumber: number) => {
    const page = flipBookRef.current?.getChapterStartPage(chapterNumber);
    if (page !== undefined && page >= 0) {
      flipBookRef.current?.flipTo(page);
    }
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading book...</p>
        </div>
      </div>
    );
  }

  // No chapters available
  if (!chapters || chapters.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
          <h1 className="font-serif text-2xl text-foreground mb-3">
            Content not available yet
          </h1>
          <p className="text-muted-foreground mb-8">
            This book's content is being processed. Please check back shortly.
          </p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen bg-[#f0ece4] dark:bg-[#111] transition-colors duration-300 select-none",
        isFullscreen && "cursor-none"
      )}
      onMouseMove={() => {
        if (isFullscreen) {
          document.body.style.cursor = "default";
          resetControlsTimer();
        }
      }}
      onClick={() => setShowControls((prev) => !prev)}
    >
      {/* Toolbar */}
      <ReaderToolbar
        bookTitle={book?.title || "Book"}
        currentChapter={getCurrentChapter()}
        totalPages={flipBookRef.current?.getTotalPages() || chapters.length}
        currentPage={currentPage}
        fontSize={fontSize}
        isFullscreen={isFullscreen}
        visible={showControls}
        chapters={chapters}
        onBack={() => navigate(`/book/${id}`)}
        onPrevPage={() => flipBookRef.current?.flipPrev()}
        onNextPage={() => flipBookRef.current?.flipNext()}
        onFontSizeChange={adjustFontSize}
        onToggleFullscreen={toggleFullscreen}
        onGoToChapter={goToChapter}
      />

      {/* Book */}
      <div
        className={cn(
          "flex items-center justify-center transition-all duration-300",
          showControls ? "pt-16 pb-4" : "pt-4 pb-4",
          "min-h-screen"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-[1100px] mx-auto px-4" style={{ height: "calc(100vh - 100px)" }}>
          <PageFlipBook
            ref={flipBookRef}
            chapters={chapters}
            fontSize={fontSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            bookTitle={book?.title || "Book"}
          />
        </div>
      </div>

      {/* Tap zones for navigation on mobile */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <button
          className="absolute left-0 top-16 bottom-0 w-1/5 pointer-events-auto opacity-0"
          onClick={(e) => {
            e.stopPropagation();
            flipBookRef.current?.flipPrev();
          }}
          aria-label="Previous page"
        />
        <button
          className="absolute right-0 top-16 bottom-0 w-1/5 pointer-events-auto opacity-0"
          onClick={(e) => {
            e.stopPropagation();
            flipBookRef.current?.flipNext();
          }}
          aria-label="Next page"
        />
      </div>
    </div>
  );
}
