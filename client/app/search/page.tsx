"use client";
import { Col, Empty, Flex, Input, Pagination, Row, Spin } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Series } from "../components/Series";
import { useEffect, useState } from "react";
import {
    getAllSeries,
    getAllSeriesSearch,
    getAlphabetSeries,
    getSeriesSearch,
} from "../services/series";
import {
    InfoCircleOutlined,
    FrownOutlined,
    SearchOutlined,
} from "@ant-design/icons";

export default function SearchPage() {
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const [query, setQuery] = useState<string | null>(null);
    const [alphabet, setAlphabet] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [seriesCount, setseriesCount] = useState<Series["item2"] | number>(0);
    const [series, setSeries] = useState<Series["item1"][] | any>([]);
    const router = useRouter();
    const getSeriesQuery = async (query: any) => {
        const series = await getSeriesSearch(page, query);
        setseriesCount(series["item2"]);
        setSeries(series["item1"]);

        setLoading(false);

        return;
    };

    const handle = (value: any) => {
        if (value === "") {
            router.push(`/search`);
            return;
        }
        setQuery(value);
        router.push(`?query=${value}`);
    };

    const getSeriesAlphabet = async (alphabet: any) => {
        const series = await getAlphabetSeries(page, alphabet);
        setseriesCount(series["item2"]);
        setSeries(series["item1"]);

        return;
    };

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            getSeriesQuery(query);
        }, 1000);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        if (alphabet === null) return;
        getSeriesAlphabet(alphabet);
    }, [alphabet]);

    useEffect(() => {
        setQuery(searchParams.get("query") || "");
        setAlphabet(searchParams.get("alphabet") || null);
    }, [searchParams]);

    return (
        <div className="container">
            <title>Series Tracker - Поиск</title>
            <Spin
                size="large"
                spinning={loading}
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                }}
            />
            <Row align={"middle"} justify={"center"}>
                <Col span={12}>
                    <div
                        style={{ zIndex: 1 }}
                        className={loading === true ? "loading" : ""}
                    >
                        <Input
                            value={String(query)}
                            onChange={(e: { target: { value: any } }) => {
                                handle(e.target.value);
                            }}
                            placeholder="Введите для поиска"
                            suffix={<SearchOutlined />}
                            spellCheck={false}
                        />
                    </div>
                </Col>
            </Row>

            {Number(seriesCount) <= 0 && loading === false && (
                <Row
                    gutter={[10, 0]}
                    style={{
                        margin: 20,
                        padding: 15,
                        borderRadius: 5,
                        border: "1px solid #DE1EB2",
                    }}
                    align={"middle"}
                    justify={"start"}
                >
                    <Col>
                        <InfoCircleOutlined style={{ fontSize: 32 }} />
                    </Col>
                    <Col>
                        <span style={{ fontSize: 18 }}>
                            {!query &&
                                !alphabet &&
                                "Пожалуйста, укажите параметры для поиска!"}

                            {(query || alphabet) &&
                                "По вашему запросу ничего не найдено."}
                        </span>
                    </Col>
                </Row>
            )}

            {Number(seriesCount) > 0 && loading === false && (
                <div>
                    <Row
                        style={{ margin: 20 }}
                        align={"middle"}
                        justify={"center"}
                    >
                        <Col>
                            <Pagination
                                current={page}
                                total={Number(seriesCount)}
                            />
                        </Col>
                    </Row>

                    <Series series={series} />
                    <Row
                        style={{ margin: 20 }}
                        align={"middle"}
                        justify={"center"}
                    >
                        <Col>
                            <Pagination
                                current={page}
                                total={Number(seriesCount)}
                            />
                        </Col>
                    </Row>
                </div>
            )}
        </div>
    );
}
