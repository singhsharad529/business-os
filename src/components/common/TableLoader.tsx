import { Skeleton } from "../ui/skeleton";

interface TableLoaderProps {
    rows?: number;
    columns?: number;
}

export default function TableLoader({ rows = 5, columns = 5 }: TableLoaderProps) {
    return (
        <div className="w-full overflow-hidden rounded-xl border border-border bg-white">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-bg border-b border-border">
                            {Array.from({ length: columns }).map((_, i) => (
                                <th key={`header-${i}`} className="py-4 px-3 text-left">
                                    <Skeleton className="h-4 w-20" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <tr key={`row-${rowIndex}`} className="hover:bg-bg transition-colors">
                                {Array.from({ length: columns }).map((_, colIndex) => (
                                    <td key={`col-${colIndex}`} className="py-4 px-3">
                                        <div className="space-y-2">
                                            <Skeleton className={`h-4 ${colIndex === 0 ? 'w-32' : 'w-20'}`} />
                                            {colIndex === 0 && <Skeleton className="h-3 w-20 opacity-50" />}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
