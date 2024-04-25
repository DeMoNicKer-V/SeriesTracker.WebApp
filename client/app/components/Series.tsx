import Card from "antd/es/card/Card";
import { CardTitle } from "./Cardtitle";
import Button from "antd/es/button";
import { useEffect, useState } from "react";
import ShortDescription from "./shortDescription";
import { Col, Row } from "antd";

interface Props {
    series: Series["item1"][];
    handleDelete: (id: string) => void;
    handleOpen: (series: Series["item1"]) => void;
}

export const Series = ({ series, handleDelete, handleOpen }: Props) => {
    const [isHovering, setIsHovering] = useState(false);
    const [is, setIs] = useState(false);
    const [s, setS] = useState<Series["item1"] | any>();
    const handleMouseOver = (ss: Series["item1"]) => {
        setIs(true);
        setS(ss);
    };

    const handleMouseOut = () => {
        setIs(false);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (is == true) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [is]);

    const HoverText = () => {
        return (
            <div
                style={{ position: "absolute" }}
                onMouseOver={() => setIs(true)}
                onMouseOut={handleMouseOut}
            >
                <ShortDescription series={s} isOpen={false} />
            </div>
        );
    };

    return (
        <Row gutter={[15, 25]} justify="center">
            {series.map((series: Series["item1"]) => (
                <Col>
                    <Card
                        style={{ width: 200, height: 300 }}
                        onMouseOver={() => handleMouseOver(series)}
                        onMouseOut={handleMouseOut}
                        key={series.id}
                        cover={
                            <a href={`/${series.title}`}>
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
                                ></div>
                            </a>
                        }
                    ></Card>

                    <div style={{ maxWidth: 200 }} className="cardTitle">
                        {series.title}
                    </div>
                </Col>
            ))}
            <div>{isHovering && <HoverText />}</div>
        </Row>
    );
};
