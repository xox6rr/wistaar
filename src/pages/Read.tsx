import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { mockBooks } from "@/data/books";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  List, 
  Minus,
  Plus,
  Loader2
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import { useToast } from "@/hooks/use-toast";

export default function Read() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const book = mockBooks.find((b) => b.id === id);
  const chapterParam = searchParams.get("chapter");
  const initialChapterIndex = chapterParam ? parseInt(chapterParam) - 1 : 0;
  
  const [fontSize, setFontSize] = useState(18);
  const [showControls, setShowControls] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasRestoredProgress, setHasRestoredProgress] = useState(false);
  
  const { progress, isLoading, saveProgress, isAuthenticated } = useReadingProgress(id);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Determine current chapter - use URL param if set, otherwise use saved progress
  const currentChapterIndex = chapterParam 
    ? parseInt(chapterParam) - 1 
    : (progress?.current_chapter ? progress.current_chapter - 1 : 0);
  
  const currentChapter = book?.chapters[currentChapterIndex];
  const totalChapters = book?.chapters.length || 0;
  const overallProgress = ((currentChapterIndex + 1) / totalChapters) * 100;

  // Restore progress on initial load
  useEffect(() => {
    if (!isLoading && progress && !chapterParam && !hasRestoredProgress) {
      setSearchParams({ chapter: progress.current_chapter.toString() });
      setHasRestoredProgress(true);
      toast({
        title: "Welcome back!",
        description: `Continuing from Chapter ${progress.current_chapter}`,
      });
    }
  }, [isLoading, progress, chapterParam, hasRestoredProgress, setSearchParams, toast]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progressPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progressPercent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-save progress with debounce
  useEffect(() => {
    if (!isAuthenticated || !id) return;

    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce save to avoid too many requests
    saveTimeoutRef.current = setTimeout(() => {
      saveProgress(currentChapterIndex + 1, scrollProgress);
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [currentChapterIndex, scrollProgress, isAuthenticated, id, saveProgress]);

  // Scroll to top on chapter change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentChapterIndex]);

  if (!book || !currentChapter) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-medium text-foreground mb-4">
            Chapter not found
          </h1>
          <Link to="/explore">
            <Button variant="editorial">Browse Books</Button>
          </Link>
        </div>
      </div>
    );
  }

  const goToChapter = (chapterNumber: number) => {
    if (chapterNumber >= 1 && chapterNumber <= totalChapters) {
      setSearchParams({ chapter: chapterNumber.toString() });
      // Immediately save when manually changing chapters
      if (isAuthenticated) {
        saveProgress(chapterNumber, 0);
      }
    }
  };

  const nextChapter = () => goToChapter(currentChapterIndex + 2);
  const prevChapter = () => goToChapter(currentChapterIndex);

  const adjustFontSize = (delta: number) => {
    setFontSize((prev) => Math.min(28, Math.max(14, prev + delta)));
  };

  // Generate mock chapter content
  const chapterContent = generateChapterContent(currentChapter.title, book.title);

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border transition-transform duration-300",
          !showControls && "-translate-y-full"
        )}
      >
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(`/book/${id}`)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-foreground line-clamp-1">{book.title}</p>
              <p className="text-xs text-muted-foreground">Chapter {currentChapter.number}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Font Size Controls */}
            <div className="hidden sm:flex items-center gap-1 mr-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => adjustFontSize(-2)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground w-8 text-center">{fontSize}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => adjustFontSize(2)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Chapter Navigation Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <List className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="font-display">Chapters</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-100px)] mt-4">
                  <div className="space-y-1">
                    {book.chapters.map((chapter, index) => (
                      <button
                        key={chapter.id}
                        onClick={() => {
                          goToChapter(chapter.number);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-md transition-colors",
                          index === currentChapterIndex
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        )}
                      >
                        <span className="text-sm font-medium">
                          {chapter.number}. {chapter.title}
                        </span>
                        <span className="block text-xs mt-0.5 opacity-70">
                          {chapter.readingTime}
                        </span>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress 
          value={scrollProgress} 
          className="h-0.5 rounded-none"
        />
      </header>

      {/* Main Reading Area */}
      <main 
        className="pt-20 pb-24 px-4"
        onClick={() => setShowControls((prev) => !prev)}
      >
        <article className="max-w-2xl mx-auto">
          {/* Chapter Header */}
          <header className="mb-12 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Chapter {currentChapter.number}
            </p>
            <h1 className="text-3xl md:text-4xl font-display font-medium text-foreground">
              {currentChapter.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-4">
              {currentChapter.readingTime} read
            </p>
          </header>

          {/* Chapter Content */}
          <div 
            className="prose-reading space-y-6"
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
          >
            {chapterContent.map((paragraph, index) => (
              <p key={index} className="text-foreground/90">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Chapter End */}
          <div className="mt-16 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground mb-6">
              End of Chapter {currentChapter.number}
            </p>
            
            <div className="flex items-center justify-center gap-4">
              {currentChapterIndex > 0 && (
                <Button variant="outline" onClick={prevChapter}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
              
              {currentChapterIndex < totalChapters - 1 ? (
                <Button variant="editorial" onClick={nextChapter}>
                  Next Chapter
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button variant="editorial" asChild>
                  <Link to={`/book/${id}`}>
                    Finish Book
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </article>
      </main>

      {/* Fixed Footer - Progress */}
      <footer 
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border transition-transform duration-300",
          !showControls && "translate-y-full"
        )}
      >
        <div className="px-4 md:px-6 py-3">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={prevChapter}
                disabled={currentChapterIndex === 0}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>
              
              <span className="text-sm text-muted-foreground">
                {currentChapterIndex + 1} of {totalChapters} chapters
              </span>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={nextChapter}
                disabled={currentChapterIndex === totalChapters - 1}
                className="gap-1"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <Progress value={overallProgress} className="h-1" />
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper function to generate mock chapter content
function generateChapterContent(chapterTitle: string, bookTitle: string): string[] {
  const paragraphs = [
    `The morning light filtered through the curtains, casting long shadows across the room. It was in moments like these that the true nature of things revealed itself, slowly and deliberately, like a flower unfurling its petals to greet the sun.`,
    
    `There was something profound about beginnings, about the way they carried within them the seeds of everything that would follow. Every story, every journey, every transformation started with a single moment of decision, a turning point that would only become visible in hindsight.`,
    
    `The path ahead was unclear, shrouded in the mist of uncertainty that accompanies all great endeavors. But clarity, as they say, comes not from seeing the whole journey at once, but from taking the first step and trusting that the next will reveal itself in time.`,
    
    `"Understanding," the old master had once said, "is not something you achieve. It is something that achieves you, when you have finally stopped trying to grasp it." These words echoed now, carrying new meaning with each passing day.`,
    
    `The landscape stretched endlessly before them, a canvas of possibility painted in hues of amber and gold. Each hill, each valley, held its own story, its own secrets waiting to be discovered by those patient enough to listen.`,
    
    `Time, that most mysterious of companions, seemed to move differently here. Minutes stretched into hours, hours condensed into moments, and in between, something essential was happening—a transformation too subtle to name but too significant to ignore.`,
    
    `There were lessons everywhere for those who knew how to look. In the way the river carved its path through stone, not with force but with persistence. In the way the trees bent with the wind rather than against it. In the way silence could speak louder than any words.`,
    
    `The characters in this chapter of life were many and varied. Some appeared briefly, leaving impressions that would last forever. Others stayed longer, their presence woven into the very fabric of the narrative. And some were yet to arrive, their entrances still waiting in the wings.`,
    
    `As the day progressed, new revelations came to light. What had seemed certain became questionable. What had been overlooked emerged as crucial. The story was writing itself, and all one could do was pay attention and participate with an open heart.`,
    
    `Evening approached, bringing with it the contemplative quiet that follows a day of discovery. The questions remained, as they always do, but they felt different now—less like obstacles and more like invitations to go deeper, to understand more fully, to embrace the mystery rather than solve it.`,
    
    `And so the chapter drew to its close, not with answers but with a deeper appreciation for the questions. Tomorrow would bring new challenges, new insights, new opportunities for growth. But for now, this moment was enough—this pause between what was and what was yet to be.`,
  ];

  return paragraphs;
}
