

import { Progress } from "@/components/ui/progress"
import { Activity, Mail, Phone } from "lucide-react"


function ActionsInsight() {
    return (
        <div>
            <div className="card p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-text-main">Automated Actions</h2>
                    <p className="text-sm text-text-muted">Track performance, analyze trends, and optimize your AI agents</p>
                </div>

                <div className="space-y-4">
                    <div className="flex gap-4 items-center justify-between bg-primary-soft/30 p-4 rounded-xl">
                        <div className="flex gap-4 items-center">
                            <Mail className="w-8 h-8 text-primary opacity-60" />
                            <div className="flex flex-col">
                                <h6 className="text-md font-semibold">Emails Sent</h6>
                                <p className="text-sm text-text-muted">Automated follow-ups</p>
                            </div>
                        </div>

                        <div className="text-lg font-semibold text-text-main">
                            0
                        </div>
                    </div>


                    <div className="flex gap-4 items-center justify-between bg-primary-soft/30 p-4 rounded-xl">
                        <div className="flex gap-4 items-center">
                            <Activity className="w-8 h-8 text-primary opacity-60" />
                            <div className="flex flex-col">
                                <h6 className="text-md font-semibold">Calendar Events Created</h6>
                                <p className="text-sm text-text-muted">Scheduled appointments</p>
                            </div>
                        </div>

                        <div className="text-lg font-semibold text-text-main">
                            0
                        </div>
                    </div>


                    <div className="flex gap-4 items-center justify-between bg-primary-soft/30 p-4 rounded-xl">
                        <div className="flex gap-4 items-center">
                            <Phone className="w-8 h-8 text-primary opacity-60" />
                            <div className="flex flex-col">
                                <h6 className="text-md font-semibold">WhatsApp Messages</h6>
                                <p className="text-sm text-text-muted">Instant communications</p>
                            </div>
                        </div>

                        <div className="text-lg font-semibold text-text-main">
                            0
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActionsInsight