"use client";
import { Col, Row } from "antd";
import { useCallback, useEffect, useState } from "react";

import dayjs from "dayjs";
import "dayjs/locale/ru";

import useSWR from "swr";
import { getCalendarAnimes } from "../api/animes/calendar/getCalendarAnime";
import { GET_CALENDAR_ANIMES_URL } from "../api/endpoints";
import { CalendarAnimeItem } from "../models/anime/CalendarAnimeItem";
dayjs.locale("ru");

import CalendarHeader from "../components/CalendarComponents/CalendarHeader";
import CalendarList from "../components/CalendarComponents/CalendarList";
import { CalendarDateLabel, getDatesArray } from "../utils/dateUtils";

// Основной компонент CalendarPage: Отображает календарь аниме
export default function CalendarPage() {
    // Состояние для хранения массива меток дат (для отображения заголовков в календаре)
    const [weekDays] = useState<CalendarDateLabel[]>(getDatesArray());

    // Состояние для хранения выбранной даты (для фильтрации аниме)
    const [filterDate, setFilterDate] = useState<Date>(new Date());

    // Состояние для хранения отфильтрованного списка аниме для отображения
    const [filterAnimes, setFilterAnimes] = useState<CalendarAnimeItem[]>([]);

    // Функция для проверки равенства двух дат (используем useCallback для оптимизации)
    const isDateEqual = useCallback((date1: Date, date2: Date) => {
        return (
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    }, []);

    // Функция для обработки изменения даты (используем useCallback для оптимизации)
    const onChangeDate = useCallback(
        (key: string) => {
            const newFilterDate = new Date(); // Создаем новую дату
            newFilterDate.setDate(newFilterDate.getDate() + Number(key)); // Изменяем дату
            setFilterDate(newFilterDate); // Обновляем состояние с новой датой
        },
        [setFilterDate]
    );

    // Получаем данные аниме из SWR
    const { data: airedAnimes, isLoading } = useSWR<CalendarAnimeItem[]>(
        GET_CALENDAR_ANIMES_URL, // Ключ для запроса (используем эндпоинт)
        getCalendarAnimes, // Функция для получения данных (из api)
        {
            revalidateOnFocus: false, // Отключаем перепроверку при фокусе
            revalidateOnReconnect: false, // Отключаем перепроверку при переподключении
            errorRetryCount: 0, // Количество попыток перезагрузки в случае ошибки
        }
    );

    // Функция для фильтрации аниме по дате (используем useCallback для оптимизации)
    const filterItems = useCallback(
        (items: CalendarAnimeItem[], filterDate: Date) => {
            return items.filter((item: CalendarAnimeItem) =>
                isDateEqual(new Date(item.nextEpisodeAt), filterDate)
            );
        },
        [isDateEqual]
    );

    // Эффект для фильтрации аниме при изменении данных или фильтра
    useEffect(() => {
        if (airedAnimes) {
            setFilterAnimes(filterItems(airedAnimes, filterDate)); // Вызываем функцию фильтрации
        }
    }, [airedAnimes, filterDate, filterItems]);

    return (
        <div className="container">
            <title>Series Tracker - Календарь выхода</title>
            <Row justify={"center"}>
                <Col span={22}>
                    <CalendarHeader
                        loading={isLoading}
                        weekDays={weekDays}
                        onChangeDate={onChangeDate}
                    />

                    <CalendarList animes={filterAnimes} loading={isLoading} />
                </Col>
            </Row>
        </div>
    );
}
