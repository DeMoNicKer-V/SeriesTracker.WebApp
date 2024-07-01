import { useEffect, useState } from "react";
import { CalendarItem, aaa } from "../services/shikimori";
import {
    Card,
    Col,
    Divider,
    Drawer,
    Image,
    Flex,
    List,
    Row,
    Button,
    Typography,
    Segmented,
} from "antd";
import Link from "next/link";

import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

function addDays(date: Date, days: number): Date {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
const currentDate = new Date();
const nextDate = addDays(currentDate, 1);

interface customDate {
    label: String;
    value: Date;
}

export const SeriesDrawer = ({ isOpen, onClose }: Props) => {
    const dates: customDate[] = [
        { label: "Сегодня", value: currentDate },
        {
            label: "Завтра",
            value: nextDate,
        },
    ];
    const [value, setValue] = useState<Date>(currentDate);

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

    const [aa, setAA] = useState<CalendarItem[] | any>([]);
    const [filter, setFilter] = useState<CalendarItem[] | any>([]);
    const getGenresList = async () => {
        const list = await aaa();
        const filteredData = list.filter((item: CalendarItem) =>
            isDatesEqual(new Date(item.next_episode_at), new Date())
        );
        setFilter(filteredData);
        setAA(list);
    };

    useEffect(() => {
        getGenresList();
    }, []);

    useEffect(() => {
        const filteredData = aa.filter((item: CalendarItem) =>
            isDatesEqual(new Date(item.next_episode_at), value)
        );
        setFilter(filteredData);
    }, [value]);

    const { Text, Title } = Typography;

    return (
        <Drawer
            title={
                <Row justify={"end"} align={"middle"}>
                    <Col span={16}>
                        <Title italic style={{ margin: 0 }} level={5}>
                            Ближайшие релизы
                        </Title>
                    </Col>
                    <Col span={8}>
                        <Button type="text" href={"/calendar"}>
                            <Text strong style={{ color: "#DE1EB2" }} italic>
                                Подробнее
                            </Text>
                        </Button>
                    </Col>
                </Row>
            }
            onClose={onClose}
            open={isOpen}
        >
            <Segmented<Date>
                block
                options={dates}
                defaultValue={dates[0].value}
                onChange={(value) => {
                    setValue(value);
                }}
            />
            <Title italic level={4} style={{ textAlign: "center", margin: 10 }}>
                {new Date(value).toLocaleDateString("ru-RU", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                })}
            </Title>
            <List
                bordered={false}
                dataSource={filter}
                renderItem={(item: CalendarItem) => (
                    <List.Item style={{ border: "none" }}>
                        <Link
                            style={{ width: "100%" }}
                            href={`/shikimori/${item.anime.id}`}
                        >
                            <Card hoverable style={{ padding: 10 }}>
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
                                            width={50}
                                            src={`https://desu.shikimori.one${item.anime.image.preview}`}
                                        ></Image>
                                    </Col>
                                    <Col offset={1} span={19}>
                                        <Title
                                            className="calendar-card-text-drawer"
                                            level={5}
                                        >
                                            {item.anime.russian
                                                ? item.anime.russian
                                                : item.anime.name}
                                        </Title>
                                        <Row justify={"end"}>
                                            <Col>
                                                <Flex
                                                    justify="center"
                                                    align="center"
                                                    gap={5}
                                                >
                                                    <Text>
                                                        {`${item.next_episode} эп.`}
                                                    </Text>
                                                    <Divider type="vertical" />
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
                                    </Col>
                                </Row>
                            </Card>
                        </Link>
                    </List.Item>
                )}
            />
        </Drawer>
    );
};
export default SeriesDrawer;
