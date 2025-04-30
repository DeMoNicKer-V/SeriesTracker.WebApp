// components/LoadingErrorContext.tsx
"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";
import useSWR from "swr"; // Установите swr
import { fetcher } from "../utils/fetcher"; //  Ваш fetcher (см. ниже)

interface LoadingErrorContextType {
    isLoading: boolean; // Заменили loading на isLoading, чтобы соответствовать терминологии SWR
    error: Error | null;
    data: any; //  Замените any на тип ваших данных
    mutate: any; //  Функция для обновления данных (для перерендера)
    clearError: () => void;
}

const LoadingErrorContext = createContext<LoadingErrorContextType | undefined>(
    undefined
);

export const useLoadingError = () => {
    const context = useContext(LoadingErrorContext);
    if (!context) {
        throw new Error(
            "useLoadingError must be used within a LoadingErrorProvider"
        );
    }
    return context;
};

export const LoadingErrorProvider: React.FC<{
    children: ReactNode;
    url: string; // URL для запроса (обязательный параметр)
    options?: any; // Дополнительные опции для SWR
    // Замените any на тип ваших данных
}> = ({ children, url, options }) => {
    const { data, error, isLoading, mutate } = useSWR(url, fetcher, options); // Использование useSWR

    const clearError = () => {
        // Очищаем ошибку
        if (error) {
            console.log("Clearing error"); // Для отладки
        }
        // Здесь очистка ошибки происходит автоматически через SWR
    };

    const value: LoadingErrorContextType = {
        isLoading,
        error,
        data,
        mutate,
        clearError,
    };

    return (
        <LoadingErrorContext.Provider value={value}>
            {children}
        </LoadingErrorContext.Provider>
    );
};
