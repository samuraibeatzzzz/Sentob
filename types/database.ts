export type AppRole = "admin" | "manager" | "user";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type GalleryCategory = "nature" | "food" | "culture" | "mountains" | "events";
export type MediaType = "photo" | "video";
export type ReviewSource = "google" | "tripadvisor" | "local";

export type GuestHouseRow = {
  id: string;
  slug: string;
  name: string;
  name_ru: string | null;
  name_en: string | null;
  description: string;
  description_ru: string | null;
  description_en: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  price_per_night: number;
  max_guests: number;
  rooms: number;
  amenities: string[];
  cover_image: string | null;
  images: string[];
  rating: number;
  review_count: number;
  is_active: boolean;
  owner_id: string | null;
  created_at: string;
  updated_at: string;
};

export type BookingRow = {
  id: string;
  guest_house_id: string;
  user_id: string | null;
  guest_name: string;
  guest_phone: string;
  guest_email: string | null;
  check_in: string;
  check_out: string;
  guests: number;
  rooms: number;
  nights: number;
  price_per_night: number;
  total_price: number;
  status: BookingStatus;
  idempotency_key: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ProfileRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: AppRole;
  created_at: string;
  updated_at: string;
};

export type GalleryItemRow = {
  id: string;
  title: string | null;
  title_ru: string | null;
  title_en: string | null;
  category: GalleryCategory;
  media_type: MediaType;
  url: string;
  thumbnail_url: string | null;
  width: number | null;
  height: number | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
};

export type TourSceneRow = {
  id: string;
  slug: string;
  title: string;
  title_ru: string | null;
  title_en: string | null;
  panorama_url: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
};

export type EventRow = {
  id: string;
  slug: string;
  title: string;
  title_ru: string | null;
  title_en: string | null;
  description: string;
  description_ru: string | null;
  description_en: string | null;
  cover_image: string | null;
  start_date: string;
  end_date: string | null;
  location: string | null;
  is_recurring_yearly: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  title_ru: string | null;
  title_en: string | null;
  excerpt: string | null;
  excerpt_ru: string | null;
  excerpt_en: string | null;
  content: string;
  content_ru: string | null;
  content_en: string | null;
  cover_image: string | null;
  author_id: string | null;
  author_name: string;
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ReviewRow = {
  id: string;
  source: ReviewSource;
  author_name: string;
  author_avatar: string | null;
  rating: number;
  comment: string;
  comment_ru: string | null;
  comment_en: string | null;
  guest_house_id: string | null;
  review_date: string;
  is_published: boolean;
  created_at: string;
};

export type SiteSettingRow = {
  key: string;
  value: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      guest_houses: {
        Row: GuestHouseRow;
        Insert: Partial<GuestHouseRow>;
        Update: Partial<GuestHouseRow>;
        Relationships: [];
      };
      bookings: {
        Row: BookingRow;
        Insert: Omit<
          BookingRow,
          "id" | "nights" | "created_at" | "updated_at" | "status" | "user_id"
        > & { status?: BookingStatus; user_id?: string | null };
        Update: Partial<BookingRow>;
        Relationships: [];
      };
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow>;
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      gallery_items: {
        Row: GalleryItemRow;
        Insert: Partial<GalleryItemRow>;
        Update: Partial<GalleryItemRow>;
        Relationships: [];
      };
      tour_scenes: {
        Row: TourSceneRow;
        Insert: Partial<TourSceneRow>;
        Update: Partial<TourSceneRow>;
        Relationships: [];
      };
      events: {
        Row: EventRow;
        Insert: Partial<EventRow>;
        Update: Partial<EventRow>;
        Relationships: [];
      };
      blog_posts: {
        Row: BlogPostRow;
        Insert: Partial<BlogPostRow>;
        Update: Partial<BlogPostRow>;
        Relationships: [];
      };
      reviews: {
        Row: ReviewRow;
        Insert: Partial<ReviewRow>;
        Update: Partial<ReviewRow>;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSettingRow;
        Insert: Partial<SiteSettingRow>;
        Update: Partial<SiteSettingRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      app_role: AppRole;
      booking_status: BookingStatus;
      gallery_category: GalleryCategory;
      media_type: MediaType;
      review_source: ReviewSource;
    };
    CompositeTypes: Record<string, never>;
  };
};
