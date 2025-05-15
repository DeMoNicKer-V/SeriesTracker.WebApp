import { useCallback, useMemo, useState } from "react";
import { ShikimoriRequest } from "../models/requests/ShikimoriRequest";

// Определение интерфейса UseAnimeListResult для хука useAnimeList
interface UseAnimeListResult {
    page: number;
    request: ShikimoriRequest;
    setRequest: React.Dispatch<React.SetStateAction<ShikimoriRequest>>;
    changePage: (newPage: number) => void;
    createQueryString: (query: any) => string;
}

/**
 * @hook useAnimeList
 * @description Хук для управления списком аниме, пагинацией.
 * @returns {UseAnimeListResult} - Объект с данными и функциями для управления списком аниме.
 */
function useAnimeList(): UseAnimeListResult {
    const [page, setPage] = useState<number>(1);

    const [request, setRequest] = useState<ShikimoriRequest>({
        page: 1,
    });

    const createQueryString = useMemo(
        () => (query: any) => {
            const params = new URLSearchParams();
            for (const [name, value] of Object.entries(query)) {
                if (value !== null && value !== undefined) {
                    params.set(name, String(value));
                }
            }
            return params.toString();
        },
        []
    );

    const changePage = useCallback(
        (newPage: number) => {
            setPage(newPage);
            setRequest((prevRequest) => ({ ...prevRequest, page: newPage }));

            /**
             * @function scrollTop
             * @description Прокручивает страницу в начало.
             */
            function scrollTop() {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth",
                });
            }

            scrollTop();
        },
        [setPage, setRequest] // Убедитесь, что вы включили все зависимости, которые используются в changePage
    );

    return {
        page,
        request,
        setRequest,
        changePage,
        createQueryString,
    };
}

export default useAnimeList;
