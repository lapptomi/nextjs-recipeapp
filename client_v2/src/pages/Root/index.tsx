import { Outlet } from "@tanstack/react-router";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

export default function RootLayout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
