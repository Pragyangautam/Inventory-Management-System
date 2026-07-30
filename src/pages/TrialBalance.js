import { useMemo } from "react";
import { getData } from "../services/storage/storageService";

function TrialBalance() {
  const paymentIn = useMemo(() => getData("payment_in"), []);
  const paymentOut = useMemo(() => getData("payment_out"), []);
  const expenses = useMemo(() => getData("expenses"), []);

  const cashDebit = paymentIn.reduce((t, x) => t + Number(x.amount || 0), 0);

  const cashCredit =
    paymentOut.reduce((t, x) => t + Number(x.amount || 0), 0) +
    expenses.reduce((t, x) => t + Number(x.amount || 0), 0);

  const customerCredit = cashDebit;

  const supplierDebit = paymentOut.reduce(
    (t, x) => t + Number(x.amount || 0),
    0,
  );

  const expenseDebit = expenses.reduce((t, x) => t + Number(x.amount || 0), 0);

  const rows = [
    {
      account: "Cash / Bank",
      debit: cashDebit,
      credit: cashCredit,
    },

    {
      account: "Customer",
      debit: 0,
      credit: customerCredit,
    },

    {
      account: "Supplier",
      debit: supplierDebit,
      credit: 0,
    },

    {
      account: "Expenses",
      debit: expenseDebit,
      credit: 0,
    },
  ];

  const totalDebit = rows.reduce((t, r) => t + r.debit, 0);

  const totalCredit = rows.reduce((t, r) => t + r.credit, 0);

  return (
    <div>
      <h1>Trial Balance</h1>

      <table className="data-table">
        <thead>
          <tr>
            <th>Account</th>

            <th>Debit</th>

            <th>Credit</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{row.account}</td>

              <td>{row.debit.toFixed(2)}</td>

              <td>{row.credit.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <th>Total</th>

            <th>{totalDebit.toFixed(2)}</th>

            <th>{totalCredit.toFixed(2)}</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default TrialBalance;
