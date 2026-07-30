import { useMemo } from "react";
import { getData } from "../services/storage/storageService";

function BalanceSheet() {
  const products = useMemo(() => getData("products"), []);
  const paymentIn = useMemo(() => getData("payment_in"), []);
  const paymentOut = useMemo(() => getData("payment_out"), []);
  const expenses = useMemo(() => getData("expenses"), []);

  const inventory = products.reduce(
    (t, p) => t + Number(p.quantity || 0) * Number(p.costPrice || p.cp || 0),
    0,
  );

  const cash =
    paymentIn.reduce((t, p) => t + Number(p.amount || 0), 0) -
    paymentOut.reduce((t, p) => t + Number(p.amount || 0), 0) -
    expenses.reduce((t, p) => t + Number(p.amount || 0), 0);

  const assets = inventory + cash;

  return (
    <div>
      <h1>Balance Sheet</h1>

      <table className="data-table">
        <tbody>
          <tr>
            <th colSpan="2">Assets</th>
          </tr>

          <tr>
            <td>Cash</td>

            <td>{cash.toFixed(2)}</td>
          </tr>

          <tr>
            <td>Inventory</td>

            <td>{inventory.toFixed(2)}</td>
          </tr>

          <tr>
            <th>Total Assets</th>

            <th>{assets.toFixed(2)}</th>
          </tr>

          <tr>
            <th colSpan="2">Liabilities & Equity</th>
          </tr>

          <tr>
            <td>Owner Equity</td>

            <td>{assets.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default BalanceSheet;
