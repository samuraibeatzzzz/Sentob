import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { BlogPostRow } from "@/types/database";

export async function getPublishedPosts(): Promise<BlogPostRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("getPublishedPosts error:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getPostBySlug(slug: string): Promise<BlogPostRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("getPostBySlug error:", error.message);
    return null;
  }

  return data;
}
