import { useEffect, useState } from "react";
import QRCodeModal from "../../components/QRCodeModal";

function Workers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  });

  const fetchWorkers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/workers");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch workers");
      }

      setWorkers(data);
    } catch (error) {
      console.error("Error fetching workers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  if (loading) {
    return <p>Loading workers...</p>;
  }

  const toggleWorkerStatus = async (worker) => {
    const action = worker.is_active ? "deactivate" : "activate";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${worker.name}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/workers/${worker.id}/${action}`,
        {
          method: "PATCH",
        },
      );

      const data = await response.JSON();

      if (!response.ok) {
        throw new Error(data.error || "Failed to deactivate worker");
      }

      setWorkers((currentWorkers) => {
        return currentWorkers.map((worker) => {
          return worker.id === data.id ? data : worker;
        });
      });
    } catch (error) {
      console.error("Error deactinving worker:", error);
    }
  };

  const createWorker = async () => {
    if (!formData.name || !formData.email) {
      alert("Name and email are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/workers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessId: 1,
          name: formData.name,
          email: formData.email,
          bio: formData.bio,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create worker");
      }

      console.log("Worker created:", data);

      // Get the updated worker list
      fetchWorkers();

      // Close the form
      setShowForm(false);

      // Clear the form
      setFormData({
        name: "",
        email: "",
        bio: "",
      });
    } catch (error) {
      console.error("Error creating worker:", error);
    }
  };

  // Function to handle form submission for editing a worker
  const handleEdit = (worker) => {
    setEditingWorker(worker);

    setFormData({
      name: worker.name,
      email: worker.email,
      bio: worker.bio || "",
    });

    setShowForm(true);
  };

  // Function to handle form submission for updating a worker
  const updateWorker = async () => {
    if (!formData.name || !formData.email) {
      alert("Name and email are required");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/workers/${editingWorker.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            bio: formData.bio,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update worker");
      }

      console.log("Worker updated:", data);

      setWorkers((currentWorkers) =>
        currentWorkers.map((worker) => (worker.id === data.id ? data : worker)),
      );

      setShowForm(false);
      setEditingWorker(null);

      setFormData({
        name: "",
        email: "",
        bio: "",
      });
    } catch (error) {
      console.error("Error updating worker:", error);
    }
  };

  return (
    <main className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workers</h1>

        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          Add Worker
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Add Worker</h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Worker name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2"
            />

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2"
            />

            <textarea
              placeholder="Bio"
              value={formData.bio}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bio: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2"
              rows="4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-gray-300 px-4 py-2"
              >
                Cancel
              </button>

              <button
                className="rounded-lg bg-black px-4 py-2 text-white"
                onClick={editingWorker ? updateWorker : createWorker}
              >
                {editingWorker ? "Update Worker" : "Create Worker"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">
                Name
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">
                Email
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">
                Slug
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {workers.map((worker) => (
              <tr key={worker.id}>
                <td className="px-6 py-4 font-medium">{worker.name}</td>

                <td className="px-6 py-4 text-gray-600">{worker.email}</td>

                <td className="px-6 py-4 text-gray-600">{worker.slug}</td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedWorker(worker)}
                    className="text-purple-600 hover:underline"
                  >
                    QR Code
                  </button>
                  <button
                    onClick={() => handleEdit(worker)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    href={`/tip/${worker.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Tip Page
                  </button>

                  <button
                    onClick={() => toggleWorkerStatus(worker)}
                    className={
                      worker.is_active
                        ? "text-red-600 hover:underline"
                        : "text-green-600 hover:underline"
                    }
                  >
                    {worker.is_active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedWorker && (
        <QRCodeModal
          worker={selectedWorker}
          onClose={() => setSelectedWorker(null)}
        />
      )}
    </main>
  );
}

export default Workers;
