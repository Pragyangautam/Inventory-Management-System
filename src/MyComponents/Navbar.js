import React from "react";
import { FaBoxes, FaSignOutAlt } from "react-icons/fa";

function Navbar() {
  const navbarStyle = {
    backgroundColor: "#1e293b",
    borderBottom: "1px solid #e2e8f0",
    padding: "12px 24px",
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={navbarStyle}>
      {/* Brand Logo & Name */}
      <a className="navbar-brand d-flex align-items-center" href="#dashboard">
        <FaBoxes className="me-2" style={{ color: "#0ea5e9" }} size={24} />
        <span className="fw-bold text-white">Pragyan IMS</span>
      </a>

      {/* User Info & Logout */}
      <div className="ms-auto d-flex align-items-center">
        <span className="text-light me-3 d-none d-sm-inline">
          Welcome, <strong>Admin</strong>
        </span>
        <button
          className="btn btn-sm text-white d-flex align-items-center"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            border: "none",
          }}
        >
          <FaSignOutAlt className="me-1" /> Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
