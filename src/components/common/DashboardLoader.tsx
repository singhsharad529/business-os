
import { Skeleton } from '../ui/skeleton'

function DashboardLoader() {
    return (
        <div className='space-y-4'>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full h-[120px]">
                <div className="rounded-xl overflow-hidden">
                    <Skeleton className="w-full h-full rounded-xl" />
                </div>

                <div className="rounded-xl overflow-hidden">
                    <Skeleton className="w-full h-full rounded-xl" />
                </div>

                <div className="rounded-xl overflow-hidden">
                    <Skeleton className="w-full h-full rounded-xl" />
                </div>

                <div className="rounded-xl overflow-hidden">
                    <Skeleton className="w-full h-full rounded-xl" />
                </div>

            </div>

            <div className="rounded-xl w-full h-[260px] overflow-hidden">
                <Skeleton className="w-full h-full vertical rounded-xl" />
            </div>
        </div>
    )
}

export default DashboardLoader