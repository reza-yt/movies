import { createServerSupabase } from "@/lib/supabase/server";
import { BarChart3 } from "lucide-react";
import PlanForm from "./PlanForm";

export default async function AdminPlansPage() {
  const supabase = await createServerSupabase();
  const { data: plans } = await supabase
    .from("subscription_plans")
    .select("*")
    .order("price", { ascending: true });

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-400" />
          Subscription Plans
        </h1>
        <p className="text-gray-500 text-sm mt-1">Kelola paket berlangganan</p>
      </div>

      {/* Plans list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans?.map((plan: any) => (
          <div
            key={plan.id}
            className={`p-5 rounded-xl border ${plan.is_active ? "border-white/10 bg-white/5" : "border-red-500/20 bg-red-500/5 opacity-60"}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg">{plan.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{plan.slug}</p>
              </div>
              {!plan.is_active && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">
                  Inactive
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-green-400">
              Rp {plan.price.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-gray-500 mt-1">{plan.duration_days} hari</p>
            {plan.description && (
              <p className="text-sm text-gray-400 mt-3">{plan.description}</p>
            )}
            {plan.features && (
              <ul className="mt-3 space-y-1">
                {plan.features.map((f: string, i: number) => (
                  <li key={i} className="text-xs text-gray-400 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-green-400" />
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Add Plan Form */}
      <div className="p-5 rounded-xl bg-white/5 border border-white/10">
        <h2 className="font-bold mb-4">Tambah Plan Baru</h2>
        <PlanForm />
      </div>
    </div>
  );
}
