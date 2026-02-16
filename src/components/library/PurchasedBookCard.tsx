import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Check, IndianRupee } from "lucide-react";

interface PurchasedBook {
  id: string;
  title: string;
  author: string;
  coverColor: string;
  coverImageUrl: string | null;
  priceAmount: number;
  purchasedAt: string;
}

export default function PurchasedBookCard({ book }: { book: PurchasedBook }) {
  return (
    <Link to={`/book/${book.id}`}>
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
  );
}
