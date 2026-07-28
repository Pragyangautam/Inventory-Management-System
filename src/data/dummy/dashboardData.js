import {
  FaBoxes,
  FaShoppingCart,
  FaTruck,
  FaUsers,
  FaUserTie,
  FaUserFriends,
  FaMoneyBillWave,
  FaReceipt,
  FaCalculator,
  FaChartBar,
  FaBuilding,
  FaCog,
} from "react-icons/fa";

const dashboardData = [
  {
    title: "Inventory",
    description: "Products & Stock",
    icon: FaBoxes,
  },
  {
    title: "Sales",
    description: "Sales & Billing",
    icon: FaShoppingCart,
  },
  {
    title: "Purchases",
    description: "Purchase Management",
    icon: FaTruck,
  },
  {
    title: "Customers",
    description: "Customer Records",
    icon: FaUsers,
  },
  {
    title: "Suppliers",
    description: "Supplier Records",
    icon: FaUserTie,
  },
  {
    title: "Staff",
    description: "Employee Management",
    icon: FaUserFriends,
  },
  {
    title: "Assets",
    description: "Asset Register",
    icon: FaBuilding,
  },
  {
    title: "Payments",
    description: "Receive & Pay",
    icon: FaMoneyBillWave,
  },
  {
    title: "Expenses",
    description: "Expense Records",
    icon: FaReceipt,
  },
  {
    title: "Accounting",
    description: "Ledger & Reports",
    icon: FaCalculator,
  },
  {
    title: "Reports",
    description: "Business Reports",
    icon: FaChartBar,
  },
  {
    title: "Settings",
    description: "System Settings",
    icon: FaCog,
  },
];

export default dashboardData;
