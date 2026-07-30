import { useMemo } from "react";
import DashboardCard from "../components/dashboard/DashboardCard";
import StockSummary from "../components/inventory/StockSummary";
import { getData } from "../services/storage/storageService";

function Dashboard() {
  const products = useMemo(() => getData("products"), []);

  const customers = useMemo(() => getData("customers"), []);

  const suppliers = useMemo(() => getData("suppliers"), []);

  const sales = useMemo(() => getData("sales"), []);

  const purchases = useMemo(() => getData("purchases"), []);

  const expenses = useMemo(() => getData("expenses"), []);

  const payments = useMemo(() => getData("payments"), []);

  const inventoryValue = products.reduce(
    (t, p) => t + Number(p.quantity || 0) * Number(p.costPrice || p.cp || 0),
    0,
  );

  const totalSales = sales.reduce((t, s) => t + Number(s.grandTotal || 0), 0);

  const totalPurchases = purchases.reduce(
    (t, p) => t + Number(p.grandTotal || 0),
    0,
  );

  const totalExpenses = expenses.reduce((t, e) => t + Number(e.amount || 0), 0);

  const totalPayments = payments.reduce((t, p) => t + Number(p.amount || 0), 0);

  const profit = totalSales - totalPurchases - totalExpenses;

  return (
    <div>
      <h1>Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginTop: "25px",
        }}
      >
        <DashboardCard title="Products" value={products.length} />

        <DashboardCard title="Customers" value={customers.length} />

        <DashboardCard title="Suppliers" value={suppliers.length} />

        <DashboardCard title="Sales" value={sales.length} />

        <DashboardCard title="Purchases" value={purchases.length} />

        <DashboardCard title="Payments" value={payments.length} />

        <DashboardCard
          title="Inventory Value"
          value={`Rs. ${inventoryValue.toFixed(2)}`}
        />

        <DashboardCard
          title="Sales Amount"
          value={`Rs. ${totalSales.toFixed(2)}`}
        />

        <DashboardCard
          title="Purchase Amount"
          value={`Rs. ${totalPurchases.toFixed(2)}`}
        />

        <DashboardCard
          title="Expenses"
          value={`Rs. ${totalExpenses.toFixed(2)}`}
        />

        <DashboardCard
          title="Cash Flow"
          value={`Rs. ${totalPayments.toFixed(2)}`}
        />

        <DashboardCard
          title="Estimated Profit"
          value={`Rs. ${profit.toFixed(2)}`}
        />
      </div>

      {/* <div style={{ marginTop: "40px" }}>
        <StockSummary />
      </div> */}
    </div>
  );
}

export default Dashboard;
