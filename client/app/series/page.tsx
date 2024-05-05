"use client";
import Button from "antd/es/button";
import { Series } from "../components/Series";
import { useEffect, useState } from "react";
import {
    SeriesReqruest,
    createSeries,
    deleteSeries,
    getAllSeries,
    getAllSeriesCount,
    updateSeries,
} from "../services/series";
import { CreateUpdateSeries, Mode } from "../components/AddUpdateSeries";
import { Col, Pagination, Row } from "antd";
import { usePathname, useSearchParams } from "next/navigation";
import dayjs from "dayjs";

export default function SeriesPage() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const defaultValues = {
        title: "",
        description: "",
        imagePath: "",
        watchedEpisode: 0,
        lastEpisode: 10,
        rating: 0,
        releaseDate: dayjs().toDate().toString(),
        isOver: false,
        isFavorite: false,
    } as Series["item1"];

    const [values, setValues] = useState<Series["item1"]>(defaultValues);
    const [query, setQuery] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [seriesCount, setseriesCount] = useState<Series["item2"]>();
    const [series, setSeries] = useState<Series["item1"][] | any>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState(Mode.Create);

    const getSeries = async (query: any) => {
        const series = await getAllSeries(page, query);
        setseriesCount(series["item2"]);
        setSeries(series["item1"]);
    };
    useEffect(() => {
        getSeries(searchParams.get("query"));
        setQuery(searchParams.get("query"));
    }, [pathname, searchParams]);

    const handleCreateSeries = async (request: SeriesReqruest) => {
        await createSeries(request);
        closeModal();

        const series = await getAllSeries(page, query);
        setseriesCount(series["item2"]);
        setSeries(series["item1"]);
    };

    const updateSeriesList = async (page: number) => {
        const series = await getAllSeries(page, query);
        setseriesCount(series["item2"]);
        setSeries(series["item1"]);
    };

    const handleUpdateSeries = async (id: string, request: SeriesReqruest) => {
        await updateSeries(id, request);
        closeModal();

        const series = await getAllSeries(page, query);
        setSeries(series["item1"]);
    };

    const deleteThisSeries = async (id: string) => {
        await deleteSeries(id);
        closeModal();
        if (series.length == 1) {
            await updateSeriesList(page - 1);
        } else {
            const series1 = await getAllSeries(page, query);
            setseriesCount(series.item2);
            setSeries(series1["item1"]);
        }
    };

    const openEditModel = (series: Series["item1"]) => {
        setMode(Mode.Edit);
        setValues(series);
        setIsModalOpen(true);
    };

    const openModal = () => {
        setMode(Mode.Create);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setValues(defaultValues);
        setIsModalOpen(false);
    };

    return (
        <div className="container">
            <CreateUpdateSeries
                mode={mode}
                values={values}
                isModalOpen={isModalOpen}
                handleCreate={handleCreateSeries}
                handleUpdate={handleUpdateSeries}
                handleCancel={closeModal}
            />
            <Row justify="end">
                <Col span={12}>
                    <h2>Ваши сериалы</h2>
                </Col>
                <Col span={12}>
                    <div style={{ display: "flex", justifyContent: "end" }}>
                        <Button onClick={openModal} type="text">
                            Добавить сериал
                        </Button>
                        <Pagination
                            current={page}
                            onChange={(current: any) => {
                                setPage(current);
                                updateSeriesList(current);
                            }}
                            showTitle={false}
                            pageSize={30}
                            total={seriesCount?.count}
                        />
                    </div>
                </Col>
            </Row>

            <Series
                series={series}
                handleOpen={openEditModel}
                handleDelete={deleteThisSeries}
            />
            <Row justify="center">
                <Col>
                    <Pagination
                        current={page}
                        onChange={(current: any) => {
                            setPage(current);
                            updateSeriesList(current);
                        }}
                        showTitle={false}
                        pageSize={30}
                        total={seriesCount?.count}
                    />
                </Col>
            </Row>
        </div>
    );
}
