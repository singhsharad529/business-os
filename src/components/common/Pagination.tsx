import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    pageSize,
    totalCount,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const startRange = (currentPage - 1) * pageSize + 1;
    const endRange = Math.min(currentPage * pageSize, totalCount);

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border-subtle mt-4">
            <div className="flex-1 flex justify-between sm:hidden">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-border-subtle text-sm font-medium rounded-md text-text-main bg-bg-alt hover:bg-bg-alt/80 disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-border-subtle text-sm font-medium rounded-md text-text-main bg-bg-alt hover:bg-bg-alt/80 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-text-muted">
                        Showing <span className="font-medium">{startRange}</span> to{" "}
                        <span className="font-medium">{endRange}</span> of{" "}
                        <span className="font-medium">{totalCount}</span> results
                    </p>
                </div>
                <div>
                    <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                    >
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border-subtle bg-bg-alt text-sm font-medium text-text-muted hover:bg-bg-alt/80 disabled:opacity-50"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        {/* Simple page numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            // Only show limited numbers if many pages
                            if (
                                totalPages > 7 &&
                                page !== 1 &&
                                page !== totalPages &&
                                (page < currentPage - 1 || page > currentPage + 1)
                            ) {
                                if (page === 2 || page === totalPages - 1) {
                                    return <span key={page} className="relative inline-flex items-center px-4 py-2 border border-border-subtle bg-bg-alt text-sm font-medium text-text-muted">...</span>;
                                }
                                return null;
                            }

                            return (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    className={`relative inline-flex items-center px-4 py-2 border border-border-subtle text-sm font-medium ${currentPage === page
                                            ? "z-10 bg-primary border-primary text-white"
                                            : "bg-bg-alt text-text-muted hover:bg-bg-alt/80"
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border-subtle bg-bg-alt text-sm font-medium text-text-muted hover:bg-bg-alt/80 disabled:opacity-50"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}
