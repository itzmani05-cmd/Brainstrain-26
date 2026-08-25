import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollProgress from "./ScrollProgress";

export default function PublicLayout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-bs-black">
      <ScrollProgress />
      <Navbar />
      <main key={pathname} className="animate-page-in flex-1">
        {children}
      </main>
      {pathname === "/" && <Footer />}
    </div>
  );
}
