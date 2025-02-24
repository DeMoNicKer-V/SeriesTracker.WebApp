import {
    Card,
    Col,
    List,
    Row,
    Image,
    Space,
    Tag,
    Divider,
    ConfigProvider,
    Flex,
    Typography,
} from "antd";
import Link from "next/link";
import noFoundImage from "../../img/img-error.jpg";
import styles from "./component.module.css";

const { Text, Title } = Typography;
import {
    InfoCircleOutlined,
    CalendarOutlined,
    ReadOutlined,
} from "@ant-design/icons";
import { Related } from "@/app/Models/Anime/Anime";

interface Props {
    animes: Related[];
}

const RelatedAnimes = ({ animes }: Props) => {
    return (
        <ConfigProvider
            theme={{
                components: {
                    Card: { bodyPadding: 14 },
                    Divider: {
                        marginLG: 10,
                    },
                },
            }}
        >
            <List
                dataSource={animes}
                renderItem={(item: Related) => (
                    <Link target="_top" href={`/shikimori/${item.anime.id}`}>
                        <Card className={styles["related-item-card"]} hoverable>
                            <Row
                                className={styles["related-item-row"]}
                                gutter={[0, 10]}
                                align={"middle"}
                            >
                                <Col
                                    sm={24}
                                    xs={24}
                                    md={4}
                                    lg={3}
                                    xl={3}
                                    xxl={2}
                                >
                                    <Image
                                        width={70}
                                        preview={false}
                                        src={item.anime.pictureUrl}
                                        fallback={noFoundImage.src}
                                    />
                                </Col>
                                <Col
                                    sm={24}
                                    xs={24}
                                    md={20}
                                    lg={21}
                                    xl={21}
                                    xxl={22}
                                >
                                    <Flex className="flex-column">
                                        <Title
                                            className={"trimText title"}
                                            level={5}
                                            style={{ marginBottom: 0 }}
                                        >
                                            {item.anime.title}
                                        </Title>
                                        <Text
                                            className={"trimText subTitle"}
                                            strong
                                            style={{ marginBottom: 5 }}
                                            italic
                                            type="secondary"
                                        >
                                            {item.anime.subTitle}
                                        </Text>
                                        <Space
                                            className={styles["related-info"]}
                                            wrap
                                        >
                                            <Tag
                                                className="tag"
                                                icon={<InfoCircleOutlined />}
                                            >
                                                {item.anime.kind}
                                            </Tag>

                                            <Tag
                                                className="tag"
                                                icon={<CalendarOutlined />}
                                            >
                                                {item.anime.startDate}
                                            </Tag>
                                            <Tag
                                                className="tag"
                                                icon={<ReadOutlined />}
                                            >
                                                {item.relationText}
                                            </Tag>
                                        </Space>
                                    </Flex>
                                </Col>
                            </Row>
                        </Card>
                        <Divider />
                    </Link>
                )}
            />
        </ConfigProvider>
    );
};

export default RelatedAnimes;
