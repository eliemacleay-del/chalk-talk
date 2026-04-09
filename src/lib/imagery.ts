/**
 * Curated football imagery from Unsplash.
 * All photos are CC0 / Unsplash license — free to use commercially.
 * We use direct CDN URLs with specific crops for predictable layout.
 */

export const imagery = {
  // Hero candidates — full bleed, dramatic, "command center" energy
  hero: {
    helmet: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=1600&q=80", // football under lights
    stadium: "https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?auto=format&fit=crop&w=1600&q=80", // stadium night
    huddle: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80", // players huddle
  },

  // Backdrop candidates — subtle, used at low opacity behind cards
  backdrop: {
    field: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=70", // field turf
    chalkboard: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=70", // dark chalkboard
    locker: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=1200&q=70", // locker room
  },
};
