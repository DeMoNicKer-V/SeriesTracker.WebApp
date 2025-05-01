"use client";

import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { getUserById } from "../api/user/getUser"; // Импортируем функцию для получения пользователя по ID
import { getDecodedUserToken } from "../utils/cookie"; // Импортируем функцию для декодирования токена из cookie

interface UserContextType {
    user: User | undefined; //  Информация о пользователе (может быть undefined, если пользователь не авторизован)
    setUser: (user: User | undefined) => void;
    loading: boolean;
    error: Error | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined); //  Создаем контекст для хранения информации о пользователе

export const useUser = () => {
    const context = useContext(UserContext); //  Получаем доступ к контексту пользователя

    if (!context) {
        throw new Error("useUser must be used within a UserProvider"); //  Выбрасываем ошибку, если useUser используется вне UserProvider
    }

    return context; //  Возвращаем контекст пользователя
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Функция для получения пользователя по токену из куки
    const getUser = async () => {
        var code = await getDecodedUserToken(); // Получаем декодированный токен пользователя
        if (!code) {
            return; // Если токена нет, выходим
        }
        const currentUser = await getUserById(code.userId); // Получаем пользователя по ID
        return currentUser; // Возвращаем полученного пользователя
    };

    useEffect(() => {
        async function loadUser() {
            try {
                // 1.  Пробуем получить пользователя из localStorage
                const cachedUser = localStorage.getItem("user");
                if (cachedUser) {
                    setUser(JSON.parse(cachedUser)); //  Если данные есть в localStorage, устанавливаем их в состояние
                    setLoading(false); //  Снимаем флаг загрузки
                    return; //  Используем закэшированные данные и выходим из функции
                }

                // 2.  Если нет в localStorage, загружаем пользователя из API
                const currentUser = await getUser(); //  Загружаем данные пользователя из API
                setUser(currentUser); //  Устанавливаем полученные данные в состояние

                // 3.  Сохраняем пользователя в localStorage
                if (currentUser) {
                    localStorage.setItem("user", JSON.stringify(currentUser)); //  Сохраняем данные пользователя в localStorage
                }
            } catch (err: any) {
                setError(err); //  Устанавливаем информацию об ошибке в состояние
                console.error("Error fetching user:", err); //  Выводим сообщение об ошибке в консоль
            } finally {
                setLoading(false); //  Снимаем флаг загрузки (в любом случае)
            }
        }

        loadUser(); //  Вызываем функцию для загрузки данных пользователя
    }, []); //  useEffect выполняется только один раз при монтировании компонента

    useEffect(() => {
        if (!user) {
            //  Если user стал null или undefined (выход)
            localStorage.removeItem("user");
        }
    }, [user]);
    return (
        <UserContext.Provider value={{ user, setUser, loading, error }}>
            {children}{" "}
            {/*  Передаем данные пользователя всем дочерним компонентам */}
        </UserContext.Provider>
    );
};
