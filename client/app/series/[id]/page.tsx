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
    InputRef,
    Row,
    Tag,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { BookOutlined, EditOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { CreateUpdateSeries, Mode } from "@/app/components/AddUpdateSeries";
import Meta from "antd/es/card/Meta";

export default function Doggo({ params }: { params: { id: string } }) {
    const [series, setSeries] = useState<Series["item1"][] | any>([]);
    const getSeries = async (id: string) => {
        const series = await getSeriesById(id);
        setSeries(series);
    };
    useEffect(() => {
        getSeries(params.id);
    }, []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isChecked2, setIsChecked2] = useState(false);
    const inputRefEpisode = useRef<InputRef>(null);
    const inputRefRating = useRef<InputRef>(null);
    const cardStyle: React.CSSProperties = {
        padding: "16px",
        height: "100%",
        alignItems: "flex-end",
    };

    const mode = Mode.Edit;

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

    const updateFavoriteSeries = async (id: string) => {
        series.isFavorite = !series.isFavorite;
        await updateSeries(id, series);
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
        <div className="container">
            <CreateUpdateSeries
                mode={mode}
                values={series}
                isModalOpen={isModalOpen}
                handleUpdate={handleUpdateSeries}
                handleCancel={closeModal}
                handleCreate={function (request: SeriesReqruest): void {
                    throw new Error("Function not implemented.");
                }}
            />
            <Flex
                style={{
                    flex: "1 0 auto",
                    maxWidth: "100%",
                    overflow: "hidden",
                    position: "relative",
                    zIndex: 0,
                }}
            >
                <div
                    style={{
                        flex: "1 0",
                        transition:
                            "padding-bottom 0.2s cubic-bezier(0.25, 0.8, 0.5, 1)",
                        paddingBottom: "56.857%",
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
                                        paddingBottom: "142.857%",
                                    }}
                                ></div>
                                <div
                                    style={{
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
                                        <Flex gap="4px 0">
                                            <Tag.CheckableTag
                                                onClick={() => {
                                                    updateFavoriteSeries(
                                                        series.id
                                                    );
                                                }}
                                                checked={series.isFavorite}
                                            >
                                                Избранное
                                                <BookOutlined />
                                            </Tag.CheckableTag>

                                            {!isChecked && (
                                                <Tag
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
                                                            inputRefEpisode.current!.focus(
                                                                {
                                                                    cursor: "start",
                                                                }
                                                            );
                                                        }}
                                                    />
                                                </Tag>
                                            )}
                                            {isChecked && (
                                                <InputNumber
                                                    //ref={inputRefEpisode}
                                                    onPressEnter={() => {
                                                        setIsChecked(false);
                                                    }}
                                                    style={{
                                                        width: 230,
                                                    }}
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
                                                <InputNumber
                                                    onPressEnter={() => {
                                                        setIsChecked2(false);
                                                    }}
                                                    style={{ width: 170 }}
                                                    controls={false}
                                                    addonBefore={"Рейтинг"}
                                                    addonAfter={`из 10`}
                                                    size="small"
                                                    min={0}
                                                    max={10}
                                                    defaultValue={series.rating}
                                                />
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
                                                {`Добавлено: ${series.addedDate}`}{" "}
                                                {`Изменено: ${series.changedDate}`}
                                            </div>

                                            <div>Статус: смотрю</div>

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

            <Card>
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
