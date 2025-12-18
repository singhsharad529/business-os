export function VoicebotCRM() {
  return (
    <div className="space-y-6 my-2">
      <div>
        <h1 className="text-3xl font-bold text-text-main">Voicebot CRM</h1>
        <p className="text-text-muted mt-1">Manage customer relationships through voice interactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-white/80 backdrop-blur-xl p-6 hover:shadow-glow hover:-translate-y-0.5">
          <div className="text-sm text-text-muted mb-2">Leads Generated</div>
          <div className="text-3xl font-bold text-text-main">89</div>
          <div className="text-xs text-success mt-2">This month</div>
        </div>

        <div className="card bg-white/80 backdrop-blur-xl p-6 hover:shadow-glow hover:-translate-y-0.5">
          <div className="text-sm text-text-muted mb-2">Follow-ups Scheduled</div>
          <div className="text-3xl font-bold text-text-main">156</div>
          <div className="text-xs text-text-muted mt-2">Pending actions</div>
        </div>

        <div className="card bg-white/80 backdrop-blur-xl p-6 hover:shadow-glow hover:-translate-y-0.5">
          <div className="text-sm text-text-muted mb-2">Conversion Rate</div>
          <div className="text-3xl font-bold text-text-main">23.4%</div>
          <div className="text-xs text-success mt-2">Above average</div>
        </div>
      </div>

      <div className="card bg-white/80 backdrop-blur-xl p-6 hover:shadow-glow hover:-translate-y-0.5">
        <h2 className="text-lg font-semibold text-text-main mb-4">Recent CRM Interactions</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-bg/50 rounded-lg">
            <div>
              <div className="text-sm font-medium text-text-main">John Doe - Lead Qualification</div>
              <div className="text-xs text-text-muted">Voice conversation • 5 minutes ago</div>
            </div>
            <span className="px-3 py-1 bg-primary-soft/30 text-primary text-xs font-medium rounded-full">
              New Lead
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-bg/50 rounded-lg">
            <div>
              <div className="text-sm font-medium text-text-main">Jane Smith - Product Inquiry</div>
              <div className="text-xs text-text-muted">Voice conversation • 12 minutes ago</div>
            </div>
            <span className="px-3 py-1 bg-accent-soft/30 text-accent text-xs font-medium rounded-full">
              Follow-up
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-bg/50 rounded-lg">
            <div>
              <div className="text-sm font-medium text-text-main">Mike Johnson - Support Request</div>
              <div className="text-xs text-text-muted">Voice conversation • 1 hour ago</div>
            </div>
            <span className="px-3 py-1 bg-success-soft/30 text-success text-xs font-medium rounded-full">
              Resolved
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

