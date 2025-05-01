"use client";

import { ShikimoriLogo } from "@/app/img/ShikimoriLogo";
import { Breadcrumb, Card, Col, Row, Tooltip } from "antd";

import { getAnimeById } from "@/app/api/animes/getAnime";
import ScreenshotsPreview from "@/app/components/AnimeDetailDescription/ScreenshotsPreview";
import Loading from "@/app/components/Loading";
import PageErrorView from "@/app/components/PageErrorVIew";
import { Anime, defaultAnimeValues } from "@/app/models/anime/Anime";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import useSWR from "swr";

export default function ScreenshotPage({ params }: { params: { id: string } }) {
    const getAnime = async (id: string) => {
        const anime = await getAnimeById(id);
        return anime;
    };

    const {
        data: anime = defaultAnimeValues,
        isLoading,
        error,
    } = useSWR<Anime>(params.id, getAnime, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        errorRetryCount: 0,
    });

    if (error) {
        return <PageErrorView text={error.message} />;
    }

    return isLoading ? (
        <Loading loading />
    ) : (
        <div className="container">
            <title>{`Series Tracker - ${anime.subTitle} / Кадры`}</title>
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
                                                alignItems: "center",
                                                justifyContent: "center",
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
                                            justifyContent: "center",
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
        </div>
    );
}
