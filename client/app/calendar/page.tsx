"use client";
import {
    Col,
    List,
    Row,
    Segmented,
    Image,
    Card,
    Typography,
    Flex,
    Spin,
    ConfigProvider,
    Tabs,
    TabsProps,
} from "antd";
import { useEffect, useState } from "react";
import { CalendarItem, getAiredAnimes } from "../services/shikimori";

import {
    CheckCircleOutlined,
    QuestionCircleOutlined,
    ClockCircleOutlined,
    InfoCircleOutlined,
    LoadingOutlined,
} from "@ant-design/icons";
import Link from "next/link";
interface customDate {
    label: JSX.Element;
    key: string;
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
                key: newDate.toString(),
                label: (
                    <Flex
                        style={{
                            textAlign: "center",
                            padding: 4,
                            flexDirection: "column",
                        }}
                    >
                        <Text strong style={{ fontSize: 16 }}>
                            {days[newDate.getDay()]}
                        </Text>
                        <Text italic style={{ fontSize: 15 }}>
                            {formatDate(newDate)}
                        </Text>
                    </Flex>
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
    const customizeRenderEmpty = () => (
        <Flex className="emptyview" justify="center" align="middle" gap={10}>
            <InfoCircleOutlined style={{ fontSize: 32 }} />
            <Text style={{ fontSize: 22 }}>
                {"На данную дату новых релизов не найдено"}
            </Text>
        </Flex>
    );

    const customizeRenderEmptyLoading = () => (
        <Flex className="emptyview" justify="center" align="middle" gap={10}>
            <LoadingOutlined style={{ fontSize: 32 }} />
            <Text style={{ fontSize: 22 }}>
                {"Пожалуйста, подождите немного!"}
            </Text>
        </Flex>
    );

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

    const filterItems = (items: CalendarItem[]) => {
        const filteredData = items.filter((item: CalendarItem) =>
            isDatesEqual(new Date(item.next_episode_at), value)
        );
        filteredData.length <= 0 ? setLoading(false) : setLoading(true);
        console.log(value);
        setFilter(filteredData);
    };
    const getGenresList = async () => {
        const list = await getAiredAnimes();
        filterItems(list);
        setAA(list);
    };
    const [value, setValue] = useState<Date>(new Date());

    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        return () => {
            const b = getDatesArray();
            setGenres(b);
            setValue(new Date(b[0].key));
            getGenresList();
        };
    }, []);
    const { Text, Title } = Typography;
    useEffect(() => {
        if (aa.length <= 0) {
            return;
        } else filterItems(aa);
    }, [value]);

    return (
        <div className="container">
            <title>Series Tracker - Расписание</title>
            <Row gutter={[20, 20]} align={"middle"} justify={"center"}>
                <Col span={21}>
                    {filter.length > 0 && (
                        <Tabs
                            animated
                            size="large"
                            onChange={(key) => setValue(new Date(key))}
                            centered
                            items={genres}
                        />
                    )}
                </Col>
                <Col span={21}>
                    <ConfigProvider
                        theme={{
                            components: {
                                Input: {
                                    borderRadius: 8,
                                },
                            },
                        }}
                        renderEmpty={
                            loading
                                ? customizeRenderEmptyLoading
                                : customizeRenderEmpty
                        }
                    >
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
                                                style={{
                                                    width: "100%",
                                                    padding: 15,
                                                }}
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
                    </ConfigProvider>
                </Col>
            </Row>
        </div>
    );
}
