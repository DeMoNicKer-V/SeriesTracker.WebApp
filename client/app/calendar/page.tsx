"use client";
import {
    Col,
    List,
    Row,
    Image,
    Card,
    Typography,
    Flex,
    ConfigProvider,
    Tabs,
    Descriptions,
    Badge,
    Tag,
} from "antd";
import { useEffect, useState } from "react";
import { CalendarItem, getAiredAnimes } from "../services/shikimori";

import {
    CheckCircleOutlined,
    QuestionCircleOutlined,
    ClockCircleOutlined,
    InfoCircleOutlined,
    LoadingOutlined,
    FireFilled,
} from "@ant-design/icons";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import styles from "./page.module.css";
import LoadAnimateImage from "../components/LoadAnimateImage";
dayjs.locale("ru");
interface CalendarDateLabel {
    label: JSX.Element;
    key: string;
}
const { Text, Title } = Typography;

function isDateEqual(date1: Date, date2: Date) {
    return (
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

function capitalizeFirstLetter(str: string): string {
    if (!str) return "";
    return str[0].toUpperCase() + str.slice(1);
}

function dateComparer(date1: Date, date2: Date): JSX.Element {
    if (date1.getTime() > date2.getTime()) {
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
    } else return <ClockCircleOutlined style={{ color: "#faad14" }} />;
}
const dateNow = new Date();

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
    const [loading, setLoading] = useState<boolean>(true);
    const [weekDays] = useState<CalendarDateLabel[]>(getDatesArray());
    const [airedAnimes, setAiredAnimes] = useState<CalendarItem[]>([]);
    const [filteredAnimes, setFilterAnimes] = useState<CalendarItem[]>([]);

    const filterItems = (items: CalendarItem[], filterDate: Date) => {
        const filteredData = items.filter((item: CalendarItem) =>
            isDateEqual(new Date(item.next_episode_at), filterDate)
        );
        setFilterAnimes(filteredData);
    };
    const getGenresList = async () => {
        const list = await getAiredAnimes();
        setAiredAnimes(list);
        filterItems(list, dateNow);
        setLoading(false);
    };

    const onChangeDate = (key: string) => {
        const filterDate = new Date(dateNow);
        filterDate.setDate(dateNow.getDate() + Number(key));
        filterItems(airedAnimes, filterDate);
    };

    useEffect(() => {
        return () => {
            getGenresList();
        };
    }, []);

    return (
        <div className="container">
            <title>Series Tracker - Календарь выхода</title>
            <Row justify={"center"}>
                <Col span={22}>
                    <Tabs
                        onChange={(key) => onChangeDate(key)}
                        centered
                        items={weekDays}
                    />

                    <ConfigProvider renderEmpty={customizeRenderEmpty}>
                        <List
                            loading={{
                                tip: (
                                    <Text style={{ fontSize: 22 }}>
                                        {"Пожалуйста, подождите..."}
                                    </Text>
                                ),
                                spinning: loading,
                                indicator: (
                                    <LoadingOutlined style={{ fontSize: 32 }} />
                                ),
                                size: "large",
                                style: { color: "white" },
                            }}
                            bordered={false}
                            dataSource={filteredAnimes}
                            renderItem={(item: CalendarItem) => (
                                <List.Item style={{ border: "none" }}>
                                    <Link href={`/shikimori/${item.anime.id}`}>
                                        <Badge.Ribbon
                                            color="volcano"
                                            style={
                                                item.next_episode ===
                                                item.anime.episodes
                                                    ? {}
                                                    : { display: "none" }
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
                                                            src={`https://desu.shikimori.one${item.anime.image.preview}`}
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
                                                            {item.anime.russian
                                                                ? item.anime
                                                                      .russian
                                                                : item.anime
                                                                      .name}
                                                        </Text>
                                                        <Descriptions
                                                            items={[
                                                                {
                                                                    key: "1",
                                                                    label: "Вышло",
                                                                    children: (
                                                                        <Flex
                                                                            gap={
                                                                                5
                                                                            }
                                                                        >
                                                                            <Text>
                                                                                {
                                                                                    item
                                                                                        .anime
                                                                                        .episodes_aired
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
                                                            marginLeft: "auto",
                                                        }}
                                                        lg={2}
                                                        xl={2}
                                                        xxl={2}
                                                    >
                                                        <Title level={4}>
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
                                        </Badge.Ribbon>
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
