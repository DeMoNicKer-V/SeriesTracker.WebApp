import { Card, Col, Divider, Flex, Row, Tooltip } from "antd";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import { SeriesGroupProfile } from "../models/series/SeriesGroup";

interface Props {
    items: SeriesGroupProfile[];
    username: string;
}

const SeriesGroupInfo = ({ items, username }: Props) => {
    return (
        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
            <Title level={4}>
                <Link href={`${username}/list?mylist=0`}>Список аниме</Link>
            </Title>
            <Divider />
            <Row>
                {items.map((item) => (
                    <Col key={`${item.id}-card`} flex={item.seriesCount}>
                        <Tooltip color={item.color} title={item.name}>
                            <Card
                                bordered={false}
                                hoverable
                                style={{
                                    backgroundColor: item.color,
                                    borderRadius: 0,
                                    textAlign: "center",
                                    padding: 0,
                                    margin: 0,
                                }}
                            >
                                {item.seriesCount}
                            </Card>
                        </Tooltip>
                    </Col>
                ))}
            </Row>
            <Row gutter={[25, 25]} justify={"center"}>
                {items.map((item) => (
                    <Col key={`${item.id}-tag`}>
                        <Flex style={{ flexDirection: "column" }}>
                            <Link
                                style={{ marginBottom: 3 }}
                                className="title-link"
                                href={`${username}/list?mylist=${item.id}`}
                            >
                                {`${item.name} (${item.seriesCount})`}
                            </Link>
                            <div
                                style={{ background: item.color, height: 1.5 }}
                            />
                        </Flex>
                    </Col>
                ))}
            </Row>
        </Col>
    );
};

export default SeriesGroupInfo;
