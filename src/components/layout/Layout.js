import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="app">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
