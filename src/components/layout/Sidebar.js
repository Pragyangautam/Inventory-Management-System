import { NavLink } from "react-router-dom";

import {
  FaTachometerAlt,
  FaBoxes,
  FaTags,
  FaTrademark,
  FaBalanceScale,
  FaWarehouse,
  FaCodeBranch,
  FaMoneyBillWave,
  FaBoxOpen,
  FaShoppingCart,
  FaCashRegister,
  FaUsers,
  FaTruck,
  FaUserTie,
  FaBuilding,
  FaMoneyCheckAlt,
  FaReceipt,
  FaChartLine,
  FaFileInvoiceDollar,
  FaCog,
} from "react-icons/fa";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>ERP</h2>
        <p>Inventory Management</p>
      </div>

      <nav>
        <NavLink to="/" className="nav-item">
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <h4 className="menu-title">MASTER DATA</h4>

        <NavLink to="/categories" className="nav-item">
          <FaTags />
          <span>Categories</span>
        </NavLink>

        <NavLink to="/brands" className="nav-item">
          <FaTrademark />
          <span>Brands</span>
        </NavLink>

        <NavLink to="/units" className="nav-item">
          <FaBalanceScale />
          <span>Units</span>
        </NavLink>

        <NavLink to="/tax-rates" className="nav-item">
          <FaMoneyBillWave />
          <span>Tax Rates</span>
        </NavLink>

        <NavLink to="/warehouses" className="nav-item">
          <FaWarehouse />
          <span>Warehouses</span>
        </NavLink>

        <NavLink to="/branches" className="nav-item">
          <FaCodeBranch />
          <span>Branches</span>
        </NavLink>

        <NavLink to="/price-levels" className="nav-item">
          <FaMoneyBillWave />
          <span>Price Levels</span>
        </NavLink>

        <NavLink to="/products" className="nav-item">
          <FaBoxes />
          <span>Products</span>
        </NavLink>

        <h4 className="menu-title">OPERATIONS</h4>

        <NavLink to="/purchases" className="nav-item">
          <FaShoppingCart />
          <span>Purchases</span>
        </NavLink>

        <NavLink to="/sales" className="nav-item">
          <FaCashRegister />
          <span>Sales</span>
        </NavLink>

        <NavLink to="/payments" className="nav-item">
          <FaMoneyCheckAlt />
          <span>Payments</span>
        </NavLink>

        <NavLink to="/expenses" className="nav-item">
          <FaReceipt />
          <span>Expenses</span>
        </NavLink>

        <h4 className="menu-title">PARTIES</h4>

        <NavLink to="/customers" className="nav-item">
          <FaUsers />
          <span>Customers</span>
        </NavLink>

        <NavLink to="/suppliers" className="nav-item">
          <FaTruck />
          <span>Suppliers</span>
        </NavLink>

        <NavLink to="/staff" className="nav-item">
          <FaUserTie />
          <span>Staff</span>
        </NavLink>

        <h4 className="menu-title">ACCOUNTING</h4>

        <NavLink to="/assets" className="nav-item">
          <FaBuilding />
          <span>Assets</span>
        </NavLink>

        <NavLink to="/accounting" className="nav-item">
          <FaFileInvoiceDollar />
          <span>Accounting</span>
        </NavLink>

        <NavLink to="/reports" className="nav-item">
          <FaChartLine />
          <span>Reports</span>
        </NavLink>

        <h4 className="menu-title">SYSTEM</h4>

        <NavLink to="/settings" className="nav-item">
          <FaCog />
          <span>Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
