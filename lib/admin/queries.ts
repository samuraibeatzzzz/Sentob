import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { GuestHouseRow, GalleryItemRow, EventRow, BlogPostRow, ReviewRow, ProfileRow } from "@/types/database";

export async function getDashboardStats() {
  const supabase = createSupabaseAdminClient();

  const [bookings, pendingBookings, guestHouses, reviews, posts, events] = await Promise.all([
    supabase.from("bookings").select("id, total_price, status", { count: "exact" }),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("guest_houses").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("reviews").select("id", { count: "exact", head: true }),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("events").select("id", { count: "exact", head: true }).eq("is_published", true),
  ]);

  const confirmedRevenue = (bookings.data ?? [])
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + Number(b.total_price), 0);

  return {
    totalBookings: bookings.count ?? 0,
    pendingBookings: pendingBookings.count ?? 0,
    activeGuestHouses: guestHouses.count ?? 0,
    totalReviews: reviews.count ?? 0,
    publishedPosts: posts.count ?? 0,
    publishedEvents: events.count ?? 0,
    confirmedRevenue,
  };
}

export async function getAllGuestHousesAdmin(): Promise<GuestHouseRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("guest_houses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllGuestHousesAdmin error:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getGuestHouseByIdAdmin(id: string): Promise<GuestHouseRow | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("guest_houses").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("getGuestHouseByIdAdmin error:", error.message);
    return null;
  }

  return data;
}

export async function getAllGalleryItemsAdmin(): Promise<GalleryItemRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getAllGalleryItemsAdmin error:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getAllEventsAdmin(): Promise<EventRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("events").select("*").order("start_date", { ascending: false });

  if (error) {
    console.error("getAllEventsAdmin error:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getEventByIdAdmin(id: string): Promise<EventRow | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("events").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("getEventByIdAdmin error:", error.message);
    return null;
  }

  return data;
}

export async function getAllBlogPostsAdmin(): Promise<BlogPostRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllBlogPostsAdmin error:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getBlogPostByIdAdmin(id: string): Promise<BlogPostRow | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("getBlogPostByIdAdmin error:", error.message);
    return null;
  }

  return data;
}

export async function getAllReviewsAdmin(): Promise<ReviewRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("reviews").select("*").order("review_date", { ascending: false });

  if (error) {
    console.error("getAllReviewsAdmin error:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getAllProfilesAdmin(): Promise<ProfileRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });

  if (error) {
    console.error("getAllProfilesAdmin error:", error.message);
    return [];
  }

  return data ?? [];
}
