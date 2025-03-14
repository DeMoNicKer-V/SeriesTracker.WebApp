import { UserRequest } from "../Models/User/Requests/UserRequest";

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
        headers: {
            "content-type": "application/json",
        },
        credentials: "include",
    });
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
