import { Card, Col, Divider, Flex, Row, Tooltip } from "antd";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import { SeriesGroupProfile } from "../models/series/SeriesGroup";
import styles from "./components.module.css";
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
                                className={styles["series-group-card"]}
                                bordered={false}
                                hoverable
                                style={{
                                    backgroundColor: item.color,
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
                        <Flex className="flex-column">
                            <Link
                                className="title-link"
                                href={`${username}/list?mylist=${item.id}`}
                            >
                                {`${item.name} (${item.seriesCount})`}
                            </Link>
                            <div
                                className={styles["highlight-line"]}
                                style={{
                                    backgroundColor: item.color,
                                }}
                            />
                        </Flex>
                    </Col>
                ))}
            </Row>
        </Col>
    );
};

export default SeriesGroupInfo;
