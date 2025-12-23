import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const books = [
  { title: "The Silent Garden", author: "Priya Sharma", genre: "Fiction" },
  { title: "Beyond the Horizon", author: "Arjun Mehta", genre: "Adventure" },
  { title: "Letters to Myself", author: "Kavya Nair", genre: "Poetry" },
  { title: "The Last Monsoon", author: "Vikram Das", genre: "Drama" },
];

const FreeReadingSection = () => {
  return (
    <section className="section-padding border-t border-border">
      <div className="container-main">
        <div className="text-center mb-16">
          <p className="text-sm tracking-widest uppercase text-accent mb-4">
            Open Access
          </p>
          <h2 className="text-3xl md:text-4xl mb-4">
            Free Reading
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Stories shared freely by authors who believe in open literature.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12">
          {books.map((book, i) => (
            <article key={i} className="group cursor-pointer text-center">
              <div className="aspect-[2/3] bg-secondary rounded-lg mb-4 flex items-end justify-center p-4 transition-transform duration-300 group-hover:-translate-y-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {book.genre}
                </span>
              </div>
              <h3 className="font-sans font-medium text-sm mb-1 group-hover:text-accent transition-colors">
                {book.title}
              </h3>
              <p className="text-xs text-muted-foreground">{book.author}</p>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Link to="/explore?filter=free">
            <Button variant="ghost" className="gap-2 group">
              Browse all free books
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FreeReadingSection;