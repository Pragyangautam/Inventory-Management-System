import React from "react";

function Footer() {
  const footerStyle = {
    backgroundColor: "#1e293b", // Direct slate hex fallback
    borderTop: "1px solid #e2e8f0",
    color: "#94a3b8",
    padding: "15px 0",
  };

  return (
    <footer style={footerStyle} className="text-center mt-auto">
      <div className="container">
        <span className="small">
          &copy; {new Date().getFullYear()} <strong>Pragyan IMS</strong>. All
          Rights Reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
