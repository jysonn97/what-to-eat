import "@/styles/globals.css";
import { Inter } from "next/font/google";

// ✅ Load Inter with extra-light weight (200) included
const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export default function App({ Component, pageProps }) {
  return (
    <main className={`${inter.className} min-h-screen bg-white`}>
      <Component {...pageProps} />
    </main>
  );
}
