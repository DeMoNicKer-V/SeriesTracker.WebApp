export interface UserRequest {
    email: string;
    password: string;
    userName: string;
    avatar?: string;
    name?: string;
    surName?: string;
    dateBirth?: string;
}

export interface UserInfo {
    email: string;
    userName: string;
    avatar: string;
    name: string;
    surName: string;
    dateBirth: string;
    regDate: string;
    roleId: number;
}

export interface SeriesGroup {
    id: number;
    name: string;
    color: string;
    seriesCount: number;
}

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
export interface LoginRequest {
    email: string;
    password: string;
}

export interface CategoryCount {
    key: string;
    value: number;
}

export const registerUser = async (
    request: UserRequest
): Promise<string | null> => {
    const response = await fetch(`http://localhost:5125/user/register`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(request),
    });

    if (response.ok) {
        return null; // Возвращаем null при успехе
    } else {
        try {
            const errorData = await response.json(); // Попытка распарсить JSON
            return errorData.message || "Произошла ошибка. Попробуйте позже."; // Возвращаем сообщение об ошибке из JSON или сообщение по умолчанию
        } catch (error) {
            console.error("Ошибка при разборе JSON:", error); // Логируем ошибку парсинга
            return "Произошла непредвиденная ошибка. Попробуйте позже."; // Возвращаем общее сообщение об ошибке
        }
    }
};

export const login = async (request: LoginRequest) => {
    const response = await fetch(`http://localhost:5125/user/login`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(request),
        credentials: "include",
    });

    if (response.ok) {
        return null; // Возвращаем null при успехе
    } else {
        try {
            const errorData = await response.json(); // Попытка распарсить JSON
            return errorData.message || "Произошла ошибка. Попробуйте позже."; // Возвращаем сообщение об ошибке из JSON или сообщение по умолчанию
        } catch (error) {
            console.error("Ошибка при разборе JSON:", error); // Логируем ошибку парсинга
            return "Произошла непредвиденная ошибка. Попробуйте позже."; // Возвращаем общее сообщение об ошибке
        }
    }
};

export const verify = async (request: LoginRequest) => {
    const response = await fetch(`http://localhost:5125/user/verify`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(request),
        credentials: "include",
    });
    if (response.status !== 200) {
        return response.json();
    }
};

export const getUserById = async (id: string) => {
    const response = await fetch(`http://localhost:5125/user/id/${id}`);
    const user: User = await response.json();
    return user;
};

export const updateUser = async (
    username: string,
    userRequset: UserRequest
) => {
    const response = await fetch(
        `http://localhost:5125/user/update/${username}`,
        {
            method: "PUT",
            credentials: "include",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(userRequset),
        }
    );
    return response.status;
};

export const changeUserRole = async (userId: string, roleId: number) => {
    const response = await fetch(
        `http://localhost:5125/user/changeUserRole/${userId}`,
        {
            method: "PUT",
            credentials: "include",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(roleId),
        }
    );
    return response.status;
};

export const deleteUserByUsername = async (username: string) => {
    await fetch(`http://localhost:5125/user/deleteUser/${username}`, {
        method: "DELETE",
        headers: {
            "content-type": "application/json",
        },
        credentials: "include",
    });
};

export const deleteSelfAccount = async (username: string) => {
    await fetch(`http://localhost:5125/user/deleteSelf/${username}`, {
        method: "DELETE",
        headers: {
            "content-type": "application/json",
        },
        credentials: "include",
    });
};

export const deleteSeriesByUsername = async (username: string) => {
    await fetch(`http://localhost:5125/user/deleteSeries/${username}`, {
        method: "DELETE",
    });
};

export const getUserCategoriesCount = async (username: string) => {
    const response = await fetch(
        `http://localhost:5125/user/categoryCount?username=${username}`
    );
    const series: CategoryCount[] = await response.json();
    return series;
};

export const checkExistEmail = async (email: string) => {
    const response = await fetch(
        `http://localhost:5125/user/email?email=${email}`
    );
    if (response.status !== 200) {
        return true;
    }
    return false;
};

export const checkExistUserName = async (username: string) => {
    const response = await fetch(
        `http://localhost:5125/user/username?username=${username}`
    );
    if (response.status !== 200) {
        return true;
    }
    return false;
};

export const getUserList = async () => {
    const response = await fetch(`http://localhost:5125/user`);
    const user: User[] = await response.json();
    return user;
};
export const getUserByUserName = async (username: string) => {
    const response = await fetch(
        `http://localhost:5125/user/username/${username}`
    );
    if (!response.ok) {
        return null;
    }
    const user: MainUserInfo = await response.json();
    return user;
};
