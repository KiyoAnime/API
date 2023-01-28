export interface WatchlistI {
    _id: number;
    user: number;
    anime: number;
    status: 'planning'|'watching'|'completed';
    
}