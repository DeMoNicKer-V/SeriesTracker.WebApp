"use client";
import { List, Segmented } from "antd";
import { useEffect, useState } from "react";
import { CalendarItem, aaa } from "../services/shikimori";

interface customDate {
    label: string;
    value: Date;
}
export default function CalendarPage() {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const firstDayOfWeek =
        currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    const startDate = new Date(currentDate.setDate(firstDayOfWeek));

    function getDatesForCurrentWeek(): customDate[] {
        const datesArray = [];

        const days = [
            "Понедельник",
            "Вторник",
            "Среда",
            "Четверг",
            "Пятница",
            "Суббота",
            "Воскресенье",
        ];
        for (let i = 0; i < 7; i++) {
            const newDate = new Date(startDate);
            newDate.setDate(startDate.getDate() + i);
            datesArray.push({
                value: newDate,
                label: days[i % 7],
            });
        }

        console.log(datesArray);
        return datesArray;
    }

    function isDatesEqual(date1: Date, date2: Date) {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    }

    const getFiltered = (value: Date) => {
        const filteredData = aa.filter((item: CalendarItem) =>
            isDatesEqual(new Date(item.next_episode_at), value)
        );
        console.log(filteredData);
        setFilter(filteredData);
    };

    const [genres, setGenres] = useState<customDate[] | any>([]);
    const [value, setValue] = useState<Date>();
    const [aa, setAA] = useState<CalendarItem[] | any>([]);
    const [filter, setFilter] = useState<CalendarItem[] | any>([]);

    const getGenresList = async () => {
        const list = await aaa();
        setAA(list);
    };

    useEffect(() => {
        const b = getDatesForCurrentWeek();
        getGenresList();
        setGenres(b);
    }, []);

    useEffect(() => {
        console.log(value);
    }, [value]);
    return (
        <div className="container">
            <Segmented<Date>
                options={genres}
                defaultValue={startDate}
                onChange={(value) => {
                    getFiltered(value);
                }}
            />
            <List
                dataSource={filter}
                renderItem={(item: CalendarItem) => (
                    <List.Item>
                        <div>{item.anime.id}</div>
                    </List.Item>
                )}
            />
        </div>
    );
}
