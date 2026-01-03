
import { Skeleton } from '../ui/skeleton'

function SideSheetLoader() {
    return (
        <div className="space-y-4">
            <Skeleton className="w-full h-20" />
            <Skeleton className="w-full h-40" />
            <Skeleton className="w-full h-60" />


        </div>
    )
}

export default SideSheetLoader