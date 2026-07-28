import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Categories from "../pages/Categories";
import Brands from "../pages/Brands";
import Units from "../pages/Units";
import TaxRates from "../pages/TaxRates";
import Warehouses from "../pages/Warehouses";
import Branches from "../pages/Branches";
import PriceLevels from "../pages/PriceLevels";

import Customers from "../pages/Customers";
import Suppliers from "../pages/Suppliers";
import Staff from "../pages/Staff";

import Purchases from "../pages/Purchases";
import Sales from "../pages/Sales";

import Payments from "../pages/Payments";
import Expenses from "../pages/Expenses";
import Assets from "../pages/Assets";

import Accounting from "../pages/Accounting";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route path="/products" element={<Products />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/brands" element={<Brands />} />
      <Route path="/units" element={<Units />} />
      <Route path="/tax-rates" element={<TaxRates />} />
      <Route path="/warehouses" element={<Warehouses />} />
      <Route path="/branches" element={<Branches />} />
      <Route path="/price-levels" element={<PriceLevels />} />

      <Route path="/customers" element={<Customers />} />
      <Route path="/suppliers" element={<Suppliers />} />
      <Route path="/staff" element={<Staff />} />

      <Route path="/purchases" element={<Purchases />} />
      <Route path="/sales" element={<Sales />} />

      <Route path="/payments" element={<Payments />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/assets" element={<Assets />} />

      <Route path="/accounting" element={<Accounting />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default AppRoutes;
