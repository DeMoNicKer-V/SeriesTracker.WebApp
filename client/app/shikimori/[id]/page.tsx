"use client";
import { Card, Col, ConfigProvider, Flex, Row, Tag } from "antd";
import { useEffect, useRef, useState } from "react";
import Meta from "antd/es/card/Meta";
import { getAnimeById } from "@/app/services/shikimori";

export default function AnimePage({ params }: { params: { id: string } }) {
    const ref = useRef<HTMLDivElement>(null);
    const [animes, setAnimes] = useState<Anime[] | any>([]);
    const getAnimes = async (id: string) => {
        console.log(id);
        const series = await getAnimeById(id);
        setAnimes(series);
    };
    useEffect(() => {
        getAnimes(params.id);
    }, []);

    const cardStyle: React.CSSProperties = {
        padding: "16px",
        height: "100%",
        alignItems: "flex-end",
    };

    return (
        <div
            className="container"
            style={{ maxWidth: 1185, marginLeft: "auto", marginRight: "auto" }}
        >
            <Flex
                style={{
                    flex: "1 0 auto",
                    maxWidth: "100%",
                    overflow: "hidden",
                    position: "relative",
                    zIndex: 0,
                    borderBottomRightRadius: "0",
                    borderBottomLeftRadius: "0",
                    borderTopRightRadius: "5px",
                    borderTopLeftRadius: "5px",
                }}
            >
                <div
                    style={{
                        flex: "1 0",
                        transition:
                            "padding-bottom 0.2s cubic-bezier(0.25, 0.8, 0.5, 1)",
                        paddingBottom: "60%",
                    }}
                ></div>
                <div
                    style={{
                        backgroundImage: `url(${animes.pictureUrl})`,
                        backgroundPosition: "top",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        height: "100%",
                        left: "0",
                        position: "absolute",
                        top: "0",
                        width: "100%",
                        zIndex: "-1",
                    }}
                ></div>
                <div
                    style={{
                        backgroundImage:
                            "linear-gradient(180deg, transparent -50%, #121212)",
                        flex: "1 0 0px",
                        maxWidth: "100%",
                        marginLeft: "-100%",
                    }}
                >
                    <Row style={cardStyle}>
                        <Col span={6}>
                            <div style={{ position: "relative", zIndex: 0 }}>
                                <div
                                    style={{
                                        flex: "1 0",
                                        transition:
                                            "padding-bottom 0.2s cubic-bezier(0.25, 0.8, 0.5, 1)",
                                        paddingBottom: "140%",
                                    }}
                                ></div>
                                <div
                                    style={{
                                        borderRadius: "5px",
                                        backgroundImage: `url(${animes.pictureUrl})`,
                                        backgroundPosition: "center center",
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "cover",
                                        height: "100%",
                                        left: "0",
                                        position: "absolute",
                                        top: "0",
                                        width: "100%",
                                        zIndex: "-1",
                                    }}
                                ></div>
                            </div>
                        </Col>
                        <Col span={18}>
                            <ConfigProvider
                                theme={{
                                    components: {
                                        Card: {
                                            colorBgContainer: "transparent",
                                            colorBorderSecondary: "trasparent",
                                            colorTextDescription: "#ffffff",
                                            colorTextHeading: "#ffffff",
                                        },
                                        Tag: {
                                            colorPrimaryHover: "red",
                                            colorFillSecondary: "red",
                                        },
                                    },
                                }}
                            >
                                <Card title={animes.title}>
                                    <Card.Grid
                                        hoverable={false}
                                        style={{
                                            width: "100%",
                                            paddingBottom: 0,
                                            paddingTop: 0,
                                        }}
                                    >
                                        <Flex ref={ref} gap="4px 0">
                                            <Tag
                                                className="tag"
                                                style={{
                                                    cursor: "default",
                                                }}
                                                onClick={() => {}}
                                                color="error"
                                            >
                                                {`Всего ${animes.episodes} эп.`}
                                            </Tag>

                                            <Tag
                                                className="tag"
                                                style={{
                                                    cursor: "default",
                                                }}
                                                onClick={() => {}}
                                                color="error"
                                            >
                                                {`Рейтинг ${animes.rating} из 10`}{" "}
                                            </Tag>
                                        </Flex>
                                    </Card.Grid>
                                    <Card.Grid
                                        hoverable={false}
                                        style={{
                                            width: "100%",
                                            color: "#ffffff",
                                            paddingBottom: 0,
                                            paddingTop: 5,
                                        }}
                                    >
                                        <div>
                                            {`Дата выхода: ${animes.startDate}`}
                                        </div>
                                    </Card.Grid>
                                </Card>
                            </ConfigProvider>
                        </Col>
                    </Row>
                </div>
            </Flex>

            <Card
                bordered={false}
                style={{
                    backgroundColor: "rgb(16, 16, 16)",
                    borderColor: "rgb(16, 16, 16)",

                    borderBottomRightRadius: "5",

                    borderBottomLeftRadius: "5",
                    borderTopRightRadius: "0",

                    borderTopLeftRadius: "0",
                }}
            >
                <Meta
                    title="Описание"
                    description={
                        animes.description === ""
                            ? "Описание отсутствует"
                            : animes.description
                    }
                />
            </Card>
        </div>
    );
}
