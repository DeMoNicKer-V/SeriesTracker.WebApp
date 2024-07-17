"use client";
import {
    Col,
    Divider,
    Empty,
    Flex,
    Input,
    Pagination,
    Row,
    Spin,
    Typography,
} from "antd";
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
    const [inputFocus, setInputFocus] = useState(false);
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
        if (query === "") {
            setseriesCount(0);
            setSeries([]);
            setLoading(false);
            return;
        }
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
                <Col span={16}>
                    <div className="searchpage-input">
                        <Typography.Title
                            level={5}
                            className={
                                inputFocus ? "input-label focus" : "input-label"
                            }
                            style={{
                                position: "absolute",
                                zIndex: 1,
                                left: 20,
                                top: -15,
                                padding: 3,
                                fontSize: 18,
                                transform: "scale(.75)",
                            }}
                        >
                            Поиск
                        </Typography.Title>
                        <Input
                            value={String(query)}
                            onChange={(e: { target: { value: any } }) => {
                                handle(e.target.value);
                            }}
                            placeholder="Введите для поиска"
                            style={{
                                fontSize: 18,
                                padding: 10,
                                background: "none",
                            }}
                            spellCheck={"false"}
                            onFocus={() => setInputFocus(true)}
                            onBlur={() => setInputFocus(false)}
                        />
                    </div>
                </Col>
            </Row>
            <Divider dashed style={{ margin: 15 }}></Divider>
            {Number(seriesCount) <= 0 && loading === false && (
                <Row
                    style={{ marginTop: 40, marginBottom: 40 }}
                    gutter={[20, 20]}
                >
                    <Col span={16} offset={4}>
                        <Flex
                            className="emptyview"
                            justify="center"
                            align="middle"
                            gap={10}
                        >
                            <InfoCircleOutlined style={{ fontSize: 32 }} />
                            <span style={{ fontSize: 22 }}>
                                {!query &&
                                    !alphabet &&
                                    "Пожалуйста, укажите параметры для поиска!"}

                                {(query || alphabet) &&
                                    "По вашему запросу ничего не найдено."}
                            </span>
                        </Flex>
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
