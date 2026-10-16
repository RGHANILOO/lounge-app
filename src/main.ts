// Import styles and main app component
import "./styles/themes.css";
import "./components/bartender-app";

// Optional: Service Worker registration for PWA offline support
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    // Add 'void' before navigator.serviceWorker.register
    void navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("Service worker registration failed:", err);
    });
  });
}
