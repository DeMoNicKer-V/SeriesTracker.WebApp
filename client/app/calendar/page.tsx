"use client";
import {
    Badge,
    Card,
    Col,
    ConfigProvider,
    Descriptions,
    Flex,
    List,
    Row,
    Skeleton,
    Tabs,
    Tag,
    Typography,
} from "antd";
import { useCallback, useEffect, useState } from "react";

import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    FireFilled,
    InfoCircleOutlined,
    QuestionCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import Link from "next/link";
import LoadAnimateImage from "../components/LoadAnimateImage";
import styles from "./page.module.css";

import useSWR from "swr";
import { getCalendarAnimes } from "../api/animes/calendar/getCalendarAnime";
import { GET_CALENDAR_ANIMES_URL } from "../api/endpoints";
import DaysWeekSkeleton from "../components/DaysWeekSkeleton";
import {
    CalendarAnimeItem,
    defaultCalendarAnimeValues,
} from "../models/anime/CalendarAnimeItem";
dayjs.locale("ru");

interface CalendarDateLabel {
    label: JSX.Element;
    key: string;
}
const { Text, Title } = Typography;

function capitalizeFirstLetter(str: string): string {
    if (!str) return "";
    return str[0].toUpperCase() + str.slice(1);
}

function dateComparer(date1: Date, date2: Date): JSX.Element {
    if (date1.getTime() > date2.getTime()) {
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
    } else return <ClockCircleOutlined style={{ color: "#faad14" }} />;
}

const customizeRenderEmpty = () => (
    <Flex className="emptyview" justify="center" align="middle" gap={10}>
        <InfoCircleOutlined style={{ fontSize: 32 }} />
        <Text style={{ fontSize: 22 }}>
            {"На данную дату новых релизов не найдено"}
        </Text>
    </Flex>
);

const getDatesArray = () => {
    const datesArray = [];
    const currentDate = new Date();

    for (let i = 0; i < 7; i++) {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + i);
        datesArray.push({
            key: i.toString(),
            label: (
                <Flex
                    className="flex-column"
                    style={{
                        textAlign: "center",
                        padding: 4,
                    }}
                >
                    <Title level={5}>
                        {capitalizeFirstLetter(dayjs(newDate).format("dddd"))}
                    </Title>
                    <Text italic type="secondary">
                        {dayjs(newDate).format("D MMMM")}
                    </Text>
                </Flex>
            ),
        });
    }

    return datesArray;
};

