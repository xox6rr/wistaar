import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useIsAuthor() {
  const { user } = useAuth();
  const [isAuthor, setIsAuthor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsAuthor(false);
      setLoading(false);
      return;
    }

    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "author")
      .then(({ data }) => {
        setIsAuthor(!!data && data.length > 0);
        setLoading(false);
      });
  }, [user]);

  return { isAuthor, loading };
}
