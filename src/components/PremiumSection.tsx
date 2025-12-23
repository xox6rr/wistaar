import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const books = [
  { title: "The Architecture of Dreams", author: "Meera Krishnan", genre: "Psychology" },
  { title: "Conversations with Time", author: "Siddharth Rao", genre: "Philosophy" },
  { title: "The Code of Seasons", author: "Ananya Bhatt", genre: "Science Fiction" },
];

const PremiumSection = () => {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-main">
        <div className="text-center mb-16">
          <p className="text-sm tracking-widest uppercase text-accent mb-4">
            Curated Collection
          </p>
          <h2 className="text-3xl md:text-4xl mb-4">
            Premium eBooks
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Carefully curated works from acclaimed authors.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {books.map((book, i) => (
            <article key={i} className="group cursor-pointer bg-background rounded-xl p-6 border border-border hover:border-accent/30 transition-colors">
              <div className="aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {book.genre}
                </span>
              </div>
              <h3 className="font-sans font-medium mb-2 group-hover:text-accent transition-colors">
                {book.title}
              </h3>
              <p className="text-sm text-muted-foreground">{book.author}</p>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Link to="/explore?filter=premium">
            <Button variant="ghost" className="gap-2 group">
              Explore premium books
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PremiumSection;