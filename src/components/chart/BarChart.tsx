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

type GradientType = {
    start: string,
    end: string
}
type Series = {
    key: string
    label: string
    gradient: GradientType
}

type Props = {
    data: any[]
    series: Series[]
}

export default function GenericBarChart({ data, series }: Props) {
    const config = Object.fromEntries(
        series.map((s) => [
            s.key,
            {
                label: s.label,
                color: s.gradient.end,
            },
        ])
    )

    return (
        <ChartContainer config={config} className="h-[300px] w-full">
            <BarChart data={data}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
            >

                {/* Gradients */}
                <defs>
                    {series.map((s) => (
                        <linearGradient
                            key={s.key}
                            id={`gradient-${s.key}`}
                            x1="0"
                            y1="1"
                            x2="0"
                            y2="0"
                        >
                            <stop offset="0%" stopColor={s.gradient.start} />
                            <stop offset="100%" stopColor={s.gradient.end} />
                        </linearGradient>
                    ))}
                </defs>

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
                        fill={`url(#gradient-${s.key})`}
                        radius={4}
                    />
                ))}
            </BarChart>
        </ChartContainer>
    )
}
