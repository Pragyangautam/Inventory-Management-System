import DashboardCard from "../components/dashboard/DashboardCard";

function Dashboard() {
  const cards = [
    { title: "Inventory", value: "2,150 Items", color: "#2563eb" },
    { title: "Today's Sales", value: "Rs. 0.00", color: "#16a34a" },
    { title: "Today's Purchase", value: "Rs. 0.00", color: "#ea580c" },
    { title: "Customers", value: "0", color: "#9333ea" },
    { title: "Suppliers", value: "0", color: "#0891b2" },
    { title: "Staff", value: "0", color: "#dc2626" },
    { title: "Assets", value: "Rs. 0.00", color: "#ca8a04" },
    { title: "Receivable", value: "Rs. 0.00", color: "#0284c7" },
    { title: "Payable", value: "Rs. 0.00", color: "#be123c" },
    { title: "Cash in Hand", value: "Rs. 0.00", color: "#15803d" },
    { title: "Expenses", value: "Rs. 0.00", color: "#7c3aed" },
    { title: "Low Stock", value: "0 Items", color: "#b91c1c" },
  ];

  return (
    <>
      <h1>Dashboard</h1>

      <div className="dashboard-grid">
        {cards.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            value={card.value}
            color={card.color}
          />
        ))}
      </div>
    </>
  );
}

export default Dashboard;
