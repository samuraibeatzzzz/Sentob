import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Uses the service-role key and bypasses Row Level Security.
 * Only ever import this from server-only code: Route Handlers,
 * Server Actions, or Server Components that are never bundled
 * for the client. The `server-only` import above will throw a
 * build error if this file is ever pulled into a client bundle.
 */
export function createSupabaseAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
