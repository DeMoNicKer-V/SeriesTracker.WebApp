"use client";
import { getAnimeById } from "@/app/services/shikimori";
import {
    Breadcrumb,
    List,
    Spin,
    Image,
    Card,
    Flex,
    Button,
    Row,
    Col,
    Tooltip,
} from "antd";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { LongLeftArrow } from "@/app/img/LongLeftArrow";
import { ShikimoriLogo } from "@/app/img/ShikimoriLogo";

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
                    : `Series Tracker - ${animes.subTitle} / Кадры`}
            </title>
            <Spin
                size="large"
                spinning={loading}
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                }}
            />
            {loading && (
                <Row>
                    <Col span={24}>
                        <Title italic level={3}>
                            {animes.title}
                        </Title>
                    </Col>
                    <Col span={24}>
                        <Breadcrumb
                            separator=""
                            items={[
                                {
                                    title: (
                                        <Tooltip title="На главную">
                                            <Link
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                                href="/shikimori"
                                            >
                                                <ShikimoriLogo />
                                            </Link>
                                        </Tooltip>
                                    ),
                                },
                                {
                                    type: "separator",
                                    separator: ":",
                                },
                                {
                                    title: (
                                        <Link
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                fontStyle: "italic",
                                                gap: 5,
                                                fontSize: 11,
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                            href={"./"}
                                        >
                                            <LongLeftArrow />
                                            Назад к аниме
                                        </Link>
                                    ),
                                },

                                {
                                    type: "separator",
                                },
                                {
                                    title: "Кадры",
                                },
                            ]}
                        />
                    </Col>
                </Row>
            )}
            {loading && (
                <Card>
                    <Image.PreviewGroup>
                        <List
                            className="animes-list"
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
