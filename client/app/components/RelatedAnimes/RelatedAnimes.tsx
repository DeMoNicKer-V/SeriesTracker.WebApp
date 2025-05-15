import { Related } from "@/app/models/anime/RelatedAnime";
import {
    CalendarOutlined,
    InfoCircleOutlined,
    ReadOutlined,
} from "@ant-design/icons";
import {
    Card,
    Col,
    ConfigProvider,
    Divider,
    Image,
    List,
    Row,
    Space,
    Tag,
} from "antd";
import Link from "next/link";
import noFoundImage from "../../img/img-error.jpg";
import ShortInfo from "../ShortInfo/ShortInfo";
import styles from "./component.module.css";

// Определение интерфейса Props для компонента RelatedAnimes
interface Props {
    animes: Related[]; // Список связаных аниме
}

/**
 * @component RelatedAnimes
 * @description Компонент для отображения связанных (с основным) аниме.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
export const RelatedAnimes: React.FC<Props> = ({
    animes,
}: Props): JSX.Element => {
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
                    <Link target="_top" href={`/animes/${item.anime.id}`}>
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
                                        alt={`related-${item.anime.id}`}
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
                                    <ShortInfo
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
                                    </ShortInfo>
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
