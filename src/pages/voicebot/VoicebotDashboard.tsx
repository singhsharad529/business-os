export function VoicebotDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Voicebot Dashboard</h1>
        <p className="text-text-muted mt-1">Welcome to your voicebot control center</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-border-subtle shadow-soft">
          <div className="text-sm text-text-muted mb-2">Total Conversations</div>
          <div className="text-3xl font-bold text-text-main">1,234</div>
          <div className="text-xs text-success mt-2">+12% from last month</div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-border-subtle shadow-soft">
          <div className="text-sm text-text-muted mb-2">Active Sessions</div>
          <div className="text-3xl font-bold text-text-main">42</div>
          <div className="text-xs text-text-muted mt-2">Real-time</div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-border-subtle shadow-soft">
          <div className="text-sm text-text-muted mb-2">Success Rate</div>
          <div className="text-3xl font-bold text-text-main">94.5%</div>
          <div className="text-xs text-success mt-2">+2.3% improvement</div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-border-subtle shadow-soft">
          <div className="text-sm text-text-muted mb-2">Avg Response Time</div>
          <div className="text-3xl font-bold text-text-main">1.2s</div>
          <div className="text-xs text-text-muted mt-2">Fast & responsive</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-border-subtle shadow-soft">
          <h2 className="text-lg font-semibold text-text-main mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-bg/50 rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-text-main">New conversation started</div>
                <div className="text-xs text-text-muted">2 minutes ago</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-bg/50 rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-text-main">Integration updated</div>
                <div className="text-xs text-text-muted">15 minutes ago</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-bg/50 rounded-lg">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-text-main">Settings changed</div>
                <div className="text-xs text-text-muted">1 hour ago</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-border-subtle shadow-soft">
          <h2 className="text-lg font-semibold text-text-main mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-3 bg-primary-soft/30 hover:bg-primary-soft/50 rounded-lg transition-colors text-sm font-medium text-text-main">
              Start New Conversation
            </button>
            <button className="w-full text-left px-4 py-3 bg-primary-soft/30 hover:bg-primary-soft/50 rounded-lg transition-colors text-sm font-medium text-text-main">
              Configure Voice Settings
            </button>
            <button className="w-full text-left px-4 py-3 bg-primary-soft/30 hover:bg-primary-soft/50 rounded-lg transition-colors text-sm font-medium text-text-main">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

