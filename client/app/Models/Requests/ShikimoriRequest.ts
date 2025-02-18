export interface ShikimoriRequest {
    page: number;
    name?: string;
    season?: string;
    status?: string;
    kind?: string;
    genre?: string;
    order?: string;
    censored?: boolean;
}
