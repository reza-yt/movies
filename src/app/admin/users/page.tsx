import { createServerSupabase } from "@/lib/supabase/server";
import { Users, Shield, Crown, User } from "lucide-react";
import UserActions from "./UserActions";

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const { page, search } = await searchParams;
  const currentPage = parseInt(page || "1");
  const perPage = 20;
  const offset = (currentPage - 1) * perPage;

  const supabase = await createServerSupabase();

  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + perPage - 1);

  if (search) {
    query = query.or(`email.ilike.%${search}%,username.ilike.%${search}%`);
  }

  const { data: users, count } = await query;
  const totalPages = Math.ceil((count || 0) / perPage);

  const roleIcon: Record<string, React.ReactNode> = {
    admin: <Shield className="w-3.5 h-3.5 text-red-400" />,
    premium: <Crown className="w-3.5 h-3.5 text-yellow-400" />,
    user: <User className="w-3.5 h-3.5 text-gray-400" />,
  };

  const roleColor: Record<string, string> = {
    admin: "bg-red-500/10 text-red-400 border-red-500/20",
    premium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    user: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            User Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">{count || 0} total users</p>
        </div>

        {/* Search */}
        <form method="GET" className="flex gap-2">
          <input
            type="text"
            name="search"
            placeholder="Cari email/username..."
            defaultValue={search || ""}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 w-64"
          />
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium">
            Cari
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">User</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Role</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase hidden sm:table-cell">Subscription</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase hidden md:table-cell">Joined</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users && users.length > 0 ? (
              users.map((user: any) => (
                <tr key={user.id} className="hover:bg-white/5 transition">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{user.username || "—"}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${roleColor[user.role] || roleColor.user}`}>
                      {roleIcon[user.role]}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs text-gray-400">
                      {user.subscription_plan || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-gray-500">
                      {new Date(user.created_at).toLocaleDateString("id-ID")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <UserActions userId={user.id} currentRole={user.role} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500 text-sm">
                  Tidak ada user ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/admin/users?page=${p}${search ? `&search=${search}` : ""}`}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                p === currentPage
                  ? "bg-red-500 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
