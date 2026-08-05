export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: "Sentob",
    description:
      "Sentob — UN Tourism tomonidan 2023-yilda dunyodagi eng yaxshi turizm qishloqlaridan biri deb topilgan, Navoiy viloyati Nurota tumanida joylashgan noyob tog' qishlog'i.",
    url: "https://sentob.uz",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sentob",
      addressRegion: "Navoiy viloyati",
      addressCountry: "UZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.65,
      longitude: 66.85,
    },
    touristType: ["Eco tourism", "Mountain tourism", "Cultural tourism"],
    image: "https://sentob.uz/images/og-cover.jpg",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
