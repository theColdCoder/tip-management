import { useEffect, useState } from "react";

function Dashboard() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchTips = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/tips");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch tips");
      }

      setTips(data);
    } catch (error) {
      console.error("Error fetching tips:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  // statistics
  const totalTips = tips.reduce((total, tip) => total + Number(tip.amount), 0);

  const completedTips = tips
    .filter((tip) => tip.status === "completed")
    .reduce((total, tip) => total + Number(tip.amount), 0);

  const pendingTips = tips
    .filter((tip) => tip.status === "pending")
    .reduce((total, tip) => total + Number(tip.amount), 0);

  const transactionCount = tips.length;

  // Filtered tips based on search and status filter
  const filteredTips = tips.filter((tip) => {
    const matchesSearch = tip.worker?.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || tip.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div>
        <div>
          <h3>Total Tips</h3>
          <p>${totalTips.toFixed(2)}</p>
        </div>

        <div>
          <h3>Completed Tips</h3>
          <p>${completedTips.toFixed(2)}</p>
        </div>

        <div>
          <h3>Pending Tips</h3>
          <p>${pendingTips.toFixed(2)}</p>
        </div>

        <div>
          <h3>Transactions</h3>
          <p>{transactionCount}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search worker..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-gray-500"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2"
        >
          <option value="all">All statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Transactions</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">
                  Worker
                </th>

                <th className="px-6 py-3 text-sm font-medium text-gray-500">
                  Amount
                </th>

                <th className="px-6 py-3 text-sm font-medium text-gray-500">
                  Currency
                </th>

                <th className="px-6 py-3 text-sm font-medium text-gray-500">
                  Status
                </th>

                <th className="px-6 py-3 text-sm font-medium text-gray-500">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredTips.map((tip) => (
                <tr key={tip.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {tip.worker?.name}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    ${Number(tip.amount).toFixed(2)}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {tip.currency}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        tip.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {tip.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(tip.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
