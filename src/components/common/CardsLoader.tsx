
import { Skeleton } from '../ui/skeleton'

function CardsLoader() {
    return (
        <div className='space-y-4'>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-[360px]">
                {
                    [1, 2, 3, 4, 5, 6].map((item: number) => (
                        <div key={item} className="rounded-xl border border-border-subtle overflow-hidden">
                            <Skeleton className="w-full h-full rounded-xl" />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default CardsLoader;