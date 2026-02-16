import { Navigate, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Trash2, IndianRupee, BookOpen, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart, useRemoveFromCart } from "@/hooks/useCart";
import { useApprovedBooks } from "@/hooks/useApprovedBooks";
import { useInitiatePayment } from "@/hooks/usePurchases";
import { useState } from "react";

export default function Cart() {
  const { user, loading: authLoading } = useAuth();
  const { data: cartItems, isLoading: cartLoading } = useCart();
  const { data: approvedBooks } = useApprovedBooks();
  const removeFromCart = useRemoveFromCart();
  const initiatePayment = useInitiatePayment();
  const [payingBookId, setPayingBookId] = useState<string | null>(null);

  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  const cartBooks = (cartItems || [])
    .map((item) => {
      const book = approvedBooks?.find((b) => b.id === item.book_id);
      return book ? { ...book, cartId: item.id } : null;
    })
    .filter(Boolean) as (NonNullable<ReturnType<typeof approvedBooks extends (infer T)[] | undefined ? () => T : never>> & { cartId: string })[];

  const total = cartBooks.reduce((sum, b) => sum + (b as any).priceAmount, 0);

  const handleBuy = async (bookId: string, title: string, amount: number) => {
    setPayingBookId(bookId);
    try {
      const payuData = await initiatePayment.mutateAsync({ bookId, bookTitle: title, amount });

      // Create and submit a form to PayU
      const form = document.createElement("form");
      form.method = "POST";
      form.action = payuData.payuUrl;

      const fields = ["key", "txnid", "amount", "productinfo", "firstname", "email", "hash", "surl", "furl", "udf1", "udf2"];
      fields.forEach((field) => {
        if (payuData[field]) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = field;
          input.value = payuData[field];
          form.appendChild(input);
        }
      });

      document.body.appendChild(form);
      form.submit();
    } catch {
      setPayingBookId(null);
    }
  };

  const isLoading = cartLoading || authLoading;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container-editorial max-w-3xl">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-display font-medium text-foreground mb-3">
              My Cart
            </h1>
            <p className="text-muted-foreground">
              Books you've saved to buy later.
            </p>
          </div>

          {isLoading && (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && cartBooks.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-display font-medium text-foreground mb-3">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Browse premium books and add them to your cart to buy later.
              </p>
              <Link to="/explore">
                <Button size="lg" className="gap-2">
                  <BookOpen className="h-5 w-5" />
                  Explore Books
                </Button>
              </Link>
            </div>
          )}

          {!isLoading && cartBooks.length > 0 && (
            <div className="space-y-4">
              {cartBooks.map((book: any) => (
                <div
                  key={book.id}
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg"
                >
                  <Link to={`/book/${book.id}`} className="flex-shrink-0">
                    <div
                      className={`w-16 h-24 ${book.coverColor} rounded overflow-hidden relative`}
                    >
                      {book.coverImageUrl && (
                        <img
                          src={book.coverImageUrl}
                          alt={book.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/book/${book.id}`}>
                      <h3 className="font-medium text-foreground line-clamp-1 hover:text-primary transition-colors">
                        {book.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                    <Badge className="mt-1 text-xs">
                      <IndianRupee className="w-3 h-3" />
                      {book.priceAmount}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleBuy(book.id, book.title, book.priceAmount)}
                      disabled={payingBookId === book.id}
                    >
                      {payingBookId === book.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Buy Now"
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart.mutate(book.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between pt-6 border-t border-border">
                <span className="text-lg font-medium text-foreground">Total</span>
                <span className="text-lg font-medium text-foreground flex items-center">
                  <IndianRupee className="w-4 h-4" />
                  {total}
                </span>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
