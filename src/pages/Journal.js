import { useMemo } from "react";
import { getData } from "../services/storage/storageService";

function Journal() {
  const paymentIn = useMemo(() => getData("payment_in"), []);
  const paymentOut = useMemo(() => getData("payment_out"), []);
  const expenses = useMemo(() => getData("expenses"), []);

  const rows = [];

  paymentIn.forEach((item) => {
    rows.push({
      id: "PI" + item.id,
      date: item.date,
      voucher: item.receiptNo,
      debit: "Cash / Bank",
      credit: "Customer",
      amount: Number(item.amount),
      remarks: "Customer Payment",
    });
  });

  paymentOut.forEach((item) => {
    rows.push({
      id: "PO" + item.id,
      date: item.date,
      voucher: item.voucherNo,
      debit: "Supplier",
      credit: "Cash / Bank",
      amount: Number(item.amount),
      remarks: "Supplier Payment",
    });
  });

  expenses.forEach((item) => {
    rows.push({
      id: "EX" + item.id,
      date: item.date,
      voucher: item.id,
      debit: item.head,
      credit: "Cash / Bank",
      amount: Number(item.amount),
      remarks: "Expense",
    });
  });

  rows.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <h1>Journal Voucher</h1>

      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Voucher</th>
            <th>Debit Account</th>
            <th>Credit Account</th>
            <th>Amount</th>
            <th>Remarks</th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan="6">No Journal Entries</td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                <td>{row.date}</td>

                <td>{row.voucher}</td>

                <td>{row.debit}</td>

                <td>{row.credit}</td>

                <td>{row.amount.toFixed(2)}</td>

                <td>{row.remarks}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Journal;
