

import { Progress } from "@/components/ui/progress"


function SentimentInsight() {
    return (
        <div>
            <div className="card p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-text-main">Sentiment Analysis</h2>
                    <p className="text-sm text-text-muted">Distribution of customer sentiment across calls</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <h6 className="text-md font-semibold text-success">Positive Sentiment</h6>
                        <Progress value={60} className="h-3" />
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-md font-semibold text-warning">Neutral Sentiment</h6>
                        <Progress value={34} className="h-3" />
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-md font-semibold text-danger">Negative Sentiment</h6>
                        <Progress value={27} className="h-3" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SentimentInsight