import { useMemo } from "react";
import { getData } from "../services/storage/storageService";

function ProfitLoss() {
  const sales = useMemo(() => getData("sales"), []);
  const purchases = useMemo(() => getData("purchases"), []);
  const expenses = useMemo(() => getData("expenses"), []);

  const salesTotal = sales.reduce((t, x) => t + Number(x.grandTotal || 0), 0);

  const purchaseTotal = purchases.reduce(
    (t, x) => t + Number(x.grandTotal || 0),
    0,
  );

  const expenseTotal = expenses.reduce((t, x) => t + Number(x.amount || 0), 0);

  const grossProfit = salesTotal - purchaseTotal;

  const netProfit = grossProfit - expenseTotal;

  return (
    <div>
      <h1>Profit & Loss Statement</h1>

      <table className="data-table">
        <tbody>
          <tr>
            <td>Total Sales</td>

            <td>{salesTotal.toFixed(2)}</td>
          </tr>

          <tr>
            <td>Total Purchase</td>

            <td>{purchaseTotal.toFixed(2)}</td>
          </tr>

          <tr>
            <td>Gross Profit</td>

            <td>{grossProfit.toFixed(2)}</td>
          </tr>

          <tr>
            <td>Total Expenses</td>

            <td>{expenseTotal.toFixed(2)}</td>
          </tr>

          <tr>
            <th>Net Profit</th>

            <th>{netProfit.toFixed(2)}</th>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ProfitLoss;
