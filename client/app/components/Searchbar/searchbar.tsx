import { getAnimesByName } from "@/app/api/animes/getAnime";
import { Anime } from "@/app/models/anime/Anime";
import {
    CalendarOutlined,
    FireOutlined,
    HeartFilled,
    InfoCircleOutlined,
    SearchOutlined,
    YoutubeOutlined,
} from "@ant-design/icons";
import {
    Badge,
    Card,
    Col,
    ConfigProvider,
    Divider,
    Flex,
    Image,
    List,
    message,
    Popover,
    Row,
    Space,
    Tag,
} from "antd";
import Input, { InputRef } from "antd/es/input";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import noFoundImage from "../../img/img-error.jpg";
import { EmptyView } from "../EmptyView";
import ShortInfo from "../ShortInfo/ShortInfo";
import styles from "./component.module.css";

const DEBOUNCE_DELAY = 1000; // Задержка для debounce
/**
 * @component SearchBar
 * @description Компонент поисковой строки для поиска аниме.
 * Отображает список найденных аниме в выпадающем списке.
 * @returns {JSX.Element}
 */
const SearchBar: React.FC = (): JSX.Element => {
    // Ref для доступа к элементу Input
    const inputRef = useRef<InputRef>(null);

    // Состояние для хранения поискового запроса
    const [query, setQuery] = useState("");

    // Состояние для отображения/скрытия выпадающего списка (не используется)
    const [isShown, setIsShown] = useState(false);

    // Состояние для отображения индикатора загрузки
    const [loading, setLoading] = useState(false);

    // Состояние для отображения сообщения, когда ничего не найдено
    const [nullString, setNullString] = useState("Введите для поиска");

    // Состояние для хранения списка найденных аниме
    const [animes, setAnimes] = useState<Anime[]>([]);

    //  Выполняет поиск аниме по имени и обновляет состояние.
    const searchAnimes = async (query: string): Promise<void> => {
        try {
            const searchResult: Anime[] = await getAnimesByName(query); // Выполняем поиск
            setAnimes(searchResult);

            if (searchResult.length === 0) {
                setNullString("Ничего не найдено");
            }
        } catch (error: any) {
            console.error("Ошибка при поиске аниме:", error);
            message.error(
                error.message || "Не удалось выполнить поиск. Попробуйте позже."
            );
            setNullString("Ошибка при поиске");
        } finally {
            setLoading(false); // Снимаем индикатор загрузки
        }
    };

    // Переключает состояние отображения выпадающего списка.
    const handleClick = () => {
        setIsShown((current) => !current);
    };

    useEffect(() => {
        // Выполняем поиск с задержкой (debounce)
        if (!query) {
            setAnimes([]);
            setNullString("Введите для поиска");
            setLoading(false);
            return;
        }

        setLoading(true);

        const timeoutId = setTimeout(() => {
            searchAnimes(query);
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(timeoutId); // Очищаем таймер при размонтировании компонента или изменении query
    }, [query]);

    // Обработчик изменения значения поля ввода.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value); // Обновляем поисковый запрос
    };

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
            renderEmpty={() => (
                <EmptyView text={nullString} iconSize={20} fontSize={16} />
            )}
        >
            <Popover
                destroyTooltipOnHide
                rootClassName={styles["searchbar-popover"]}
                trigger={"hover"}
                arrow={false}
                open={isShown && !loading}
                onOpenChange={() => {
                    setIsShown(false);
                    inputRef.current?.blur();
                }}
                content={
                    <List
                        dataSource={animes}
                        renderItem={(item: Anime) => (
                            <Link target="_top" href={`/animes/${item.id}`}>
                                <Badge.Ribbon
                                    text={item.categoryName}
                                    color={item.categoryColor}
                                    className={
                                        item.categoryId === 0
                                            ? styles["searchbar-ribbon-none"]
                                            : styles["searchbar-ribbon"]
                                    }
                                >
                                    <Card className={styles["card"]} hoverable>
                                        <Row
                                            style={{ flexFlow: "row" }}
                                            align={"middle"}
                                        >
                                            <Col>
                                                <Image
                                                    alt={`serch-anime-${item.id}`}
                                                    preview={false}
                                                    height={100}
                                                    width={70}
                                                    src={item.pictureUrl}
                                                    fallback={noFoundImage.src}
                                                />
                                            </Col>
                                            <Col offset={1}>
                                                <ShortInfo
                                                    title={item.title}
                                                    subTitle={item.subTitle}
                                                >
                                                    <Space wrap size={[5, 5]}>
                                                        {item.isFavorite && (
                                                            <Tag className="tag">
                                                                <HeartFilled
                                                                    className={
                                                                        styles[
                                                                            "searchbar-favorite-icon"
                                                                        ]
                                                                    }
                                                                />
                                                            </Tag>
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
                                                </ShortInfo>
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
