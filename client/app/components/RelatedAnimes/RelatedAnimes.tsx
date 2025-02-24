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
import MainShortInfo from "../MainShortInfo/MainShortInfo";

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
                                    <MainShortInfo
                                        title={item.anime.title}
                                        subTitle={item.anime.subTitle}
                                        strongSubTitle
                                    >
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
                                    </MainShortInfo>
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
