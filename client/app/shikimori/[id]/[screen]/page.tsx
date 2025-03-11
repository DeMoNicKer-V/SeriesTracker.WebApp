"use client";
import { getAnimeById } from "@/app/services/shikimori";
import { Breadcrumb, Card, Row, Col, Tooltip } from "antd";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LongLeftArrow } from "@/app/img/LongLeftArrow";
import { ShikimoriLogo } from "@/app/img/ShikimoriLogo";
import ScreenshotsPreview from "@/app/components/AnimeDetailDescription/ScreenshotsPreview";
import Loading from "@/app/components/Loading";
import { Anime } from "@/app/Models/Anime/Anime";

export default function ScreenshotPage({ params }: { params: { id: string } }) {
    const [animes, setAnimes] = useState<Anime[] | any>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const getAnimes = async (id: string) => {
        const anime = await getAnimeById(id);
        setAnimes(anime);
        setLoading(false);
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
            <Loading loading={loading} />
            {loading === false && (
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

                    <Col span={24}>
                        <Card>
                            <ScreenshotsPreview
                                screenshots={animes.screenshots}
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
            )}
        </div>
    );
}
