export function CRMDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main">CRM Dashboard</h1>
        <p className="text-text-muted mt-1">Manage your customer relationships</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-border-subtle shadow-soft">
          <div className="text-sm text-text-muted mb-2">Total Contacts</div>
          <div className="text-3xl font-bold text-text-main">2,456</div>
          <div className="text-xs text-success mt-2">+8% from last month</div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-border-subtle shadow-soft">
          <div className="text-sm text-text-muted mb-2">Active Deals</div>
          <div className="text-3xl font-bold text-text-main">124</div>
          <div className="text-xs text-primary mt-2">$2.4M pipeline</div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-border-subtle shadow-soft">
          <div className="text-sm text-text-muted mb-2">Won This Month</div>
          <div className="text-3xl font-bold text-text-main">18</div>
          <div className="text-xs text-success mt-2">$450K revenue</div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-border-subtle shadow-soft">
          <div className="text-sm text-text-muted mb-2">Conversion Rate</div>
          <div className="text-3xl font-bold text-text-main">32.5%</div>
          <div className="text-xs text-success mt-2">+5.2% improvement</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-border-subtle shadow-soft">
          <h2 className="text-lg font-semibold text-text-main mb-4">Recent Activities</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-bg/50 rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-text-main">New deal created</div>
                <div className="text-xs text-text-muted">Acme Corp • 5 minutes ago</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-bg/50 rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-text-main">Deal closed</div>
                <div className="text-xs text-text-muted">Tech Solutions Inc • 1 hour ago</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-bg/50 rounded-lg">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-text-main">Contact updated</div>
                <div className="text-xs text-text-muted">John Smith • 2 hours ago</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-border-subtle shadow-soft">
          <h2 className="text-lg font-semibold text-text-main mb-4">Upcoming Tasks</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-bg/50 rounded-lg">
              <input type="checkbox" className="rounded" />
              <div className="flex-1">
                <div className="text-sm font-medium text-text-main">Follow up with Acme Corp</div>
                <div className="text-xs text-text-muted">Due today</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-bg/50 rounded-lg">
              <input type="checkbox" className="rounded" />
              <div className="flex-1">
                <div className="text-sm font-medium text-text-main">Send proposal to Tech Solutions</div>
                <div className="text-xs text-text-muted">Due tomorrow</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-bg/50 rounded-lg">
              <input type="checkbox" className="rounded" />
              <div className="flex-1">
                <div className="text-sm font-medium text-text-main">Schedule demo call</div>
                <div className="text-xs text-text-muted">Due in 2 days</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

