import { Phone, User, BarChart, Activity } from "lucide-react"



function VoicebotLeadDatabase() {
    return (
        <div className="space-y-6 my-2">
            <div>
                <h1 className="text-3xl font-bold text-text-main">Leads Database</h1>
                <p className="text-text-muted mt-1">Manage your leads and schedule automated call campaigns</p>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card flex items-center justify-between rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                    <div>
                        <div className="text-3xl font-bold text-text-main">152</div>
                        <div className="text-xs text-text-muted mt-2">Users</div>
                    </div>
                    <div className="text-sm mb-2"><User className="w-6 h-6 text-primary opacity-80" /></div>

                </div>

                <div className="card flex items-center justify-between rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                    <div>
                        <div className="text-3xl font-bold text-text-main">568</div>
                        <div className="text-xs text-text-muted mt-2">Call Sessions</div>
                    </div>
                    <div className="text-sm mb-2"><Phone className="w-6 h-6 text-primary opacity-80" /></div>
                </div>

                <div className="card flex items-center justify-between rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                    <div>
                        <div className="text-3xl font-bold text-text-main">234</div>
                        <div className="text-xs text-text-muted mt-2">Analysis</div>
                    </div>
                    <div className="text-sm mb-2"><BarChart className="w-6 h-6 text-primary opacity-80" /></div>
                </div>

                <div className="card flex items-center justify-between rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                    <div>
                        <div className="text-3xl font-bold text-text-main">400</div>
                        <div className="text-xs text-text-muted mt-2">Actions</div>
                    </div>
                    <div className="text-sm mb-2">  <Activity className="w-6 h-6 text-primary opacity-80" /></div>
                </div>
            </div>
        </div>
    )
}

export default VoicebotLeadDatabase