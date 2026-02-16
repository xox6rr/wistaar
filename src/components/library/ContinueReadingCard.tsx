import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Archive } from "lucide-react";
import ReadingProgress3D from "@/components/ReadingProgress3D";
import { ReadingProgress } from "@/hooks/useReadingProgress";

interface BookWithProgress {
  id: string;
  title: string;
  author: string;
  chapters: { id: string; number: number; title: string; readingTime: string }[];
  progress: ReadingProgress;
  progressPercent: number;
}

interface Props {
  book: BookWithProgress;
  onArchive?: (bookId: string) => void;
}

function formatLastRead(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function ContinueReadingCard({ book, onArchive }: Props) {
  const isCompleted = book.progressPercent >= 100;

  return (
    <article className="group bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors">
      <div className="flex gap-5 p-5">
        <div className="flex-shrink-0 flex items-center">
          <ReadingProgress3D percent={book.progressPercent} size={80} strokeWidth={6} />
        </div>
        <div className="flex-1 min-w-0">
          <Link to={`/book/${book.id}`}>
            <h3 className="font-display text-lg font-medium text-foreground leading-tight line-clamp-1 hover:text-accent transition-colors">
              {book.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mt-0.5">{book.author}</p>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant={isCompleted ? "default" : "secondary"} className="text-xs">
              {isCompleted ? "Completed" : `Ch ${book.progress.current_chapter}/${book.chapters.length}`}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatLastRead(book.progress.last_read_at)}
            </span>
          </div>
          <div className="flex gap-2 mt-3">
            {!isCompleted && (
              <Link to={`/read/${book.id}?chapter=${book.progress.current_chapter}`}>
                <Button size="sm" className="gap-2">
                  <Play className="h-4 w-4" /> Continue
                </Button>
              </Link>
            )}
            <Link to={`/book/${book.id}`}>
              <Button variant="outline" size="sm">Details</Button>
            </Link>
            {isCompleted && onArchive && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-muted-foreground"
                onClick={(e) => {
                  e.preventDefault();
                  onArchive(book.id);
                }}
              >
                <Archive className="h-4 w-4" /> Hide
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
