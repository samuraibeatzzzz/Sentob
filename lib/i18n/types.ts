export type Dictionary = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    about: string;
    attractions: string;
    guestHouses: string;
    gallery: string;
    events: string;
    tour: string;
    blog: string;
    contact: string;
    bookNow: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    tagline: string;
    description: string;
    badges: {
      award: string;
      awardBy: string;
      eco: string;
      sustainable: string;
    };
    ctaPrimary: string;
    ctaSecondary: string;
    scroll: string;
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    stats: { value: string; label: string }[];
  };
  attractions: {
    eyebrow: string;
    title: string;
    items: { title: string; text: string }[];
    more: string;
  };
  experiences: {
    eyebrow: string;
    title: string;
    items: { title: string; text: string }[];
    book: string;
  };
  guestHouses: {
    eyebrow: string;
    title: string;
    all: string;
    perNight: string;
    book: string;
  };
  map: {
    title: string;
    description: string;
    open: string;
  };
  footer: {
    about: string;
    links: string;
    linksList: string[];
    contact: string;
    location: string;
    newsletter: string;
    newsletterText: string;
    emailPlaceholder: string;
    rights: string;
  };
};
