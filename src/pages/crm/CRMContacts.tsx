export function CRMContacts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Contacts</h1>
          <p className="text-text-muted mt-1">Manage your customer contacts</p>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          + Add Contact
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-border-subtle shadow-soft overflow-hidden">
        <div className="p-4 border-b border-border-subtle">
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full px-4 py-2 bg-bg border border-border-subtle rounded-lg text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="divide-y divide-border-subtle">
          {[
            { name: "John Doe", email: "john@example.com", company: "Acme Corp", status: "Active" },
            { name: "Jane Smith", email: "jane@example.com", company: "Tech Solutions", status: "Active" },
            { name: "Mike Johnson", email: "mike@example.com", company: "Global Inc", status: "Inactive" },
            { name: "Sarah Williams", email: "sarah@example.com", company: "Digital Co", status: "Active" },
          ].map((contact, idx) => (
            <div key={idx} className="p-4 hover:bg-bg/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-main">{contact.name}</div>
                    <div className="text-xs text-text-muted">{contact.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-text-muted">{contact.company}</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    contact.status === "Active" 
                      ? "bg-success-soft/30 text-success" 
                      : "bg-bg text-text-muted"
                  }`}>
                    {contact.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

