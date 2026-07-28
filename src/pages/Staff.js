import { useEffect, useState } from "react";

import SearchBar from "../components/common/search/SearchBar";
import FormModal from "../components/common/modal/FormModal";

import {
  getData,
  addData,
  updateData,
  deleteData,
} from "../services/storage/storageService";

const STORAGE_KEY = "staff";

function Staff() {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [paymentType, setPaymentType] = useState("Fixed Salary");
  const [salary, setSalary] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Active");

  useEffect(() => loadStaff(), []);

  const loadStaff = () => setStaff(getData(STORAGE_KEY));

  const reset = () => {
    setName("");
    setDepartment("");
    setDesignation("");
    setPaymentType("Fixed Salary");
    setSalary("");
    setPhone("");
    setEmail("");
    setStatus("Active");
    setEditing(false);
    setSelectedId(null);
    setShowModal(false);
  };

  const save = () => {
    if (!name.trim()) return alert("Employee Name Required");

    const employee = {
      id: selectedId,
      name,
      department,
      designation,
      paymentType,
      salary,
      phone,
      email,
      status,
    };

    if (editing) updateData(STORAGE_KEY, employee);
    else {
      delete employee.id;
      addData(STORAGE_KEY, employee);
    }

    loadStaff();
    reset();
  };

  const edit = (item) => {
    setEditing(true);
    setSelectedId(item.id);
    setName(item.name);
    setDepartment(item.department);
    setDesignation(item.designation);
    setPaymentType(item.paymentType);
    setSalary(item.salary);
    setPhone(item.phone);
    setEmail(item.email);
    setStatus(item.status);
    setShowModal(true);
  };

  return (
    <div>
      <h1>Staff Management</h1>

      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        + Add Employee
      </button>

      <br />
      <br />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search Employee..."
      />

      <table className="data-table">
        <thead>
          <tr>
            <th>SN</th>
            <th>Name</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Salary</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {staff
            .filter((x) => x.name.toLowerCase().includes(search.toLowerCase()))
            .map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.department}</td>
                <td>{item.designation}</td>
                <td>{item.salary}</td>
                <td>{item.status}</td>

                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => edit(item)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      deleteData(STORAGE_KEY, item.id);
                      loadStaff();
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {showModal && (
        <FormModal
          title={editing ? "Edit Employee" : "Add Employee"}
          onSave={save}
          onClose={reset}
        >
          <input
            className="form-control"
            placeholder="Employee Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="form-control"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <input
            className="form-control"
            placeholder="Designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />

          <select
            className="form-control"
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
          >
            <option>Fixed Salary</option>
            <option>Sales Commission</option>
            <option>Production Rate</option>
            <option>Hourly</option>
          </select>

          <input
            className="form-control"
            type="number"
            placeholder="Salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
          <input
            className="form-control"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </FormModal>
      )}
    </div>
  );
}

export default Staff;
