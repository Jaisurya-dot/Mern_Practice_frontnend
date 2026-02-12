import React, { useEffect, useState } from "react";
import Modal from "../model/Model";  // fixed path + casing
import LogoutButton from "../logout/Logout";
import API_BASE_URL from "../../config/api";

const Table = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ open: false, user: null, mode: "edit" });
  async function fetchUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admins/users`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },

      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const filteredUsers = (data.users || []).filter((u) => u.role === "user");
      setUsers(filteredUsers);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = async (formData) => {
    try {
      const id = modal.user?._id;
      if (!id) throw new Error("Missing user id");

      const response = await fetch(`${API_BASE_URL}/api/admins/${id}`, {
        method: "PUT",
        headers:
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },


        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Update failed");
      }
      await fetchUsers();
      alert("User updated!"); // replace later with toast
    } catch (err) {
      console.error("Edit error:", err);
      alert("Update error: " + err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const id = modal.user?._id;
      if (!id) throw new Error("Missing user id");

      const response = await fetch(`${API_BASE_URL}/api/admins/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers:
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Delete failed");
      }
      await fetchUsers();
      alert("User deleted!"); // replace later with toast
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete error: " + err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <p style={{ color: "red", marginBottom: "10px" }}>Error: {error}</p>
        <button
          onClick={fetchUsers}
          style={{
            padding: "8px 16px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  const user = localStorage.getItem("user");
  const { role } = JSON.parse(user);

  return (
    <>
      <div style={{ padding: "20px" }}>
        <h2>User Management ({users.length} users)</h2>
        <LogoutButton />
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
              {role === "admin" && (
                <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user._id}
                  style={{
                    borderBottom: "1px solid #eee",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f8f9fa")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <td style={{ padding: "12px" }}>{user.name}</td>
                  <td style={{ padding: "12px" }}>{user.email}</td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "12px",
                        backgroundColor: user.status ? "#d4edda" : "#f8d7da",
                        color: user.status ? "#155724" : "#721c24",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {user.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  {role === "admin" && (
                    <td style={{ padding: "12px" }}>
                      <button
                        onClick={() =>
                          setModal({ open: true, user, mode: "edit" })
                        }
                        style={{
                          padding: "6px 12px",
                          background: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          marginRight: "8px",
                          transition: "opacity 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.opacity = "0.8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.opacity = "1")
                        }
                        title="Edit user"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          setModal({ open: true, user, mode: "delete" })
                        }
                        style={{
                          padding: "6px 12px",
                          background: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          transition: "opacity 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.opacity = "0.8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.opacity = "1")
                        }
                        title="Delete user"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#666",
                    fontStyle: "italic",
                  }}
                >
                  No users found. Create your first user?
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modal.open}
        user={modal.user}
        mode={modal.mode}
        onClose={() => setModal({ open: false, user: null, mode: "edit" })}
        onSave={modal.mode === "edit" ? handleEdit : handleDelete}
      />
    </>
  );
};

export default Table;
