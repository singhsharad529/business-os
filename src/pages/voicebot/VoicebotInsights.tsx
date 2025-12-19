import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ActionsInsight from "@/components/voicebot/ActionsInsight";
import OverviewInsight from "@/components/voicebot/OverviewInsight";
import PerformanceInsight from "@/components/voicebot/PerformanceInsight";
import SentimentInsight from "@/components/voicebot/SentimentInsight";
import { useState } from "react";


type InsightOption = {
  label: string;
  value: string;
}



export default function VoicebotInsights() {
  const insightOptions: InsightOption[] = [{
    label: "Overview", value: "overview"
  },
  {
    label: "Performance", value: "performance"
  },
  {
    label: "Sentiment", value: "sentiment"
  },
  {
    label: "Actions", value: "actions"
  }

  ]

  const [insightOption, setInsightOption] = useState<string>(insightOptions[0].value);


  return (
    <div className="space-y-6 my-2">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Insights & Analytics</h1>
          <p className="text-text-muted mt-1">
            Track performance, analyze trends, and optimize your AI agents
          </p>
        </div>
        <Select
          value={insightOption}
          onValueChange={(value) => setInsightOption(value as string)}

        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {
              insightOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))
            }

          </SelectContent>
        </Select>
      </div>

      <div>
        {
          insightOption === "overview" && (
            <OverviewInsight />
          )
        }
        {
          insightOption === "performance" && (
            <PerformanceInsight />
          )
        }
        {
          insightOption === "sentiment" && (
            <SentimentInsight />
          )
        }
        {
          insightOption === "actions" && (
            <ActionsInsight />
          )
        }

      </div>


    </div>
  );
}

