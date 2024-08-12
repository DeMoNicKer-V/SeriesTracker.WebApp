"use client";
import {
    SeriesReqruest,
    deleteSeries,
    getSeriesById,
    updateSeries,
} from "@/app/services/series";
import {
    Button,
    Card,
    Col,
    ConfigProvider,
    Flex,
    InputNumber,
    Rate,
    Row,
    Tag,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { BookOutlined, EditOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Meta from "antd/es/card/Meta";

export default function Doggo({ params }: { params: { id: string } }) {
    const ref = useRef<HTMLDivElement>(null);
    const [series, setSeries] = useState<Series[] | any>([]);
    const getSeries = async (id: string) => {
        const series = await getSeriesById(id);
        setSeries(series);
    };
    useEffect(() => {
        getSeries(params.id);
    }, []);

    useEffect(() => {
        const handleOutSideClick = (event: any) => {
            if (!ref.current?.contains(event.target)) {
                setIsChecked(false);
                setIsChecked2(false);
            }
        };
        window.addEventListener("mousedown", handleOutSideClick);
    }, [ref]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isChecked2, setIsChecked2] = useState(false);
    const cardStyle: React.CSSProperties = {
        padding: "16px",
        height: "100%",
        alignItems: "flex-end",
    };

    const titleStyle: React.CSSProperties = {
        padding: "0px",
    };

    const spanStyle: React.CSSProperties = {
        width: "25%",
        textAlign: "center",
    };

    const gridStyle: React.CSSProperties = {
        width: "100%",
        padding: "0px",
    };
    const router = useRouter();
    const deleteThisSeries = async (id: string) => {
        await deleteSeries(id);
        router.push(`./`);
    };

    const updateFavoriteSeries = async () => {
        series.isFavorite = !series.isFavorite;
        await updateSeries(series.id, series);
        await getSeries(series.id);
    };
    const [watchedEpisode, setWatchedEpisode] = useState(0);

    const updateRatingSeries = async (value: number) => {
        setIsChecked2(false);
        series.rating = value;
        await updateSeries(series.id, series);
        await getSeries(series.id);
    };
    const updateEpisodeSeries = async () => {
        setIsChecked(false);
        series.watchedEpisode = watchedEpisode;
        await updateSeries(series.id, series);
        await getSeries(series.id);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const handleUpdateSeries = async (id: string, request: SeriesReqruest) => {
        await updateSeries(id, request);
        closeModal();
        getSeries(params.id);
    };
    const openModal = () => {
        setIsModalOpen(true);
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
                        backgroundImage: `url(${series.imagePath})`,
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
                                        backgroundImage: `url(${series.imagePath})`,
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
                                <Card title={series.title}>
                                    <Card.Grid
                                        hoverable={false}
                                        style={{
                                            width: "100%",
                                            paddingBottom: 0,
                                            paddingTop: 0,
                                        }}
                                    >
                                        <Flex ref={ref} gap="4px 0">
                                            <Tag.CheckableTag
                                                className="tag"
                                                onClick={() => {
                                                    updateFavoriteSeries();
                                                }}
                                                checked={series.isFavorite}
                                            >
                                                Избранное
                                                <BookOutlined />
                                            </Tag.CheckableTag>

                                            {!isChecked && (
                                                <Tag
                                                    className="tag"
                                                    style={{
                                                        cursor: "default",
                                                    }}
                                                    onClick={() => {}}
                                                    color="error"
                                                >
                                                    {`Просмотрено ${series.watchedEpisode} из ${series.lastEpisode} эп.`}{" "}
                                                    <EditOutlined
                                                        onClick={() => {
                                                            setIsChecked2(
                                                                false
                                                            );
                                                            setIsChecked(true);
                                                        }}
                                                    />
                                                </Tag>
                                            )}
                                            {isChecked && (
                                                <InputNumber
                                                    changeOnWheel
                                                    onPressEnter={() => {
                                                        setIsChecked(false);
                                                        updateEpisodeSeries();
                                                    }}
                                                    style={{
                                                        width: 230,
                                                    }}
                                                    onChange={(value) =>
                                                        setWatchedEpisode(value)
                                                    }
                                                    autoFocus
                                                    maxLength={4}
                                                    controls={false}
                                                    addonBefore={"Просмотрено"}
                                                    addonAfter={`из ${series.lastEpisode} эп.`}
                                                    size="small"
                                                    min={0}
                                                    max={series.lastEpisode}
                                                    defaultValue={
                                                        series.watchedEpisode
                                                    }
                                                />
                                            )}
                                            {!isChecked2 && (
                                                <Tag
                                                    className="tag"
                                                    style={{
                                                        cursor: "default",
                                                    }}
                                                    onClick={() => {}}
                                                    color="error"
                                                >
                                                    {`Рейтинг ${series.rating} из 10`}{" "}
                                                    <EditOutlined
                                                        onClick={() => {
                                                            setIsChecked(false);
                                                            setIsChecked2(true);
                                                        }}
                                                    />
                                                </Tag>
                                            )}
                                            {isChecked2 && (
                                                <Flex
                                                    justify="center"
                                                    align="center"
                                                >
                                                    Ваш рейтинг:{" "}
                                                    <Rate
                                                        style={{
                                                            fontSize: 14,
                                                        }}
                                                        onChange={(
                                                            value: number
                                                        ) => {
                                                            updateRatingSeries(
                                                                value
                                                            );
                                                        }}
                                                        count={10}
                                                        allowHalf
                                                        defaultValue={
                                                            series.rating
                                                        }
                                                    />
                                                </Flex>
                                            )}
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
                                            <div>
                                                {`Дата выхода: ${series.releaseDate}`}
                                            </div>
                                            <div>
                                                {`Добавлено: ${series.addedDate}`}
                                                {`Изменено: ${series.changedDate}`}
                                            </div>

                                            <div>
                                                {`Всего эпизодов: ${series.lastEpisode} эп.`}
                                            </div>
                                        </div>
                                    </Card.Grid>
                                    <Card.Grid
                                        hoverable={false}
                                        style={{
                                            width: "100%",
                                            paddingBottom: 10,
                                        }}
                                    >
                                        <Row>
                                            <Col
                                                style={{ marginRight: 5 }}
                                                span={17}
                                            >
                                                <Button
                                                    onClick={openModal}
                                                    block
                                                >
                                                    Изменить
                                                </Button>
                                            </Col>
                                            <Col
                                                style={{ marginRight: 5 }}
                                                span={6}
                                            >
                                                <Button
                                                    block
                                                    onClick={() => {
                                                        deleteThisSeries(
                                                            series.id
                                                        );
                                                    }}
                                                >
                                                    Удалить
                                                </Button>
                                            </Col>
                                        </Row>
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
                        series.description === ""
                            ? "Описание отсутствует"
                            : series.description
                    }
                />
            </Card>
        </div>
    );
}
