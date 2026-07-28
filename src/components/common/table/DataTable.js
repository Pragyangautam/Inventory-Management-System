function DataTable({ columns, data }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length}>No Records Found</td>
          </tr>
        ) : (
          data.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column}>{row[column.toLowerCase()] || "-"}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default DataTable;
