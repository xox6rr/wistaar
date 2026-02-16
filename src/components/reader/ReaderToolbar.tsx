import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  List,
  Minus,
  Plus,
  Maximize,
  Minimize,
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
import type { BookChapter } from "@/hooks/useBookChapters";

interface ReaderToolbarProps {
  bookTitle: string;
  currentChapter: number;
  totalPages: number;
  currentPage: number;
  fontSize: number;
  isFullscreen: boolean;
  visible: boolean;
  chapters: BookChapter[];
  onBack: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onFontSizeChange: (delta: number) => void;
  onToggleFullscreen: () => void;
  onGoToChapter: (chapterNumber: number) => void;
}

export default function ReaderToolbar({
  bookTitle,
  currentChapter,
  totalPages,
  currentPage,
  fontSize,
  isFullscreen,
  visible,
  chapters,
  onBack,
  onPrevPage,
  onNextPage,
  onFontSizeChange,
  onToggleFullscreen,
  onGoToChapter,
}: ReaderToolbarProps) {
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 transition-all duration-300",
        !visible && "-translate-y-full opacity-0"
      )}
    >
      <div className="flex items-center justify-between px-4 md:px-6 h-14">
        {/* Left: Back + title */}
        <div className="flex items-center gap-2 min-w-0">
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="hidden sm:block min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{bookTitle}</p>
            <p className="text-xs text-muted-foreground">Chapter {currentChapter}</p>
          </div>
        </div>

        {/* Center: Page navigation */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onPrevPage}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground tabular-nums min-w-[60px] text-center">
            {currentPage + 1} / {totalPages}
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNextPage}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-1">
          {/* Font Size */}
          <div className="hidden sm:flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onFontSizeChange(-2)}>
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-xs text-muted-foreground w-6 text-center">{fontSize}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onFontSizeChange(2)}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Fullscreen */}
          <Button variant="ghost" size="icon" onClick={onToggleFullscreen}>
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </Button>

          {/* Chapter List */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <List className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="font-serif">Chapters</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-100px)] mt-4">
                <div className="space-y-1">
                  {chapters.map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => onGoToChapter(ch.chapter_number)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-md transition-colors text-sm",
                        ch.chapter_number === currentChapter
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <span className="font-medium">
                        {ch.chapter_number}. {ch.title}
                      </span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
