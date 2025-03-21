export interface UsersList {
    users: UserItem[];
    totalCount: number;
}

export interface UserItem {
    id: string;
    userName: string;
    email: string;
    regDate: string;
    roleId: number;
}
