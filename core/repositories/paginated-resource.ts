export interface PaginatedResponse<T> {
    hasMore: boolean;
    data: T[];
}

export interface PaginationFilter {
    skip?: number;
    limit?: number;
}