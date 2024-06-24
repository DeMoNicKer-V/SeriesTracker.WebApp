"use client";
import { Col, List, Row, Segmented, Image, Card, Typography, Flex } from "antd";
import { useEffect, useState } from "react";
import { CalendarItem, aaa } from "../services/shikimori";

import {
    CheckCircleOutlined,
    QuestionCircleOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
interface customDate {
    label: JSX.Element;
    value: Date;
}
export default function CalendarPage() {
    function getDatesArray(): customDate[] {
        const datesArray = [];
        const currentDate = new Date();

        const days = [
            "Воскресенье",
            "Понедельник",
            "Вторник",
            "Среда",
            "Четверг",
            "Пятница",
            "Суббота",
        ];

        for (let i = 0; i < 7; i++) {
            const newDate = new Date(currentDate);
            newDate.setDate(currentDate.getDate() + i);
            datesArray.push({
                value: newDate,
                label: (
                    <div style={{ padding: 4 }}>
                        <div>{days[newDate.getDay()]}</div>
                        <div>{formatDate(newDate)}</div>
                    </div>
                ),
            });
        }

        return datesArray;
    }

    const months: string[] = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря",
    ];

    function formatDate(date: Date): string {
        const day: number = date.getDate();
        const month: number = date.getMonth();

        return `${day} ${months[month]}`;
    }
    function isDatesEqual(date1: Date, date2: Date) {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    }

    function dateComparer(date1: Date, date2: Date): JSX.Element {
        if (date1.getTime() > date2.getTime()) {
            return <CheckCircleOutlined />;
        } else return <ClockCircleOutlined />;
    }

    const [genres, setGenres] = useState<customDate[]>([]);
    const [aa, setAA] = useState<CalendarItem[] | any>([]);
    const [filter, setFilter] = useState<CalendarItem[] | any>([]);

    const getGenresList = async () => {
        const list = await aaa();
        const filteredData = list.filter((item: CalendarItem) =>
            isDatesEqual(new Date(item.next_episode_at), value)
        );
        setFilter(filteredData);
        setAA(list);
    };
    const [value, setValue] = useState<Date>(new Date());

    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const b = getDatesArray();
        setGenres(b);
        setValue(b[0].value);
        getGenresList();
    }, []);
    const { Text, Title } = Typography;
    useEffect(() => {
        const filteredData = aa.filter((item: CalendarItem) =>
            isDatesEqual(new Date(item.next_episode_at), value)
        );
        setFilter(filteredData);
    }, [value]);

    return (
        <div className="container">
            <Row gutter={[20, 20]} align={"middle"} justify={"center"}>
                <Col>
                    <Segmented<Date>
                        options={genres}
                        value={value}
                        onChange={(value) => {
                            setValue(value);
                        }}
                    />
                </Col>
                <Col span={20}>
                    {filter.length > 0 && (
                        <List
                            bordered={false}
                            dataSource={filter}
                            renderItem={(item: CalendarItem) => (
                                <List.Item style={{ border: "none" }}>
                                    <Link
                                        style={{ width: "100%" }}
                                        href={`/shikimori/${item.anime.id}`}
                                    >
                                        <Card hoverable>
                                            <Row
                                                style={{ width: "100%" }}
                                                align={"middle"}
                                                justify={"center"}
                                            >
                                                <Col span={4}>
                                                    <Image
                                                        style={{
                                                            borderRadius: 5,
                                                        }}
                                                        preview={false}
                                                        width={100}
                                                        src={`https://desu.shikimori.one${item.anime.image.preview}`}
                                                    ></Image>
                                                </Col>
                                                <Col span={14}>
                                                    <Title
                                                        className="calendar-card-text"
                                                        level={3}
                                                    >
                                                        {item.anime.russian
                                                            ? item.anime.russian
                                                            : item.anime.name}
                                                    </Title>
                                                    <Flex gap={5}>
                                                        <Text>
                                                            {
                                                                item.anime
                                                                    .episodes_aired
                                                            }
                                                        </Text>
                                                        <Text>{"из"}</Text>
                                                        {item.anime.episodes >
                                                        0 ? (
                                                            <Text>
                                                                {
                                                                    item.anime
                                                                        .episodes
                                                                }
                                                            </Text>
                                                        ) : (
                                                            <QuestionCircleOutlined />
                                                        )}
                                                        <Text>
                                                            {"эпизодов"}
                                                        </Text>
                                                    </Flex>
                                                </Col>
                                                <Col offset={4} span={2}>
                                                    <Title level={3}>
                                                        {`${item.next_episode} эп.`}
                                                    </Title>
                                                    <Flex gap={5}>
                                                        <Text>
                                                            {new Date(
                                                                item.next_episode_at
                                                            ).toLocaleTimeString(
                                                                "ru-RU",
                                                                {
                                                                    hour: "numeric",
                                                                    minute: "numeric",
                                                                }
                                                            )}
                                                        </Text>

                                                        {dateComparer(
                                                            new Date(),
                                                            new Date(
                                                                item.next_episode_at
                                                            )
                                                        )}
                                                    </Flex>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Link>
                                </List.Item>
                            )}
                        />
                    )}
                </Col>
            </Row>
        </div>
    );
}
