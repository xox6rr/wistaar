import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface BookCardProps {
  title: string;
  author: string;
  genre: string;
  coverColor?: string;
  accentColor?: string;
}

const BookCard = ({ title, author, genre, coverColor = "from-secondary to-accent", accentColor = "bg-primary" }: BookCardProps) => {
  return (
    <article className="group cursor-pointer">
      {/* Book Cover with 3D effect */}
      <div className={`book-cover bg-gradient-to-br ${coverColor} aspect-[2/3] mb-4 relative`}>
        {/* Spine effect */}
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-foreground/5" />
        
        {/* Genre badge */}
        <div className="absolute bottom-4 left-4 right-4">
          <span className={`inline-block px-2 py-1 text-xs font-medium uppercase tracking-wider rounded ${accentColor} text-primary-foreground`}>
            {genre}
          </span>
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-all duration-300" />
      </div>
      
      {/* Book Info */}
      <h3 className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors duration-200 line-clamp-1">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">
        {author}
      </p>
    </article>
  );
};

const freeBooks = [
  { title: "The Silent Garden", author: "Priya Sharma", genre: "Literary Fiction", coverColor: "from-accent to-sage-light", accentColor: "bg-primary" },
  { title: "Beyond the Horizon", author: "Arjun Mehta", genre: "Adventure", coverColor: "from-secondary to-gold-light", accentColor: "bg-gold" },
  { title: "Letters to Myself", author: "Kavya Nair", genre: "Poetry", coverColor: "from-muted to-accent", accentColor: "bg-primary" },
  { title: "The Last Monsoon", author: "Vikram Das", genre: "Drama", coverColor: "from-sage-light to-accent", accentColor: "bg-gold" },
];

const FreeReadingSection = () => {
  return (
    <section className="section-spacing relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sage-light/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="container-editorial relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-primary" />
              <p className="text-caption text-primary uppercase tracking-widest font-medium">
                Open Access
              </p>
            </div>
            <h2 className="headline-editorial text-heading text-foreground">
              Free Reading
            </h2>
            <p className="text-body text-muted-foreground mt-4 max-w-lg">
              Stories shared freely by authors who believe in open access to literature. 
              Start reading today — no account required.
            </p>
          </div>
          <Link to="/explore?filter=free">
            <Button variant="text" className="mt-6 md:mt-0 group">
              Browse all free books
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {freeBooks.map((book, index) => (
            <div 
              key={index} 
              className="opacity-0 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <BookCard {...book} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FreeReadingSection;
