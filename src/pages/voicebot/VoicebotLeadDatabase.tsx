import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, User, BarChart, Activity, Mail, CheckCircle2, XCircle, Calendar, Database, Download, Upload, Plus } from "lucide-react"
import { mockVoicebotUsers, mockCallSessions, mockAnalyses, mockVoicebotActions } from "@/data/mockData"

function VoicebotLeadDatabase() {
    return (
        <div className="space-y-6 my-2">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-main">Leads Database</h1>
                    <p className="text-text-muted mt-1">Manage your leads and schedule automated call campaigns</p>
                </div>
                <div className="flex gap-4">
                    <button className="btn btn-primary">
                        <Download className="w-4 h-4" />
                        Sample CSV</button>
                    <button className="btn btn-primary">
                        <Upload className="w-4 h-4" />
                        Import Leads</button>
                    <button className="btn btn-primary">
                        <Plus className="w-4 h-4" />
                        Create Campaign</button>
                </div>
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

            <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow transition-all" >
                <Tabs defaultValue="users" className="w-full">
                    <TabsList className="bg-primary-soft/50 p-1 mb-2">
                        <TabsTrigger value="users" className="px-6">Users ({mockVoicebotUsers.length})</TabsTrigger>
                        <TabsTrigger value="calls" className="px-6">Call Sessions ({mockCallSessions.length})</TabsTrigger>
                        <TabsTrigger value="analyses" className="px-6">Analyses ({mockAnalyses.length})</TabsTrigger>
                        <TabsTrigger value="actions" className="px-6">Actions ({mockVoicebotActions.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="users">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border-subtle">
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Email</th>
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Full Name</th>
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Company</th>
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Subscription</th>
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Verified</th>
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Last Login</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-subtle/50">
                                    {mockVoicebotUsers.map((user, i) => (
                                        <tr key={i} className="hover:bg-bg-alt/30 transition-colors">
                                            <td className="py-4 px-3 text-sm text-text-main font-medium">{user.email}</td>
                                            <td className="py-4 px-3 text-sm text-text-muted">{user.fullName}</td>
                                            <td className="py-4 px-3 text-sm text-text-muted">{user.company}</td>
                                            <td className="py-4 px-3">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-bg-alt text-text-muted`}>
                                                    {user.subscription}
                                                </span>
                                            </td>
                                            <td className="py-4 px-3">
                                                {user.verified === 'Yes' ?
                                                    <CheckCircle2 className="w-4 h-4 text-success" /> :
                                                    <XCircle className="w-4 h-4 text-danger" />
                                                }
                                            </td>
                                            <td className="py-4 px-3 text-sm text-text-muted">{user.lastLogin}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </TabsContent>

                    <TabsContent value="calls">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border-subtle">
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Session ID</th>
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Customer Phone</th>
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Status</th>
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Duration</th>
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Start Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-subtle/50">
                                    {mockCallSessions.map((session, i) => (
                                        <tr key={i} className="hover:bg-bg-alt/30 transition-colors">
                                            <td className="py-4 px-3 text-sm font-mono text-primary">{session.sessionId}</td>
                                            <td className="py-4 px-3 text-sm text-text-main">{session.customerPhone}</td>
                                            <td className="py-4 px-3">
                                                <span className={`badge ${session.status === 'Completed' ? 'badge-success' : 'badge-danger'}`}>
                                                    {session.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-3 text-sm text-text-muted">{session.duration}</td>
                                            <td className="py-4 px-3 text-sm text-text-muted">{session.startTime}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </TabsContent>

                    <TabsContent value="analyses">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border-subtle">
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Session ID</th>
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Sentiment</th>
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Extracted Email</th>
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Extracted Name</th>
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Intent</th>
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Follow-up</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-subtle/50">
                                    {mockAnalyses.map((analysis, i) => (
                                        <tr key={i} className="hover:bg-bg-alt/30 transition-colors">
                                            <td className="py-4 px-3 text-sm font-mono text-primary">{analysis.sessionId}</td>
                                            <td className="py-4 px-3">
                                                <span className={`badge ${analysis.sentiment === 'Positive' ? 'badge-success' : 'badge-danger'}`}>
                                                    {analysis.sentiment}
                                                </span>
                                            </td>
                                            <td className="py-4 px-3 text-sm text-text-main">{analysis.extractedEmail}</td>
                                            <td className="py-4 px-3 text-sm text-text-muted">{analysis.extractedName}</td>
                                            <td className="py-4 px-3 text-sm text-text-muted">{analysis.intent}</td>
                                            <td className="py-4 px-3">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${analysis.followUp === 'Yes' ? 'bg-success/20 text-success' : 'bg-bg-alt text-text-muted'}`}>
                                                    {analysis.followUp}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </TabsContent>

                    <TabsContent value="actions">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border-subtle">
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Analysis ID</th>
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Tool Used</th>
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Status</th>
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-subtle/50">
                                    {mockVoicebotActions.map((action, i) => (
                                        <tr key={i} className="hover:bg-bg-alt/30 transition-colors">
                                            <td className="py-4 px-3 text-sm font-mono text-primary">{action.analysisId}</td>
                                            <td className="py-4 px-3">
                                                <div className="flex items-center gap-2">
                                                    {action.toolUsed === 'send_email' && <Mail className="w-3.5 h-3.5" />}
                                                    {action.toolUsed === 'update_crm' && <Database className="w-3.5 h-3.5" />}
                                                    {action.toolUsed === 'create_calendar_event' && <Calendar className="w-3.5 h-3.5" />}
                                                    <span className="text-sm text-text-main">{action.toolUsed}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-3">
                                                <span className={`badge ${action.status === 'Success' ? 'badge-success' : 'badge-danger'}`}>
                                                    {action.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-3 text-sm text-text-muted">{action.timestamp}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default VoicebotLeadDatabase
