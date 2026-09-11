import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sticky top-0 h-screen shrink-0 w-64 border-r border-gray-200 bg-white p-6">
      <h1 className="mb-8 text-xl font-bold">Tip Management</h1>

      <nav className="space-y-2">
        <NavLink
          to="/admin/dashboard"
          className="block rounded-lg px-4 py-2 hover:bg-gray-100"
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/workers"
          className="block rounded-lg px-4 py-2 hover:bg-gray-100"
        >
          Workers
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
