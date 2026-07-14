import React from "react";
import Navbar from "./MyComponents/Navbar"; // Header
import Footer from "./MyComponents/Footer"; // Footer

function App() {
  const layoutStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh", // Forces the layout to span the full screen height
  };

  return (
    <div style={layoutStyle}>
      {/* 1. Header (Navbar) */}
      <Navbar />

      {/* 2. Main content area (grows to push footer down) */}
      <main className="container my-5 flex-grow-1">
        <div className="card shadow-sm border-0 p-4">
          <h2 style={{ color: "var(--primary-dark)" }}>
            Welcome to Pragyan IMS
          </h2>
          <p className="text-muted">
            This is your workspace. Your header and footer are now locked in
            with your custom brand color scheme.
          </p>
        </div>
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
}

export default App;
