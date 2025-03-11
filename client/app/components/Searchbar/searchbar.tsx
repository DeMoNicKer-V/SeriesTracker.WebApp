import styles from "./component.module.css";
import {
    Card,
    Col,
    ConfigProvider,
    Divider,
    List,
    Image,
    Row,
    Space,
    Tag,
    Popover,
    Flex,
    Badge,
} from "antd";
import Input, { InputRef } from "antd/es/input";
import { useEffect, useRef, useState } from "react";
import {
    SearchOutlined,
    InfoCircleOutlined,
    FireOutlined,
    YoutubeOutlined,
    CalendarOutlined,
    HeartFilled,
} from "@ant-design/icons";
import { getAnimesByName } from "../../services/shikimori";
import noFoundImage from "../../img/img-error.jpg";
import { EmptyView } from "../EmptyView";
import Link from "next/link";
import { SeriesAnime } from "@/app/Models/Anime/SeriesAnime";
import MainShortInfo from "../MainShortInfo/MainShortInfo";

const SearchBar = ({}) => {
    const inputRef = useRef<InputRef>(null);
    const [query, setQuery] = useState("");
    const [isShown, setIsShown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [nullString, setNullString] = useState("Введите для поиска");
    const [animes, setAnimes] = useState<SeriesAnime[]>([]);

    const searchAnimes = async (query: string) => {
        const series: SeriesAnime[] | any = await getAnimesByName(query);
        setAnimes(series);
        setLoading(false);

        if (!series.length) {
            setNullString("Ничего не найдено");
            return;
        }
    };
    const handleClick = () => {
        setIsShown((current) => !current);
    };
    useEffect(() => {
        if (!query) {
            setAnimes([]);
            setNullString("Введите для поиска");
            setLoading(false);
            return;
        }
        setLoading(true);
        // Выполняем поиск, когда значение меняется (с задержкой)
        const timeoutId = setTimeout(() => {
            searchAnimes(query);
        }, 1000); // Задержка в 1000 миллисекунд (для debounce)
        return () => clearTimeout(timeoutId); // Убираем timeout
    }, [query]);

    const handleChange = (e: any) => {
        setQuery(e.target.value);
    };

    const customizeRenderEmpty = () => (
        <EmptyView text={nullString} iconSize={20} fontSize={16} />
    );

    return (
        <ConfigProvider
            theme={{
                components: {
                    Input: {
                        fontSize: 16,
                        colorFillTertiary: "#1e1e1e",
                        activeBorderColor: "#1e1e1e",
                    },
                    Divider: {
                        marginLG: 0,
                    },
                    Card: {
                        bodyPadding: 14,
                        colorBgContainer: "transparent",
                        margin: 88,
                    },
                },
            }}
            renderEmpty={customizeRenderEmpty}
        >
            <Popover
                destroyTooltipOnHide
                rootClassName="popover"
                trigger={"hover"}
                styles={{
                    root: {
                        width: "calc(40% + 10px)",
                        maxWidth: "calc(40% + 10px)",
                    },
                }}
                arrow={false}
                open={isShown && !loading}
                onOpenChange={() => {
                    setIsShown(false);
                    inputRef.current?.blur();
                }}
                content={
                    <List
                        dataSource={animes}
                        renderItem={(item: SeriesAnime) => (
                            <Link target="_top" href={`/shikimori/${item.id}`}>
                                <Badge.Ribbon
                                    text={item.categoryName}
                                    color={item.categoryColor}
                                    style={{
                                        display:
                                            item.categoryId > 0
                                                ? "block"
                                                : "none",
                                    }}
                                >
                                    <Card className={styles["card"]} hoverable>
                                        <Row
                                            style={{ flexFlow: "row" }}
                                            align={"middle"}
                                        >
                                            <Col>
                                                <Image
                                                    preview={false}
                                                    height={100}
                                                    width={70}
                                                    src={item.pictureUrl}
                                                    fallback={noFoundImage.src}
                                                />
                                            </Col>
                                            <Col offset={1}>
                                                <MainShortInfo
                                                    title={item.title}
                                                    subTitle={item.subTitle}
                                                >
                                                    <Space wrap size={[5, 5]}>
                                                        {item.isFavorite && (
                                                            <Tag
                                                                color="cyan"
                                                                className="tag"
                                                                icon={
                                                                    <HeartFilled />
                                                                }
                                                            ></Tag>
                                                        )}
                                                        {item.status.length >
                                                        6 ? (
                                                            <Tag
                                                                className="tag"
                                                                color="orange"
                                                                icon={
                                                                    <FireOutlined />
                                                                }
                                                            >
                                                                {item.status}
                                                            </Tag>
                                                        ) : (
                                                            <Tag
                                                                className="tag"
                                                                icon={
                                                                    <FireOutlined />
                                                                }
                                                            >
                                                                {item.status}
                                                            </Tag>
                                                        )}
                                                        <Tag
                                                            className="tag"
                                                            icon={
                                                                <InfoCircleOutlined />
                                                            }
                                                        >
                                                            {item.kind}
                                                        </Tag>
                                                        <Tag
                                                            className="tag"
                                                            icon={
                                                                <CalendarOutlined />
                                                            }
                                                        >
                                                            {new Date(
                                                                item.startDate
                                                            ).toLocaleString(
                                                                "ru-Ru",
                                                                {
                                                                    year: "numeric",
                                                                }
                                                            )}
                                                        </Tag>

                                                        <Tag
                                                            className="tag"
                                                            icon={
                                                                <YoutubeOutlined />
                                                            }
                                                        >
                                                            {`${item.episodes} эп.`}
                                                        </Tag>
                                                    </Space>
                                                </MainShortInfo>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Badge.Ribbon>
                                <Divider />
                            </Link>
                        )}
                    />
                }
            >
                <Flex>
                    <Input
                        autoComplete="off"
                        ref={inputRef}
                        onClick={handleClick}
                        id="searchbar"
                        className={loading === true ? styles["loading"] : ""}
                        spellCheck={"false"}
                        variant="filled"
                        value={query}
                        onChange={handleChange}
                        placeholder="Найти аниме"
                        suffix={<SearchOutlined />}
                    />
                </Flex>
            </Popover>
        </ConfigProvider>
    );
};

export default SearchBar;
