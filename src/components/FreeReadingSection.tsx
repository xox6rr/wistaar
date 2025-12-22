import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookCardProps {
  title: string;
  author: string;
  genre: string;
  coverColor?: string;
}

const BookCard = ({ title, author, genre, coverColor = "bg-secondary" }: BookCardProps) => {
  return (
    <article className="group hover-lift cursor-pointer">
      {/* Book Cover */}
      <div className={`${coverColor} aspect-[2/3] rounded-sm mb-4 flex items-end p-4 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider relative z-10">
          {genre}
        </span>
      </div>
      
      {/* Book Info */}
      <h3 className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors duration-200">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">
        {author}
      </p>
    </article>
  );
};

const freeBooks = [
  { title: "The Silent Garden", author: "Priya Sharma", genre: "Literary Fiction", coverColor: "bg-accent" },
  { title: "Beyond the Horizon", author: "Arjun Mehta", genre: "Adventure", coverColor: "bg-secondary" },
  { title: "Letters to Myself", author: "Kavya Nair", genre: "Poetry", coverColor: "bg-muted" },
  { title: "The Last Monsoon", author: "Vikram Das", genre: "Drama", coverColor: "bg-accent" },
];

const FreeReadingSection = () => {
  return (
    <section className="section-spacing border-t border-border">
      <div className="container-editorial">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <p className="text-caption text-muted-foreground uppercase tracking-widest mb-3">
              Open Access
            </p>
            <h2 className="text-heading text-foreground">
              Free Reading
            </h2>
            <p className="text-body text-muted-foreground mt-3 max-w-lg">
              Stories shared freely by authors who believe in open access to literature.
            </p>
          </div>
          <Button variant="text" className="mt-6 md:mt-0 group">
            Browse all free books
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {freeBooks.map((book, index) => (
            <BookCard key={index} {...book} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FreeReadingSection;
