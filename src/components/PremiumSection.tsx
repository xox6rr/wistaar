import { ArrowRight, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PremiumBookCardProps {
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverColor?: string;
}

const PremiumBookCard = ({ title, author, genre, rating, coverColor = "from-card to-secondary" }: PremiumBookCardProps) => {
  return (
    <article className="group cursor-pointer feature-card">
      {/* Book Cover */}
      <div className={`bg-gradient-to-br ${coverColor} aspect-[3/2] rounded-md flex items-end p-5 relative overflow-hidden mb-5`}>
        {/* Premium badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-gold/90 px-2.5 py-1 rounded-full text-xs font-medium text-foreground shadow-soft">
          <Crown className="w-3 h-3" />
          <span>Premium</span>
        </div>
        
        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/95 px-2 py-1 rounded-full text-xs shadow-soft">
          <Star className="w-3 h-3 fill-gold text-gold" />
          <span className="font-medium">{rating}</span>
        </div>
        
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          {genre}
        </span>
      </div>
      
      {/* Book Info */}
      <h3 className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors duration-200 line-clamp-1">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {author}
      </p>
      
      <div className="pt-4 border-t border-border/50">
        <Button variant="subtle" size="sm" className="w-full group/btn">
          Read Now
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </Button>
      </div>
    </article>
  );
};

const premiumBooks = [
  { title: "The Architecture of Dreams", author: "Meera Krishnan", genre: "Psychology", rating: 4.8, coverColor: "from-accent to-sage-light" },
  { title: "Conversations with Time", author: "Siddharth Rao", genre: "Philosophy", rating: 4.9, coverColor: "from-secondary to-gold-light" },
  { title: "The Code of Seasons", author: "Ananya Bhatt", genre: "Science Fiction", rating: 4.7, coverColor: "from-muted to-accent" },
];

const PremiumSection = () => {
  return (
    <section className="section-spacing bg-gradient-to-b from-cream/50 to-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-gold-light/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sage-light/15 rounded-full blur-3xl" />
      </div>
      
      <div className="container-editorial relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <Crown className="w-4 h-4 text-gold" />
              <p className="text-caption text-gold uppercase tracking-widest font-medium">
                Curated Collection
              </p>
            </div>
            <h2 className="headline-editorial text-heading text-foreground">
              Premium eBooks
            </h2>
            <p className="text-body text-muted-foreground mt-4 max-w-lg">
              Carefully curated, high-quality works from acclaimed authors. 
              Exceptional stories deserve exceptional presentation.
            </p>
          </div>
          <Link to="/explore?filter=premium">
            <Button variant="text" className="mt-6 md:mt-0 group">
              Explore premium
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Books Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {premiumBooks.map((book, index) => (
            <div 
              key={index}
              className="opacity-0 animate-fade-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <PremiumBookCard {...book} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PremiumSection;
