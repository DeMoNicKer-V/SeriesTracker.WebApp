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
