import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PremiumBookCardProps {
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverColor?: string;
}

const PremiumBookCard = ({ title, author, genre, rating, coverColor = "bg-card" }: PremiumBookCardProps) => {
  return (
    <article className="group hover-lift cursor-pointer bg-card rounded-md overflow-hidden border border-border/50">
      {/* Book Cover */}
      <div className={`${coverColor} aspect-[3/2] flex items-end p-5 relative`}>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/90 px-2 py-1 rounded text-xs">
          <Star className="w-3 h-3 fill-foreground text-foreground" />
          <span className="font-medium">{rating}</span>
        </div>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          {genre}
        </span>
      </div>
      
      {/* Book Info */}
      <div className="p-5">
        <h3 className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {author}
        </p>
        <div className="mt-4 pt-4 border-t border-border">
          <span className="text-xs text-primary font-medium uppercase tracking-wider">
            Premium Access
          </span>
        </div>
      </div>
    </article>
  );
};

const premiumBooks = [
  { title: "The Architecture of Dreams", author: "Meera Krishnan", genre: "Psychology", rating: 4.8, coverColor: "bg-accent" },
  { title: "Conversations with Time", author: "Siddharth Rao", genre: "Philosophy", rating: 4.9, coverColor: "bg-secondary" },
  { title: "The Code of Seasons", author: "Ananya Bhatt", genre: "Science Fiction", rating: 4.7, coverColor: "bg-muted" },
];

const PremiumSection = () => {
  return (
    <section className="section-spacing bg-card/50">
      <div className="container-editorial">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <p className="text-caption text-muted-foreground uppercase tracking-widest mb-3">
              Curated Collection
            </p>
            <h2 className="text-heading text-foreground">
              Premium eBooks
            </h2>
            <p className="text-body text-muted-foreground mt-3 max-w-lg">
              Carefully curated, high-quality works from acclaimed authors. 
              Exceptional stories deserve exceptional presentation.
            </p>
          </div>
          <Button variant="text" className="mt-6 md:mt-0 group">
            Explore premium
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Books Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {premiumBooks.map((book, index) => (
            <PremiumBookCard key={index} {...book} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PremiumSection;
