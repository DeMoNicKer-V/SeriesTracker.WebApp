import Card from "antd/es/card/Card";
import ShortDescription from "./shortDescription";
import { Col, Popover, Row } from "antd";

interface Props {
    series: Series["item1"][];
    handleDelete: (id: string) => void;
    handleOpen: (series: Series["item1"]) => void;
}

const openModal = () => {
    const timer = setTimeout(() => {}, 500);
    return () => clearTimeout(timer);
};
export const Series = ({ series, handleDelete, handleOpen }: Props) => {
    return (
        <Row gutter={[15, 25]} justify="center">
            {series.map((series: Series["item1"]) => (
                <Col>
                    <a href={`/${series.title}`}>
                        <Popover
                            trigger={"hover"}
                            mouseEnterDelay={0.5}
                            mouseLeaveDelay={0.2}
                            placement="bottomLeft"
                            arrow={false}
                            content={
                                <div style={{ width: 480 }}>
                                    <ShortDescription
                                        series={series}
                                        isOpen={false}
                                    />
                                </div>
                            }
                        >
                            <Card
                                style={{ width: 200, height: 300 }}
                                key={series.id}
                                cover={
                                    <div
                                        style={{
                                            overflow: "hidden",
                                            backgroundImage: `url(${series.imagePath})`,
                                            backgroundSize: "cover",
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "center",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            position: "absolute",
                                        }}
                                    >
                                        <div
                                            style={{
                                                top: 0,

                                                right: 0,
                                                margin: 5,
                                                position: "absolute",
                                            }}
                                        >{`Просмотрено ${series.watchedEpisode} из ${series.lastEpisode}`}</div>
                                    </div>
                                }
                            ></Card>
                        </Popover>
                    </a>
                    <h2
                        className="cardTitle"
                        style={{
                            fontSize: 14,
                            maxWidth: 200,
                            marginTop: "10px",
                        }}
                    >
                        <a href={`/${series.title}`}>
                            <span>{series.title}</span>
                        </a>
                    </h2>
                </Col>
            ))}
        </Row>
    );
};
