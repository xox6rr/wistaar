import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Purchase {
  id: string;
  book_id: string;
  amount: number;
  payment_status: string;
  purchased_at: string;
}

export function usePurchases() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["purchases", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Purchase[]> => {
      const { data, error } = await supabase
        .from("book_purchases")
        .select("id, book_id, amount, payment_status, purchased_at")
        .eq("user_id", user!.id)
        .eq("payment_status", "completed");

      if (error) throw error;
      return (data || []) as Purchase[];
    },
  });
}

export function useHasPurchased(bookId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["has-purchased", user?.id, bookId],
    enabled: !!user && !!bookId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("book_purchases")
        .select("id")
        .eq("user_id", user!.id)
        .eq("book_id", bookId!)
        .eq("payment_status", "completed")
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
  });
}

export function useInitiatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookId,
      bookTitle,
      amount,
    }: {
      bookId: string;
      bookTitle: string;
      amount: number;
    }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Please log in to purchase");

      const returnUrl = `${window.location.origin}/book/${bookId}`;

      const response = await supabase.functions.invoke("payu-payment/initiate", {
        body: { bookId, bookTitle, amount, returnUrl },
      });

      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
  });
}
