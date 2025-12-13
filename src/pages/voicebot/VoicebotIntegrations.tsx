export function VoicebotIntegrations() {
  const integrations = [
    { name: "Slack", connected: true, description: "Receive voicebot notifications in Slack" },
    { name: "Salesforce", connected: true, description: "Sync customer data with Salesforce" },
    { name: "Zapier", connected: false, description: "Connect with 1000+ apps via Zapier" },
    { name: "Google Calendar", connected: true, description: "Schedule meetings from voice conversations" },
    { name: "HubSpot", connected: false, description: "Integrate with HubSpot CRM" },
    { name: "Microsoft Teams", connected: false, description: "Team collaboration integration" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Integrations</h1>
        <p className="text-text-muted mt-1">Connect voicebot with your favorite tools</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-border-subtle shadow-soft"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-text-main">{integration.name}</h3>
                <p className="text-sm text-text-muted mt-1">{integration.description}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  integration.connected
                    ? "bg-success-soft/30 text-success"
                    : "bg-bg text-text-muted"
                }`}
              >
                {integration.connected ? "Connected" : "Available"}
              </span>
            </div>
            <button
              className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                integration.connected
                  ? "bg-danger-soft/30 text-danger hover:bg-danger-soft/50"
                  : "bg-primary-soft/30 text-primary hover:bg-primary-soft/50"
              }`}
            >
              {integration.connected ? "Disconnect" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

