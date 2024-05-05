"use client";
import {
    SeriesReqruest,
    deleteSeries,
    getSeriesById,
    updateSeries,
} from "@/app/services/series";
import { Button, Card, Col, ConfigProvider, Flex, Row, Tag } from "antd";
import { useEffect, useState } from "react";
import { BookOutlined } from "@ant-design/icons";
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
    const [values, setValues] = useState<Series["item1"]>(series);
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
                                            <Tag color="success">success</Tag>
                                            <Tag color="processing">
                                                processing
                                            </Tag>
                                            <Tag color="error">error</Tag>
                                            <Tag color="warning">warning</Tag>
                                            <Tag color="default">default</Tag>
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
                    title="Synopsis"
                    description=" In the entertainment world, celebrities often show
      exaggerated versions of themselves to the public,
      concealing their true thoughts and struggles beneath
      elaborate lies. Fans buy into these fabrications,
      showering their idols with undying love and support,
      until something breaks the illusion. Sixteen-year-old
      rising star Ai Hoshino of pop idol group B Komachi has
      the world captivated; however, when she announces a
      hiatus due to health concerns, the news causes many to
      become worried. As a huge fan of Ai, gynecologist Gorou
      Amemiya cheers her on from his countryside medical
      practice, wishing he could meet her in person one day.
      His wish comes true when Ai shows up at his hospital—not
      sick, but pregnant with twins! While the doctor promises
      Ai to safely deliver her children, he wonders if this
      encounter with the idol will forever change the nature
      of his relationship with her."
                />
            </Card>
        </div>
    );
}
