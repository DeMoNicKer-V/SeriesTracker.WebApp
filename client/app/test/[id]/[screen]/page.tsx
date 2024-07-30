"use client";
import { getAnimeById } from "@/app/services/shikimori";
import { Breadcrumb, List, Spin, Image, Card, Flex, Button } from "antd";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { LongLeftArrow } from "@/app/img/LongLeftArrow";

export default function ScreenshotPage({ params }: { params: { id: string } }) {
    const [animes, setAnimes] = useState<Anime[] | any>([]);
    const [screen, setScreen] = useState<Screenshot[]>([]);
    const [screenLoading, setScreenLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const getAnimes = async (id: string) => {
        const series = await getAnimeById(id);
        setAnimes(series.anime);
        setScreen(series.anime.screenshots);

        setLoading(true);
    };
    useEffect(() => {
        if (params.id) {
            getAnimes(params.id);
        }
    }, []);
    return (
        <div className="container">
            <title>
                {!animes.title
                    ? "Series Tracker"
                    : `Series Tracker - ${animes.title} - Кадры`}
            </title>
            <Spin
                size="large"
                spinning={screenLoading}
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                }}
            />
            <Flex align="center">
                <Link
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        fontStyle: "italic",
                        marginLeft: 0,
                        marginRight: 10,
                        fontSize: 12,
                        alignItems: "center",
                    }}
                    href={"./"}
                >
                    <LongLeftArrow />
                    Назад
                </Link>
                <Title style={{ margin: 0 }} level={2}>
                    {animes.title}
                </Title>
            </Flex>
            {loading && (
                <Breadcrumb
                    items={[
                        {
                            title: <a href="/shikimori">Shikimori</a>,
                        },

                        {
                            title: <Link href={"./"}>{animes.title}</Link>,
                        },
                        {
                            title: "Кадры",
                        },
                    ]}
                />
            )}
            {loading && screen && (
                <Card>
                    <Image.PreviewGroup>
                        <List
                            style={{ padding: 10 }}
                            grid={{
                                gutter: 16,
                                xs: 2,
                                sm: 3,
                                md: 3,
                                lg: 4,
                                xl: 5,
                                xxl: 6,
                            }}
                            dataSource={screen}
                            renderItem={(item: Screenshot) => (
                                <List.Item>
                                    <Image
                                        style={{ maxWidth: 300 }}
                                        preview
                                        src={item.originalUrl}
                                    ></Image>
                                </List.Item>
                            )}
                        />
                    </Image.PreviewGroup>
                </Card>
            )}
        </div>
    );
}
