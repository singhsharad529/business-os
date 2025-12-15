// GenericBarChart.tsx
import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

type Series = {
    key: string
    label: string
    color: string
}

type Props = {
    data: any[]
    series: Series[]
}

export default function GenericBarChart({ data, series }: Props) {
    const config = Object.fromEntries(
        series.map((s) => [
            s.key,
            { label: s.label, color: s.color },
        ])
    )

    return (
        <ChartContainer config={config} className="h-[300px] w-full">
            <BarChart data={data}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}

            >
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" />

                <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    height={28}
                    className="text-xs fill-text-muted"
                />

                <YAxis
                    width={32}
                    tickLine={false}
                    axisLine={false}
                    className="text-xs fill-text-muted"
                />

                <ChartTooltip content={<ChartTooltipContent />} />

                {series.map((s) => (
                    <Bar
                        key={s.key}
                        dataKey={s.key}
                        fill={s.color}
                        radius={4}
                    />
                ))}
            </BarChart>
        </ChartContainer>
    )
}
