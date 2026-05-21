export interface VideoItem {
  id: string;
  title: string;
}

export interface GallerySection {
  key: "prewedding" | "wedding" | "rice-ceremony";
  label: string;
  accent: string;
  videos: VideoItem[];
}

// Used by video.tsx (homepage section) — DO NOT MODIFY
export const VIDEOS: VideoItem[] = [
  { id: "47BlYNv9hxI", title: "Featured Film 01" },
  { id: "lB8IUS79qxo", title: "Featured Film 02" },
  { id: "9ODOJXe7QnE", title: "Featured Film 03" },
  { id: "8fAOvHMAAPo", title: "Featured Film 04" },
];

// ─── Gallery sections ────────────────────────────────────────────────────────

export const PREWEDDING_VIDEOS: VideoItem[] = [
  { id: "47BlYNv9hxI",  title: "Prewedding Film 01" },
  { id: "lB8IUS79qxo",  title: "Prewedding Film 02" },
  { id: "crs4YDgUpTs",  title: "Prewedding Film 03" },
  { id: "EDSuB5pgLb0",  title: "Prewedding Film 04" },
  { id: "xu729_VFOaU",  title: "Prewedding Film 05" },
  { id: "8yjuPb_CbmI",  title: "Prewedding Film 06" },
  { id: "SQnJLiv4RhE",  title: "Prewedding Film 07" },
  { id: "8DY1KhKrp4I",  title: "Prewedding Film 08" },
  { id: "MV5pVy88sX8",  title: "Prewedding Film 09" },
  { id: "g8eX5YXZf-k",  title: "Prewedding Film 10" },
  { id: "DnHys9aEW5o",  title: "Prewedding Film 11" },
];

export const WEDDING_VIDEOS: VideoItem[] = [
  { id: "9ODOJXe7QnE",  title: "Wedding Film 01" },
  { id: "TlBIIOMctxY",  title: "Wedding Film 02" },
  { id: "8j0D5cYpC48",  title: "Wedding Film 03" },
  { id: "8fAOvHMAAPo",  title: "Wedding Film 04" },
  { id: "9TcxAh44B1o",  title: "Wedding Film 05" },
  { id: "Q9qgaD_Bfm4",  title: "Wedding Film 06" },
  { id: "FmGezdnVyQY",  title: "Wedding Film 07" },
  { id: "lrTLWOaRmyU",  title: "Wedding Film 08" },
];

export const RICE_CEREMONY_VIDEOS: VideoItem[] = [
  { id: "U6lFHs4ZzQ0",  title: "Rice Ceremony Film 01" },
  { id: "oYEJe10TpaI",  title: "Rice Ceremony Film 02" },
  { id: "0_OR6O-Jx6s",  title: "Rice Ceremony Film 03" },
  { id: "vM5J03L3Ms4",  title: "Rice Ceremony Film 04" },
];

/** Ordered sections used by VideoGallery page */
export const GALLERY_SECTIONS: GallerySection[] = [
  {
    key: "prewedding",
    label: "Prewedding",
    accent: "#c9a96e",          // warm gold
    videos: PREWEDDING_VIDEOS,
  },
  {
    key: "wedding",
    label: "Wedding",
    accent: "#b07d5c",          // dusty rose-bronze
    videos: WEDDING_VIDEOS,
  },
  {
    key: "rice-ceremony",
    label: "Rice Ceremony",
    accent: "#8fac88",          // sage green
    videos: RICE_CEREMONY_VIDEOS,
  },
];

// Legacy flat array kept for any existing consumers
export const GALLERY_VIDEOS: VideoItem[] = [
  ...PREWEDDING_VIDEOS,
  ...WEDDING_VIDEOS,
  ...RICE_CEREMONY_VIDEOS,
];