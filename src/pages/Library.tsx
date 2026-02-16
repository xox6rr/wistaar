import { useMemo, useState, useCallback } from "react";
import { Link, Navigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { BookOpen, Library as LibraryIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAllReadingProgress, ReadingProgress } from "@/hooks/useReadingProgress";
import { mockBooks, Book } from "@/data/books";
import { usePurchases } from "@/hooks/usePurchases";
import { useApprovedBooks } from "@/hooks/useApprovedBooks";
import SearchBar from "@/components/SearchBar";
import FilterSelect from "@/components/FilterSelect";
import LibraryStats from "@/components/library/LibraryStats";
import PurchasedBookCard from "@/components/library/PurchasedBookCard";
import ContinueReadingCard from "@/components/library/ContinueReadingCard";
import { toast } from "sonner";

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
  genre: string;
}

const statusFilters = ["All", "In Progress", "Completed", "Purchased"] as const;

export default function Library() {
  const { user, loading: authLoading } = useAuth();
  const { allProgress, isLoading } = useAllReadingProgress();
  const { data: purchases, isLoading: purchasesLoading } = usePurchases();
  const { data: approvedBooks } = useApprovedBooks();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [archivedIds, setArchivedIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("library-archived");
      return stored ? new Set(JSON.parse(stored)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  const handleArchive = useCallback((bookId: string) => {
    setArchivedIds((prev) => {
      const next = new Set(prev);
      next.add(bookId);
      localStorage.setItem("library-archived", JSON.stringify([...next]));
      return next;
    });
    toast.success("Book hidden from library");
  }, []);

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
          genre: book.genre,
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
      .filter((b): b is BookWithProgress => b !== null && !archivedIds.has(b.id))
      .sort((a, b) => new Date(b.progress.last_read_at).getTime() - new Date(a.progress.last_read_at).getTime());
  }, [allProgress, archivedIds]);

  // Apply search + status filter
  const filteredProgress = useMemo(() => {
    let list = booksWithProgress;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    }
    if (statusFilter === "In Progress") list = list.filter((b) => b.progressPercent < 100);
    if (statusFilter === "Completed") list = list.filter((b) => b.progressPercent >= 100);
    if (statusFilter === "Purchased") list = [];
    return list;
  }, [booksWithProgress, search, statusFilter]);

  const filteredPurchased = useMemo(() => {
    if (statusFilter === "In Progress" || statusFilter === "Completed") return [];
    let list = purchasedBooks;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    }
    return list;
  }, [purchasedBooks, search, statusFilter]);

  // Stats
  const completedCount = booksWithProgress.filter((b) => b.progressPercent >= 100).length;
  const inProgressCount = booksWithProgress.filter((b) => b.progressPercent < 100).length;

  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  const anyLoading = isLoading || authLoading || purchasesLoading;
  const hasBooks = booksWithProgress.length > 0 || purchasedBooks.length > 0;
  const hasFilteredResults = filteredProgress.length > 0 || filteredPurchased.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container-editorial">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-medium text-foreground mb-4">
              My Library
            </h1>
            <p className="text-lg text-muted-foreground">
              Continue where you left off or start something new.
            </p>
          </div>

          {/* Stats */}
          {!anyLoading && (
            <LibraryStats
              totalBooks={booksWithProgress.length}
              completedBooks={completedCount}
              inProgressBooks={inProgressCount}
              purchasedCount={purchasedBooks.length}
            />
          )}

          {/* Search & Filter */}
          {!anyLoading && hasBooks && (
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="flex-1">
                <SearchBar value={search} onChange={setSearch} placeholder="Search your library..." />
              </div>
              <div className="w-full sm:w-48">
                <FilterSelect
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                  options={statusFilters}
                  placeholder="Status"
                />
              </div>
            </div>
          )}

          {/* Loading */}
          {anyLoading && (
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
          {!anyLoading && !hasBooks && (
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

          {/* No filter results */}
          {!anyLoading && hasBooks && !hasFilteredResults && (search || statusFilter !== "All") && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No books match your search or filter.</p>
              <Button variant="ghost" size="sm" className="mt-3" onClick={() => { setSearch(""); setStatusFilter("All"); }}>
                Clear Filters
              </Button>
            </div>
          )}

          {/* Books Grid */}
          {!anyLoading && hasFilteredResults && (
            <>
              {filteredPurchased.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-xl font-display font-medium text-foreground mb-6">
                    Purchased Books
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPurchased.map((book) => (
                      <PurchasedBookCard key={book.id} book={book} />
                    ))}
                  </div>
                </section>
              )}

              {filteredProgress.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-xl font-display font-medium text-foreground mb-6">
                    {statusFilter === "Completed" ? "Completed Books" : "Continue Reading"}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProgress.map((book) => (
                      <ContinueReadingCard key={book.id} book={book} onArchive={handleArchive} />
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
                    <Button variant="ghost" size="sm">View All</Button>
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