export default function CalendarPage() {
    const [weekDays] = useState<CalendarDateLabel[]>(getDatesArray());
    const [filterDate, setFilterDate] = useState<Date>(new Date());
    const [filterAnimes, setFilterAnimes] = useState<CalendarAnimeItem[]>(
        Array.from({ length: 5 }).map((_, i) => defaultCalendarAnimeValues)
    );

    const { data: airedAnimes, isLoading } = useSWR<CalendarAnimeItem[]>(
        GET_CALENDAR_ANIMES_URL,
        getCalendarAnimes,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            errorRetryInterval: 30000,
        }
    );

    const isDateEqual = useCallback((date1: Date, date2: Date) => {
        return (
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    }, []);

    const filterItems = useCallback(
        (items: CalendarAnimeItem[], filterDate: Date) => {
            if (!items) {
                setFilterAnimes([]);
                return;
            }

            const filteredData = items.filter((item: CalendarAnimeItem) => {
                return isDateEqual(new Date(item.nextEpisodeAt), filterDate);
            });
            setFilterAnimes(filteredData);
        },
        [isDateEqual, setFilterAnimes]
    );

    const onChangeDate = useCallback(
        (key: string) => {
            const newFilterDate = new Date();
            newFilterDate.setDate(newFilterDate.getDate() + Number(key));
            setFilterDate(newFilterDate);
        },
        [setFilterDate]
    );

    useEffect(() => {
        if (airedAnimes) {
            filterItems(airedAnimes, filterDate);
        }
    }, [airedAnimes, filterDate, filterItems]);

    return (
        <div className="container">
            <title>Series Tracker - Календарь выхода</title>
            <Row justify={"center"}>
                <Col span={22}>
                    {isLoading ? (
                        <DaysWeekSkeleton />
                    ) : (
                        <Tabs
                            onChange={(key) => onChangeDate(key)}
                            centered
                            items={weekDays}
                        />
                    )}

                    <ConfigProvider renderEmpty={customizeRenderEmpty}>
                        <List
                            dataSource={filterAnimes}
                            renderItem={(item: CalendarAnimeItem) => (
                                <List.Item
                                    key={item.anime.id}
                                    style={{ border: "none" }}
                                >
                                    <Skeleton
                                        className={styles["calendar-skeleton"]}
                                        loading={isLoading}
                                        active
                                        avatar={{
                                            className:
                                                styles[
                                                    "calendar-skeleton-image"
                                                ],
                                            shape: "square",
                                        }}
                                        paragraph={{ rows: 1 }}
                                    >
                                        <Link href={`/animes/${item.anime.id}`}>
                                            <Badge.Ribbon
                                                color="volcano"
                                                style={
                                                    item.nextEpisode ===
                                                    item.anime.episodes
                                                        ? {}
                                                        : {
                                                              display: "none",
                                                          }
                                                }
                                                text={
                                                    <Tag
                                                        className="transparent"
                                                        bordered={false}
                                                        icon={<FireFilled />}
                                                    >
                                                        Финальный эп.
                                                    </Tag>
                                                }
                                            >
                                                <Card
                                                    hoverable
                                                    className={styles.card}
                                                >
                                                    <Row align={"middle"}>
                                                        <Col>
                                                            <LoadAnimateImage
                                                                prev={false}
                                                                maxWidth={100}
                                                                src={`https://shikimori.one${item.anime.image.preview}`}
                                                            ></LoadAnimateImage>
                                                        </Col>
                                                        <Col
                                                            offset={1}
                                                            xs={14}
                                                            sm={14}
                                                            md={16}
                                                            lg={16}
                                                            xl={16}
                                                            xxl={16}
                                                        >
                                                            <Text
                                                                className={
                                                                    styles.title
                                                                }
                                                                strong
                                                            >
                                                                {item.anime
                                                                    .russian ||
                                                                    item.anime
                                                                        .name}
                                                            </Text>
                                                            <Descriptions
                                                                items={[
                                                                    {
                                                                        key: "1",
                                                                        label: "Вышло",
                                                                        children:
                                                                            (
                                                                                <Flex
                                                                                    gap={
                                                                                        5
                                                                                    }
                                                                                >
                                                                                    <Text>
                                                                                        {
                                                                                            item
                                                                                                .anime
                                                                                                .episodesAired
                                                                                        }
                                                                                    </Text>
                                                                                    <Text>
                                                                                        {
                                                                                            "из"
                                                                                        }
                                                                                    </Text>
                                                                                    {item
                                                                                        .anime
                                                                                        .episodes >
                                                                                    0 ? (
                                                                                        <Text>
                                                                                            {
                                                                                                item
                                                                                                    .anime
                                                                                                    .episodes
                                                                                            }
                                                                                        </Text>
                                                                                    ) : (
                                                                                        <QuestionCircleOutlined />
                                                                                    )}
                                                                                    <Text>
                                                                                        {
                                                                                            "эп."
                                                                                        }
                                                                                    </Text>
                                                                                </Flex>
                                                                            ),
                                                                    },
                                                                ]}
                                                            />
                                                        </Col>
                                                        <Col
                                                            offset={1}
                                                            style={{
                                                                marginLeft:
                                                                    "auto",
                                                            }}
                                                            lg={2}
                                                            xl={2}
                                                            xxl={2}
                                                        >
                                                            <Title level={4}>
                                                                {`${item.nextEpisode} эп.`}
                                                            </Title>
                                                            <Flex gap={5}>
                                                                <Text>
                                                                    {new Date(
                                                                        item.nextEpisodeAt
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
                                                                        item.nextEpisodeAt
                                                                    )
                                                                )}
                                                            </Flex>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </Badge.Ribbon>
                                        </Link>
                                    </Skeleton>
                                </List.Item>
                            )}
                        />
                    </ConfigProvider>
                </Col>
            </Row>
        </div>
    );
}
