import { useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play, Clock, Library as LibraryIcon, IndianRupee, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAllReadingProgress, ReadingProgress } from "@/hooks/useReadingProgress";
import { mockBooks, Book } from "@/data/books";
import { usePurchases } from "@/hooks/usePurchases";
import { useApprovedBooks } from "@/hooks/useApprovedBooks";
import ReadingProgress3D from "@/components/ReadingProgress3D";

interface BookWithProgress extends Book {
  progress: ReadingProgress;
  progressPercent: number;
}

interface PurchasedBook {
  id: string;
  title: string;
  author: string;
  coverColor: string;
  coverImageUrl: string | null;
  priceAmount: number;
  purchasedAt: string;
}

export default function Library() {
  const { user, loading: authLoading } = useAuth();
  const { allProgress, isLoading } = useAllReadingProgress();
  const { data: purchases, isLoading: purchasesLoading } = usePurchases();
  const { data: approvedBooks } = useApprovedBooks();

  const purchasedBooks = useMemo(() => {
    if (!purchases || !approvedBooks) return [];
    return purchases
      .map((p) => {
        const book = approvedBooks.find((b) => b.id === p.book_id);
        if (!book) return null;
        return {
          id: book.id,
          title: book.title,
          author: book.author,
          coverColor: book.coverColor,
          coverImageUrl: book.coverImageUrl,
          priceAmount: book.priceAmount,
          purchasedAt: p.purchased_at,
        } as PurchasedBook;
      })
      .filter(Boolean) as PurchasedBook[];
  }, [purchases, approvedBooks]);

  const booksWithProgress = useMemo(() => {
    return allProgress
      .map((progress) => {
        const book = mockBooks.find((b) => b.id === progress.book_id);
        if (!book) return null;
        const progressPercent = (progress.current_chapter / book.chapters.length) * 100;
        return { ...book, progress, progressPercent };
      })
      .filter((b): b is BookWithProgress => b !== null)
      .sort((a, b) => new Date(b.progress.last_read_at).getTime() - new Date(a.progress.last_read_at).getTime());
  }, [allProgress]);

  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  const formatLastRead = (dateString: string) => {
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
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container-editorial">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-medium text-foreground mb-4">
              My Library
            </h1>
            <p className="text-lg text-muted-foreground">
              Continue where you left off or start something new.
            </p>
          </div>

          {/* Loading State */}
          {(isLoading || authLoading || purchasesLoading) && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
                  <div className="aspect-[3/2] bg-muted rounded-md mb-4" />
                  <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !authLoading && !purchasesLoading && booksWithProgress.length === 0 && purchasedBooks.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <LibraryIcon className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-display font-medium text-foreground mb-3">
                Your library is empty
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Start reading a book and it will appear here. Your progress will be saved automatically.
              </p>
              <Link to="/explore">
                <Button size="lg" className="gap-2">
                  <BookOpen className="h-5 w-5" />
                  Explore Books
                </Button>
              </Link>
            </div>
          )}

          {/* Books Grid */}
          {!isLoading && !authLoading && !purchasesLoading && (booksWithProgress.length > 0 || purchasedBooks.length > 0) && (
            <>
              {/* Purchased Books */}
              {purchasedBooks.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-xl font-display font-medium text-foreground mb-6">
                    Purchased Books
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {purchasedBooks.map((book) => (
                      <Link key={book.id} to={`/book/${book.id}`}>
                        <article className="group bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors">
                          <div className="flex gap-5 p-5">
                            <div className={`flex-shrink-0 w-16 h-24 ${book.coverColor} rounded overflow-hidden relative`}>
                              {book.coverImageUrl && (
                                <img src={book.coverImageUrl} alt={book.title} className="absolute inset-0 w-full h-full object-cover" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-display text-lg font-medium text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                                {book.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-0.5">{book.author}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary" className="text-xs gap-1">
                                  <Check className="h-3 w-3" /> Owned
                                </Badge>
                                <Badge variant="outline" className="text-xs gap-0.5">
                                  <IndianRupee className="h-3 w-3" />{book.priceAmount}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Continue Reading */}
              {booksWithProgress.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-xl font-display font-medium text-foreground mb-6">
                    Continue Reading
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {booksWithProgress.map((book) => (
                      <article
                        key={book.id}
                        className="group bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors"
                      >
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
                              <Badge variant="secondary" className="text-xs">
                                Ch {book.progress.current_chapter}/{book.chapters.length}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatLastRead(book.progress.last_read_at)}
                              </span>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Link to={`/read/${book.id}?chapter=${book.progress.current_chapter}`}>
                                <Button size="sm" className="gap-2">
                                  <Play className="h-4 w-4" /> Continue
                                </Button>
                              </Link>
                              <Link to={`/book/${book.id}`}>
                                <Button variant="outline" size="sm">Details</Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              <section className="pt-8 border-t border-border">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-medium text-foreground">
                    Discover More
                  </h2>
                  <Link to="/explore">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
                <p className="text-muted-foreground">
                  Explore our collection of {mockBooks.length} books and find your next read.
                </p>
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
