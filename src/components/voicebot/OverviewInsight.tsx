import React, { useState } from 'react';
import { Activity } from 'lucide-react';





function OverviewInsight() {

    return (
        <div className='space-y-6'>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                    <div className="text-sm text-text-muted mb-2">Total Calls</div>
                    <div className="text-3xl font-bold text-text-main">12</div>
                    <div className="text-xs text-success mt-2">All time call sessions</div>
                </div>

                <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                    <div className="text-sm text-text-muted mb-2">Avg Duration</div>
                    <div className="text-3xl font-bold text-text-main">2m 34s</div>
                    <div className="text-xs text-text-muted mt-2">Average Call length</div>
                </div>

                <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                    <div className="text-sm text-text-muted mb-2">Success Rate</div>
                    <div className="text-3xl font-bold text-text-main">0.05%</div>
                    <div className="text-xs text-success mt-2">Completed calls</div>
                </div>

                <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                    <div className="text-sm text-text-muted mb-2">Active Users</div>
                    <div className="text-3xl font-bold text-text-main">23</div>
                    <div className="text-xs text-text-muted mt-2">Registered users</div>
                </div>
            </div>

            <div className='card glass-morphism p-8 border border-border-subtle rounded-xl min-h-[300px] flex flex-col items-center justify-center text-center'>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-text-main">Call Flow Analysis</h2>
                    <p className="text-sm text-text-muted">Journey from initiated call to completed action</p>
                </div>

                <div className="flex flex-col items-center justify-center py-10">
                    <div className="w-16 h-16 bg-primary-soft/30 rounded-full flex items-center justify-center mb-4">
                        <Activity className="w-8 h-8 text-primary opacity-60" />
                    </div>
                    <p className="text-lg font-medium text-text-main">No call data available yet</p>
                    <p className="text-sm text-text-muted mt-1">Make some test calls to see the flow analysis</p>
                </div>
            </div>
        </div>

    )
}

export default OverviewInsight