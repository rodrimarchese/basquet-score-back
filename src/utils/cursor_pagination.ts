import {CursorPagination} from "@types";

interface PaginatedResponse {
    cursor: {
        id: string | undefined;
    },
    skip: number | undefined;
    take: number | undefined;
    orderBy: { [key: string]: string }[]
}

export const paginatedResponse = (options?: CursorPagination): PaginatedResponse | {} => {
    const order = {
        orderBy: [
            {
                createdAt: 'desc',
            },
            {
                id: 'asc',
            },
        ]
    }
    if (options && (options.before || options.after || options.limit)) {
        return {
            cursor: options.after ?? options.before ? {
                id: options.after ?? options.before
            } : undefined,
            skip: options.after || options.before ? 1 : undefined,
            take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
            ...order
        }
    } else return order
}
