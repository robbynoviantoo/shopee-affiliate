import { BarChart3 } from "lucide-react";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin");

  const prisma = process.env.DATABASE_URL ? (await import("@/lib/prisma")).prisma : null;
  const hasAnalyticsModels = Boolean(prisma?.visit && prisma?.productClick);

  const [visitCount, clickCount, uniqueVisitors, recentVisits, recentClicks, topClicks] = hasAnalyticsModels && prisma
    ? await Promise.all([
        prisma.visit.count(),
        prisma.productClick.count(),
        prisma.visit.groupBy({ by: ["ipAddress"], where: { ipAddress: { not: null } } }),
        prisma.visit.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
        prisma.productClick.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
        prisma.productClick.groupBy({ by: ["productId", "productName"], _count: { productId: true }, orderBy: { _count: { productId: "desc" } }, take: 30 }),
      ])
    : [0, 0, [], [], [], []];

  return (
    <main className="page-enter min-h-screen bg-cream px-4 py-6 text-black md:px-8">
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="neo-panel flex flex-col gap-4 bg-yellow p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="size-10" />
            <div>
              <p className="font-black uppercase">Monitoring</p>
              <h1 className="text-4xl font-black md:text-5xl">Analytics Website</h1>
            </div>
          </div>
          <Link href="/admin" className="neo-button bg-white px-5 py-3">Kembali Admin</Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="neo-panel bg-white p-5">
            <p className="text-xs font-black uppercase text-zinc-600">Total Kunjungan</p>
            <p className="mt-2 text-4xl font-black">{visitCount}</p>
          </div>
          <div className="neo-panel bg-lime p-5">
            <p className="text-xs font-black uppercase text-zinc-700">Unique IP</p>
            <p className="mt-2 text-4xl font-black">{uniqueVisitors.length}</p>
          </div>
          <div className="neo-panel bg-sky p-5">
            <p className="text-xs font-black uppercase text-zinc-700">Klik Produk</p>
            <p className="mt-2 text-4xl font-black">{clickCount}</p>
          </div>
        </div>

        <div className="neo-panel bg-white p-5">
          <h2 className="text-2xl font-black">Ranking Klik Produk</h2>
          <div className="mt-4 overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[640px] border-separate border-spacing-y-2 text-left text-sm font-bold">
              <thead>
                <tr className="text-xs uppercase">
                  <th className="px-3 py-2">Produk</th>
                  <th className="px-3 py-2">Product ID</th>
                  <th className="px-3 py-2 text-right">Total Klik</th>
                </tr>
              </thead>
              <tbody>
                {topClicks.map((item) => (
                  <tr key={`${item.productId}-${item.productName}`} className="bg-yellow shadow-neo-sm">
                    <td className="rounded-l-xl border-y-2 border-l-2 border-black px-3 py-2 font-black">{item.productName}</td>
                    <td className="border-y-2 border-black px-3 py-2">{item.productId}</td>
                    <td className="rounded-r-xl border-y-2 border-r-2 border-black px-3 py-2 text-right font-black">{item._count.productId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!topClicks.length ? <p className="font-bold text-zinc-600">Belum ada klik produk.</p> : null}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="neo-panel bg-white p-5">
            <h2 className="text-2xl font-black">Klik Produk Terbaru</h2>
            <div className="mt-4 max-h-[560px] space-y-3 overflow-auto pr-2 custom-scrollbar">
              {recentClicks.map((click) => (
                <div key={click.id} className="rounded-xl border-2 border-black bg-sky p-3 text-xs font-bold shadow-neo-sm">
                  <div className="flex flex-wrap justify-between gap-2 font-black">
                    <span>{click.productName}</span>
                    <span>{click.createdAt.toLocaleString("id-ID")}</span>
                  </div>
                  <p className="mt-1">IP: {click.ipAddress || "Tidak tersedia"}</p>
                  <p className="mt-1">{click.device || "Unknown"} - {click.browser || "Unknown"} - {click.os || "Unknown"}</p>
                  <p className="mt-1 break-all">URL: {click.targetUrl}</p>
                </div>
              ))}
              {!recentClicks.length ? <p className="font-bold text-zinc-600">Belum ada klik produk.</p> : null}
            </div>
          </div>

          <div className="neo-panel bg-white p-5">
            <h2 className="text-2xl font-black">Pengunjung Terbaru</h2>
            <div className="mt-4 max-h-[560px] space-y-3 overflow-auto pr-2 custom-scrollbar">
              {recentVisits.map((visit) => (
                <div key={visit.id} className="rounded-xl border-2 border-black bg-cream p-3 text-xs font-bold shadow-neo-sm">
                  <div className="flex flex-wrap justify-between gap-2 font-black">
                    <span>{visit.ipAddress || "IP tidak tersedia"}</span>
                    <span>{visit.createdAt.toLocaleString("id-ID")}</span>
                  </div>
                  <p className="mt-1">{visit.device || "Unknown"} - {visit.browser || "Unknown"} - {visit.os || "Unknown"}</p>
                  <p className="mt-1">Path: {visit.path}</p>
                  <p className="mt-1">Referrer: {visit.referrer || "Direct"}</p>
                  <p className="mt-1">Lokasi: {[visit.city, visit.country].filter(Boolean).join(", ") || "Tidak tersedia"}</p>
                </div>
              ))}
              {!recentVisits.length ? <p className="font-bold text-zinc-600">Belum ada data kunjungan.</p> : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

