import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Attractions } from "@/components/home/Attractions";
import { Experiences } from "@/components/home/Experiences";
import { GuestHousesPreview } from "@/components/home/GuestHousesPreview";
import { MapPreview } from "@/components/home/MapPreview";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { WeatherWidget } from "@/components/weather/WeatherWidget";
import { JsonLd } from "@/components/JsonLd";
import { getActiveGuestHouses } from "@/lib/guest-houses/queries";
import { getPublishedReviews } from "@/lib/reviews/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [guestHouses, reviews] = await Promise.all([
    getActiveGuestHouses(),
    getPublishedReviews(),
  ]);

  return (
    <>
      <JsonLd />
      <Header />
      <main>
        <Hero />
        <About />
        <Attractions />
        <Experiences />
        <GuestHousesPreview guestHouses={guestHouses.slice(0, 4)} />
        <MapPreview />
        <section className="bg-cream-50 py-24 lg:py-32 dark:bg-forest-950">
          <div className="mx-auto max-w-3xl px-5 lg:px-8">
            <WeatherWidget />
          </div>
        </section>
        <ReviewsSection reviews={reviews} />
      </main>
      <Footer />
    </>
  );
}
