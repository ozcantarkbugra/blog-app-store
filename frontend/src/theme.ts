import { createTheme } from "@mantine/core";

/**
 * Tema ve font ayarlari:
 * - fontFamily: Tum metinler (paragraf, buton vb.)
 * - headings.fontFamily: Basliklar (h1-h6). Vermezsen fontFamily kullanilir.
 * - Font degistirmek icin: 1) index.html'e Google Font linki ekleyin,
 *   2) Bu dosyada fontFamily ve headings.fontFamily'a yeni font adini yazin (tek tirnak icinde).
 * Ornek: 'Inter', 'Outfit', 'DM Sans' vb.
 */
export const theme = createTheme({
  fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
  headings: {
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
  },
  primaryColor: "blue",
  defaultRadius: "md",
});
