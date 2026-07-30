import { useMemo } from "react";
import { getData } from "../services/storage/storageService";

function BankBook() {
  const paymentIn = useMemo(() => getData("payment_in"), []);

  const paymentOut = useMemo(() => getData("payment_out"), []);

  const rows = [];

  paymentIn.forEach((item) => {
    if (
      item.method === "Bank Transfer" ||
      item.method === "Cheque" ||
      item.method === "QR Payment"
    ) {
      rows.push({
        id: "IN" + item.id,

        date: item.date,

        particulars: item.customer,

        reference: item.reference,

        deposit: Number(item.amount),

        withdraw: 0,
      });
    }
  });

  paymentOut.forEach((item) => {
    if (
      item.method === "Bank Transfer" ||
      item.method === "Cheque" ||
      item.method === "QR Payment"
    ) {
      rows.push({
        id: "OUT" + item.id,

        date: item.date,

        particulars: item.supplier,

        reference: item.reference,

        deposit: 0,

        withdraw: Number(item.amount),
      });
    }
  });

  rows.sort((a, b) => new Date(a.date) - new Date(b.date));

  let balance = 0;

  return (
    <div>
      <h1>Bank Book</h1>

      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>

            <th>Particulars</th>

            <th>Reference</th>

            <th>Deposit</th>

            <th>Withdraw</th>

            <th>Balance</th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan="6">No Bank Transactions</td>
            </tr>
          ) : (
            rows.map((row) => {
              balance += row.deposit;

              balance -= row.withdraw;

              return (
                <tr key={row.id}>
                  <td>{row.date}</td>

                  <td>{row.particulars}</td>

                  <td>{row.reference}</td>

                  <td>{row.deposit > 0 ? row.deposit.toFixed(2) : "-"}</td>

                  <td>{row.withdraw > 0 ? row.withdraw.toFixed(2) : "-"}</td>

                  <td>{balance.toFixed(2)}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BankBook;
