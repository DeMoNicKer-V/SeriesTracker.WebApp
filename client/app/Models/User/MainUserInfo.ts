import { SeriesGroup } from "../Series/SeriesGroup";

export interface MainUserInfo {
    email: string;
    userName: string;
    avatar: string;
    name: string;
    surName: string;
    dateBirth: string;
    regDate: string;
    roleId: number;
    seriesGroup: SeriesGroup[];
    seriesIDS: string;
}

export const defaultUserValues = {
    email: "",
    userName: "",
    avatar: "",
    name: "",
    surName: "",
    dateBirth: "",
    regDate: "",
    roleId: 0,
    seriesGroup: [],
    seriesIDS: "",
};
