import {
  createRootRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export const Route = createRootRoute({
  component: function RootLayout() {
    const pathname = useRouterState({ select: (s) => s.location.pathname });
    const showFooter = !pathname.startsWith("/recipes/generate");

    return (
      <div
        style={{ display: "flex", flexDirection: "column", height: "100dvh" }}
      >
        <Navbar />
        <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Outlet />
        </main>
        {showFooter && <Footer />}
      </div>
    );
  },
});
