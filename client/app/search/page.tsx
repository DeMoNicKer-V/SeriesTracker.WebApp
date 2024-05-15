"use client";
import { Col, Input, Pagination, Row } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Series } from "../components/Series";
import { useEffect, useState } from "react";
import {
    getAllSeries,
    getAllSeriesSearch,
    getAlphabetSeries,
} from "../services/series";
export default function SearchPage() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState<string | null>(null);
    const [alphabet, setAlphabet] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [seriesCount, setseriesCount] = useState<Series["item2"]>();
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
                    <Input spellCheck={false} />
                </Col>
            </Row>
            <Row align={"middle"} justify={"center"}>
                <Col>
                    <Pagination />
                </Col>
            </Row>
            <Series series={series} />
        </div>
    );
}
