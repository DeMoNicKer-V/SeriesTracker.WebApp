import {
    Button,
    Card,
    Col,
    ConfigProvider,
    Divider,
    Form,
    List,
    Image,
    Row,
    Space,
    Tag,
    Typography,
    Popover,
} from "antd";
import Input, { InputRef } from "antd/es/input";
import { useEffect, useRef, useState } from "react";
import {
    SearchOutlined,
    InfoCircleOutlined,
    FireOutlined,
    YoutubeOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import { getAnimesByName } from "../services/shikimori";
import Meta from "antd/es/card/Meta";
import noFoundImage from "../img/img-error.jpg";
import { EmptyView } from "./EmptyView";
import Link from "next/link";

const SearchBar = ({}) => {
    const inputRef = useRef<InputRef>(null);
    const [query, setQuery] = useState("");
    const [isShown, setIsShown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [nullString, setNullString] = useState("Введите для поиска");
    const [animes, setAnimes] = useState<SeriesAnime[] | any>([]);

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
        <EmptyView
            text={nullString}
            iconSize={20}
            fontSize={16}
            align={"center"}
        />
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
                },
            }}
            renderEmpty={customizeRenderEmpty}
        >
            <Popover
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
                                <Card
                                    style={{
                                        padding: 12,
                                        marginBottom: 8,
                                        backgroundColor: "transparent",
                                    }}
                                    hoverable
                                >
                                    <Row
                                        style={{ flexFlow: "row" }}
                                        align={"middle"}
                                        justify={"start"}
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
                                            <Meta
                                                style={{
                                                    padding: 0,
                                                    marginBottom: 8,
                                                    whiteSpace: "break-spaces",
                                                }}
                                                title={item.title}
                                                description={item.subTitle}
                                            />
                                            <Space wrap size={[5, 5]}>
                                                {item.status.length > 6 ? (
                                                    <Tag
                                                        color="orange"
                                                        icon={<FireOutlined />}
                                                    >
                                                        {item.status}
                                                    </Tag>
                                                ) : (
                                                    <Tag
                                                        icon={<FireOutlined />}
                                                    >
                                                        {item.status}
                                                    </Tag>
                                                )}
                                                <Tag
                                                    icon={
                                                        <InfoCircleOutlined />
                                                    }
                                                >
                                                    {item.kind}
                                                </Tag>
                                                <Tag
                                                    icon={<CalendarOutlined />}
                                                >
                                                    {new Date(
                                                        item.startDate
                                                    ).toLocaleString("ru-Ru", {
                                                        year: "numeric",
                                                    })}
                                                </Tag>

                                                <Tag icon={<YoutubeOutlined />}>
                                                    {item.status === "Вышло"
                                                        ? `${item.episodes} эп.`
                                                        : `${item.episodesAired} из ${item.episodes} эп.`}
                                                </Tag>
                                            </Space>
                                        </Col>
                                    </Row>
                                </Card>
                                <Divider />
                            </Link>
                        )}
                    />
                }
            >
                <Form.Item noStyle>
                    <Input
                        autoComplete="off"
                        ref={inputRef}
                        onClick={handleClick}
                        id="searchbar"
                        size="small"
                        className={loading === true ? "loading" : ""}
                        spellCheck={"false"}
                        variant="filled"
                        value={query}
                        onChange={handleChange}
                        placeholder="Найти аниме"
                        suffix={
                            <Button type="link" htmlType="submit">
                                <SearchOutlined />
                            </Button>
                        }
                    />
                </Form.Item>
            </Popover>
        </ConfigProvider>
    );
};

export default SearchBar;
