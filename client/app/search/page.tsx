"use client";
import { Col, Empty, Flex, Input, Pagination, Row } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Series } from "../components/Series";
import { useEffect, useState } from "react";
import {
    getAllSeries,
    getAllSeriesSearch,
    getAlphabetSeries,
} from "../services/series";
import {
    InfoCircleOutlined,
    FrownOutlined,
    SearchOutlined,
} from "@ant-design/icons";
export default function SearchPage() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState<string | null>(null);
    const [alphabet, setAlphabet] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [seriesCount, setseriesCount] = useState<Series["item2"] | number>(0);
    const [series, setSeries] = useState<Series["item1"][] | any>([]);

    const getSeries = async () => {
        if (
            searchParams.get("alphabet") === "" ||
            searchParams.get("alphabet") === null
        ) {
            const series = await getAllSeriesSearch(searchParams.get("query"));
            setSeries(series);
            return;
        }
        const series = await getAlphabetSeries(
            page,
            searchParams.get("alphabet")
        );
        setseriesCount(series["item2"]);
        setSeries(series["item1"]);
    };
    useEffect(() => {
        getSeries();
    }, [pathname, searchParams]);

    return (
        <div className="container">
            <title>Series Tracker - Поиск</title>
            <Row align={"middle"} justify={"center"}>
                <Col span={12}>
                    <Input
                        placeholder="Введите для поиска"
                        prefix={<SearchOutlined />}
                        count={{ show: true }}
                        spellCheck={false}
                    />
                </Col>
            </Row>
            <Row style={{ margin: 20 }} align={"middle"} justify={"center"}>
                <Col>
                    <Pagination current={page} total={Number(seriesCount)} />
                </Col>
            </Row>
            {Number(seriesCount) <= 0 && (
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
                            К сожалению, по вашему запросу ничего не найдено.
                        </span>
                    </Col>
                </Row>
            )}
            <Series series={series} />
            <Row style={{ margin: 20 }} align={"middle"} justify={"center"}>
                <Col>
                    <Pagination current={page} total={Number(seriesCount)} />
                </Col>
            </Row>
        </div>
    );
}
