import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  const isLocal = process.env.NODE_ENV !== "production";

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              console.log("[Supabase Server setAll Cookie]:", name, "val len:", value?.length, "opts:", options);
              cookieStore.set(name, value, {
                ...options,
                path: "/",
                secure: false,
              });
            });
          } catch (err) {
            console.error("[Supabase Server setAll Error]:", err);
          }
        },
      },
    }
  );
}
