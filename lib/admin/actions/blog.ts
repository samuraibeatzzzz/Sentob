"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const postSchema = z.object({
  slug: z.string().trim().min(2).regex(/^[a-z0-9-]+$/, "Faqat kichik harflar, raqamlar, tire"),
  title: z.string().trim().min(2),
  title_ru: z.string().trim().optional().or(z.literal("")),
  title_en: z.string().trim().optional().or(z.literal("")),
  excerpt: z.string().trim().optional().or(z.literal("")),
  content: z.string().trim().min(20),
  cover_image: z.string().trim().optional().or(z.literal("")),
  author_name: z.string().trim().min(2),
  meta_title: z.string().trim().optional().or(z.literal("")),
  meta_description: z.string().trim().optional().or(z.literal("")),
  is_published: z.boolean(),
});

function parse(formData: FormData) {
  return postSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    title_ru: formData.get("title_ru") ?? "",
    title_en: formData.get("title_en") ?? "",
    excerpt: formData.get("excerpt") ?? "",
    content: formData.get("content"),
    cover_image: formData.get("cover_image") ?? "",
    author_name: formData.get("author_name"),
    meta_title: formData.get("meta_title") ?? "",
    meta_description: formData.get("meta_description") ?? "",
    is_published: formData.get("is_published") === "on",
  });
}

export async function createBlogPostAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("blog_posts").insert({
    ...parsed.data,
    title_ru: parsed.data.title_ru || null,
    title_en: parsed.data.title_en || null,
    excerpt: parsed.data.excerpt || null,
    cover_image: parsed.data.cover_image || null,
    meta_title: parsed.data.meta_title || null,
    meta_description: parsed.data.meta_description || null,
    published_at: parsed.data.is_published ? new Date().toISOString() : null,
  });

  if (error) return { error: error.code === "23505" ? "Bu slug band" : error.message };

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function updateBlogPostAction(
  postId: string,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = createSupabaseAdminClient();

  const { data: existing } = await supabase
    .from("blog_posts")
    .select("published_at")
    .eq("id", postId)
    .maybeSingle();

  const { error } = await supabase
    .from("blog_posts")
    .update({
      ...parsed.data,
      title_ru: parsed.data.title_ru || null,
      title_en: parsed.data.title_en || null,
      excerpt: parsed.data.excerpt || null,
      cover_image: parsed.data.cover_image || null,
      meta_title: parsed.data.meta_title || null,
      meta_description: parsed.data.meta_description || null,
      published_at: parsed.data.is_published ? existing?.published_at ?? new Date().toISOString() : null,
    })
    .eq("id", postId);

  if (error) return { error: error.message };

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPostAction(postId: string) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", postId);
  if (error) return { error: error.message };
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true };
}
