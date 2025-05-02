"use client";

import AnimeDataProvider from "@/app/components/AnimeDataProvider";
import ScreenshotsPreview from "@/app/components/AnimeDetailDescription/ScreenshotsPreview";
import Loading from "@/app/components/Loading";
import { ShikimoriLogo } from "@/app/img/ShikimoriLogo";
import { Breadcrumb, Card, Col, Row, Tooltip } from "antd";
import Title from "antd/es/typography/Title";
import Link from "next/link";

// Основной компонент ScreenshotPage: Отображает страницу скриншотов (предположительно, для аниме)
export default function ScreenshotPage({ params }: { params: { id: string } }) {
    return (
        <div className="container">
            {/*Используем кастомный хук для получения аниме по id*/}
            <AnimeDataProvider animeId={params.id}>
                {({ anime, isLoading, error }) => {
                    <title>{`Series Tracker - ${anime.subTitle} / Кадры`}</title>;
                    if (isLoading) {
                        return <Loading loading />;
                    }

                    // Остальной контент страницы со скриншотами, использующий anime
                    return (
                        <Row>
                            <Col span={24}>
                                <Title italic level={3}>
                                    {anime.title}
                                </Title>
                            </Col>
                            <Col span={24}>
                                <Breadcrumb
                                    style={{ marginBottom: 5 }}
                                    items={[
                                        {
                                            title: (
                                                <Tooltip title="На главную">
                                                    <Link
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                        }}
                                                        href="/animes"
                                                    >
                                                        <ShikimoriLogo />
                                                    </Link>
                                                </Tooltip>
                                            ),
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
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                    href={"./"}
                                                >
                                                    {anime.title}
                                                </Link>
                                            ),
                                        },
                                        {
                                            title: "Кадры",
                                        },
                                    ]}
                                />
                            </Col>

                            <Col span={24}>
                                <Card>
                                    <ScreenshotsPreview
                                        screenshots={anime.screenshots}
                                        maxWidth={300}
                                        grid={{
                                            gutter: 16,
                                            xs: 2,
                                            sm: 3,
                                            md: 3,
                                            lg: 4,
                                            xl: 5,
                                            xxl: 6,
                                        }}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    );
                }}
            </AnimeDataProvider>
        </div>
    );
}
