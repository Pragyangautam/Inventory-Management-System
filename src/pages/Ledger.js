import { useMemo, useState } from "react";
import { getData } from "../services/storage/storageService";

function Ledger() {
  const [account, setAccount] = useState("Cash / Bank");

  const paymentIn = useMemo(() => getData("payment_in"), []);
  const paymentOut = useMemo(() => getData("payment_out"), []);
  const expenses = useMemo(() => getData("expenses"), []);

  const ledger = [];

  paymentIn.forEach((item) => {
    if (account === "Cash / Bank") {
      ledger.push({
        id: "PI" + item.id,
        date: item.date,
        particulars: "Customer Payment",
        debit: Number(item.amount),
        credit: 0,
      });
    }

    if (account === "Customer") {
      ledger.push({
        id: "PIC" + item.id,
        date: item.date,
        particulars: item.customer,
        debit: 0,
        credit: Number(item.amount),
      });
    }
  });

  paymentOut.forEach((item) => {
    if (account === "Cash / Bank") {
      ledger.push({
        id: "PO" + item.id,
        date: item.date,
        particulars: "Supplier Payment",
        debit: 0,
        credit: Number(item.amount),
      });
    }

    if (account === "Supplier") {
      ledger.push({
        id: "POS" + item.id,
        date: item.date,
        particulars: item.supplier,
        debit: Number(item.amount),
        credit: 0,
      });
    }
  });

  expenses.forEach((item) => {
    if (account === "Cash / Bank") {
      ledger.push({
        id: "EX" + item.id,
        date: item.date,
        particulars: item.head,
        debit: 0,
        credit: Number(item.amount),
      });
    }

    if (account === item.head) {
      ledger.push({
        id: "EXP" + item.id,
        date: item.date,
        particulars: item.head,
        debit: Number(item.amount),
        credit: 0,
      });
    }
  });

  ledger.sort((a, b) => new Date(a.date) - new Date(b.date));

  let balance = 0;

  return (
    <div>
      <h1>General Ledger</h1>

      <div style={{ marginBottom: "20px" }}>
        <select
          className="form-control"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
        >
          <option>Cash / Bank</option>

          <option>Customer</option>

          <option>Supplier</option>

          <option>Electricity</option>

          <option>Rent</option>

          <option>Salary</option>

          <option>Fuel</option>

          <option>Office Expense</option>
        </select>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>

            <th>Particulars</th>

            <th>Debit</th>

            <th>Credit</th>

            <th>Balance</th>
          </tr>
        </thead>

        <tbody>
          {ledger.length === 0 ? (
            <tr>
              <td colSpan="5">No Ledger Entries</td>
            </tr>
          ) : (
            ledger.map((row) => {
              balance += Number(row.debit);

              balance -= Number(row.credit);

              return (
                <tr key={row.id}>
                  <td>{row.date}</td>

                  <td>{row.particulars}</td>

                  <td>{row.debit > 0 ? row.debit.toFixed(2) : "-"}</td>

                  <td>{row.credit > 0 ? row.credit.toFixed(2) : "-"}</td>

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

export default Ledger;
