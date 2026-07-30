import { useMemo } from "react";
import {
  getCashBook,
  getCashBalance,
} from "../services/finance/cashBookService";

function CashBook() {
  const rows = useMemo(() => getCashBook(), []);

  let runningBalance = 0;

  return (
    <div>
      <h1>Cash Book</h1>

      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          background: "#fff",
          borderRadius: "8px",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        Current Cash Balance : Rs. {getCashBalance().toFixed(2)}
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>

            <th>Type</th>

            <th>Particulars</th>

            <th>Reference</th>

            <th>Cash In</th>

            <th>Cash Out</th>

            <th>Balance</th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan="7">No Cash Transactions</td>
            </tr>
          ) : (
            rows.map((row) => {
              runningBalance +=
                Number(row.cashIn || 0) - Number(row.cashOut || 0);

              return (
                <tr key={row.id}>
                  <td>{row.date}</td>

                  <td>{row.type}</td>

                  <td>{row.particulars}</td>

                  <td>{row.reference}</td>

                  <td>{row.cashIn > 0 ? row.cashIn.toFixed(2) : "-"}</td>

                  <td>{row.cashOut > 0 ? row.cashOut.toFixed(2) : "-"}</td>

                  <td>{runningBalance.toFixed(2)}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CashBook;
