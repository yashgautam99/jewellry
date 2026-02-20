export default function DashboardPage() {
  const stats = [
    { label: "Revenue", value: "₹2,45,000", change: "+12%", icon: "💰" },
    { label: "Orders", value: "48", change: "+8%", icon: "📦" },
    { label: "Products", value: "24", change: "+2", icon: "💎" },
    { label: "Customers", value: "156", change: "+15%", icon: "👤" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-white mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-gradient-to-br from-[#141414] to-[#1A1A1A] border border-white/5 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-[#6B6B6B] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-[#141414] to-[#1A1A1A] border border-white/5 p-6">
        <h2 className="text-lg font-serif font-semibold text-white mb-4">
          Recent Orders
        </h2>
        <p className="text-sm text-[#6B6B6B]">No recent orders to display.</p>
      </div>
    </div>
  );
}
