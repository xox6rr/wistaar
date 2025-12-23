import { useParams, Link } from "react-router-dom";
import { mockBooks } from "@/data/books";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, BookOpen, Star, Globe, Calendar, Play } from "lucide-react";
import { useReadingProgress } from "@/hooks/useReadingProgress";

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const book = mockBooks.find((b) => b.id === id);
  const { progress, isLoading, isAuthenticated } = useReadingProgress(id);

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="container-editorial text-center py-20">
            <h1 className="text-2xl font-display font-medium text-foreground mb-4">
              Book not found
            </h1>
            <p className="text-muted-foreground mb-8">
              The book you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/explore">
              <Button variant="editorial">Browse Books</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedDate = new Date(book.publishedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Back Link */}
        <div className="container-editorial mb-8">
          <Link 
            to="/explore" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Explore
          </Link>
        </div>

        {/* Hero Section */}
        <section className="container-editorial">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Book Cover */}
            <div className="lg:col-span-1">
              <div className={`aspect-[3/4] ${book.coverColor} rounded-lg flex items-center justify-center sticky top-24`}>
                <div className="text-center p-8">
                  <h3 className="font-display text-xl font-medium text-foreground leading-tight mb-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                </div>
              </div>
            </div>

            {/* Book Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Meta */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge 
                    variant={book.price === "premium" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {book.price}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{book.genre}</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-display font-medium text-foreground leading-tight mb-4">
                  {book.title}
                </h1>
                
                <p className="text-lg text-muted-foreground">
                  by <span className="text-foreground">{book.author}</span>
                </p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 py-6 border-y border-border">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-foreground">{book.rating}</span>
                  <span className="text-sm text-muted-foreground">rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{book.pageCount} pages</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{book.language}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{formattedDate}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-4">
                {progress && progress.current_chapter > 1 ? (
                  <>
                    <Link to={`/read/${book.id}?chapter=${progress.current_chapter}`}>
                      <Button variant="editorial" size="xl" className="gap-2">
                        <Play className="h-5 w-5" />
                        Continue Chapter {progress.current_chapter}
                      </Button>
                    </Link>
                    <Link to={`/read/${book.id}?chapter=1`}>
                      <Button variant="outline" size="xl" className="gap-2">
                        <BookOpen className="h-5 w-5" />
                        Start Over
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link to={`/read/${book.id}?chapter=1`}>
                    <Button variant="editorial" size="xl" className="gap-2">
                      <BookOpen className="h-5 w-5" />
                      Start Reading
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="xl">
                  Add to Library
                </Button>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">
                  About this book
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {book.fullDescription}
                </p>
              </div>

              {/* Author Bio */}
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">
                  About the Author
                </h2>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-medium text-foreground">
                      {book.author.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-2">{book.author}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {book.authorBio}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chapters */}
              <div className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">
                  Chapters
                </h2>
                <div className="border border-border rounded-lg divide-y divide-border">
                  {book.chapters.map((chapter) => (
                    <Link 
                      key={chapter.id}
                      to={`/read/${book.id}?chapter=${chapter.number}`}
                      className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground w-8">
                          {chapter.number}.
                        </span>
                        <span className="text-foreground">{chapter.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {chapter.readingTime}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
