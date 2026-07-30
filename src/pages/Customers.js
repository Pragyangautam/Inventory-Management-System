import { useEffect, useState } from "react";

import SearchBar from "../components/common/search/SearchBar";
import FormModal from "../components/common/modal/FormModal";

import {
  getData,
  addData,
  updateData,
  deleteData,
} from "../services/storage/storageService";

const STORAGE_KEY = "customers";

function Customers() {
  const [customers, setCustomers] = useState([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingCustomer, setEditingCustomer] = useState(null);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [pan, setPan] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    setCustomers(getData(STORAGE_KEY));
  };

  const clearForm = () => {
    setName("");
    setCompany("");
    setPhone("");
    setEmail("");
    setAddress("");
    setPan("");

    setEditingCustomer(null);
  };

  const editCustomer = (customer) => {
    setEditingCustomer(customer);

    setName(customer.name);
    setCompany(customer.company);
    setPhone(customer.phone);
    setEmail(customer.email);
    setAddress(customer.address);
    setPan(customer.pan);

    setShowModal(true);
  };

  const saveCustomer = () => {
    if (!name.trim()) {
      alert("Customer Name Required");

      return;
    }

    const customer = {
      name,
      company,
      phone,
      email,
      address,
      pan,
    };

    if (editingCustomer) {
      updateData(STORAGE_KEY, {
        ...editingCustomer,

        ...customer,
      });
    } else {
      addData(STORAGE_KEY, customer);
    }

    loadCustomers();

    clearForm();

    setShowModal(false);
  };

  const removeCustomer = (id) => {
    if (window.confirm("Delete Customer?")) {
      deleteData(STORAGE_KEY, id);

      loadCustomers();
    }
  };

  const filtered = customers.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.company.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Customers</h1>

        <button
          className="btn btn-primary"
          onClick={() => {
            clearForm();
            setShowModal(true);
          }}
        >
          + Add Customer
        </button>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search Customer..."
      />

      <br />

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>

            <th>Name</th>

            <th>Company</th>

            <th>Phone</th>

            <th>Email</th>

            <th>PAN</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="7">No Customers Found</td>
            </tr>
          ) : (
            filtered.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>

                <td>{customer.name}</td>

                <td>{customer.company}</td>

                <td>{customer.phone}</td>

                <td>{customer.email}</td>

                <td>{customer.pan}</td>

                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => editCustomer(customer)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => removeCustomer(customer.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <FormModal
          title={editingCustomer ? "Edit Customer" : "Add Customer"}
          onSave={saveCustomer}
          onClose={() => setShowModal(false)}
        >
          <input
            className="form-control"
            placeholder="Customer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
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

          <textarea
            className="form-control"
            rows="3"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="PAN Number"
            value={pan}
            onChange={(e) => setPan(e.target.value)}
          />
        </FormModal>
      )}
    </div>
  );
}

export default Customers;
