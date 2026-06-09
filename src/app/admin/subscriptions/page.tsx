import { createServerSupabase } from "@/lib/supabase/server";
import { CreditCard, CheckCircle, Clock, XCircle } from "lucide-react";
import SubActions from "./SubActions";

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string }>;
}

export default async function AdminSubscriptionsPage({ searchParams }: PageProps) {
  const { page, status } = await searchParams;
  const currentPage = parseInt(page || "1");
  const perPage = 20;
  const offset = (currentPage - 1) * perPage;

  const supabase = await createServerSupabase();

  let query = supabase
    .from("subscriptions")
    .select("*, profiles(email, username), subscription_plans(name, duration_days)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + perPage - 1);

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data: subs, count } = await query;
  const totalPages = Math.ceil((count || 0) / perPage);

  const statusIcon: Record<string, React.ReactNode> = {
    active: <CheckCircle className="w-3.5 h-3.5 text-green-400" />,
    pending: <Clock className="w-3.5 h-3.5 text-yellow-400" />,
    expired: <XCircle className="w-3.5 h-3.5 text-gray-400" />,
    cancelled: <XCircle className="w-3.5 h-3.5 text-red-400" />,
  };

  const statusColor: Record<string, string> = {
    active: "bg-green-500/10 text-green-400",
    pending: "bg-yellow-500/10 text-yellow-400",
    expired: "bg-gray-500/10 text-gray-400",
    cancelled: "bg-red-500/10 text-red-400",
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-green-400" />
            Subscriptions
          </h1>
          <p className="text-gray-500 text-sm mt-1">{count || 0} total subscriptions</p>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {["all", "pending", "active", "expired"].map((s) => (
            <a
              key={s}
              href={`/admin/subscriptions?status=${s}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                (status || "all") === s ? "bg-red-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </a>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">User</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Plan</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase hidden md:table-cell">Expires</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {subs && subs.length > 0 ? (
              subs.map((sub: any) => (
                <tr key={sub.id} className="hover:bg-white/5 transition">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{(sub.profiles as any)?.username || (sub.profiles as any)?.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-300">{(sub.subscription_plans as any)?.name || "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-green-400 font-medium">Rp {sub.amount?.toLocaleString("id-ID")}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[sub.status]}`}>
                      {statusIcon[sub.status]}
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-gray-500">
                      {sub.expires_at ? new Date(sub.expires_at).toLocaleDateString("id-ID") : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <SubActions subId={sub.id} currentStatus={sub.status} userId={sub.user_id} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500 text-sm">
                  Tidak ada subscription
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
