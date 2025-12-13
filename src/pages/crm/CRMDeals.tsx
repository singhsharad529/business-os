export function CRMDeals() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Deals</h1>
          <p className="text-text-muted mt-1">Track your sales pipeline</p>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          + New Deal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["Qualification", "Proposal", "Negotiation", "Closed"].map((stage, idx) => (
          <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-border-subtle shadow-soft">
            <div className="text-sm font-semibold text-text-main mb-3">{stage}</div>
            <div className="space-y-2">
              {[
                { name: "Acme Corp Deal", value: "$50K", probability: "60%" },
                { name: "Tech Solutions", value: "$75K", probability: "40%" },
              ].map((deal, dealIdx) => (
                <div key={dealIdx} className="p-3 bg-bg/50 rounded-lg">
                  <div className="text-sm font-medium text-text-main">{deal.name}</div>
                  <div className="text-xs text-text-muted mt-1">{deal.value}</div>
                  <div className="text-xs text-primary mt-1">{deal.probability} probability</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

