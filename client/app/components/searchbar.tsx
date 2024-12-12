import {
    Avatar,
    Button,
    Card,
    Col,
    ConfigProvider,
    Divider,
    Empty,
    Flex,
    Form,
    List,
    Image,
    Row,
    Skeleton,
    Space,
    Spin,
    Tag,
    Tooltip,
    Typography,
    Popover,
} from "antd";
import Input, { InputRef, SearchProps } from "antd/es/input";
import notFound from "../img/notFound.webp";
import Search from "antd/es/transfer/search";
import { useEffect, useRef, useState } from "react";
import { getAllSeries, getAllSeriesSearch } from "../services/series";
import { SearchResult } from "./searchResult";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SearchOutlined,
    FrownOutlined,
    InfoCircleOutlined,
    InfoCircleFilled,
    LoadingOutlined,
    FireOutlined,
    YoutubeOutlined,
    CalendarOutlined,
    FileImageOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import "./searchbar.css";
import { redirect, useRouter } from "next/navigation";
import { useForm } from "antd/es/form/Form";
import Title from "antd/es/skeleton/Title";
import { AnimeInfo, getAnimesByName } from "../services/shikimori";
import Meta from "antd/es/card/Meta";
import noFoundImage from "../img/empty.png";

export const SearchBar = ({}) => {
    const inputRef = useRef<InputRef>(null);
    const [query, setQuery] = useState<string>("");
    const [form] = Form.useForm();

    useEffect(() => {
        if (!query) {
            setAnimes([]);
            setNullString("Введите для поиска");
            setLoading(false);
            return;
        }
        setLoading(true);
        setNullString("");
        const timer = setTimeout(() => {
            fakeApi();
            setIsShown(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, [query]);
    const handleClick = () => {
        setIsShown((current) => !current);
    };
    const [isShown, setIsShown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [nullString, setNullString] = useState("Введите для поиска");
    const [animes, setAnimes] = useState<SeriesAnime[] | any>([]);
    const fakeApi = async () => {
        const series: SeriesAnime[] | any = await getAnimesByName(query);
        setAnimes(series);
        setLoading(false);

        if (!series.length) {
            setNullString("Ничего не найдено");
            return;
        }
    };
    const customizeRenderEmpty = () => <></>;
    const { Link } = Typography;
    const { Text, Title } = Typography;

    return (
        <ConfigProvider
            theme={{
                components: {
                    Input: {
                        fontSize: 16,
                        colorFillTertiary: "#1e1e1e",
                        activeBorderColor: "#1e1e1e",
                    },
                },
            }}
            renderEmpty={customizeRenderEmpty}
        >
            <Popover
                mouseLeaveDelay={1}
                trigger={"hover"}
                overlayStyle={{
                    width: "calc(40% + 10px)",
                    maxWidth: "calc(40% + 10px)",
                }}
                overlayInnerStyle={{ backgroundColor: "#1e1e1e" }}
                arrow={false}
                open={isShown && !loading}
                onOpenChange={() => {
                    setIsShown(false);
                    inputRef.current?.blur();
                }}
                content={
                    <List
                        style={{ backgroundColor: "#1e1e1e" }}
                        header={
                            nullString && (
                                <Flex gap={10} justify="center">
                                    <InfoCircleFilled
                                        style={{ fontSize: 20, color: "#fff" }}
                                    />
                                    <Text style={{ fontSize: 16 }} strong>
                                        {nullString}
                                    </Text>
                                </Flex>
                            )
                        }
                        dataSource={animes}
                        renderItem={(item: SeriesAnime) => (
                            <Link href={`/shikimori/${item.id}`}>
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
                                                height={90}
                                                width={60}
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
                                <Divider
                                    style={{
                                        minWidth: 0,
                                        width: "auto",
                                        margin: "10px",
                                    }}
                                />
                            </Link>
                        )}
                    />
                }
            >
                <Form
                    form={form}
                    noValidate={true}
                    autoComplete="off"
                    style={{ marginBottom: 5 }}
                >
                    <Form.Item
                        name={"query"}
                        style={{
                            margin: 0,
                        }}
                    >
                        <Input
                            ref={inputRef}
                            onClick={handleClick}
                            id="searchbar"
                            size="small"
                            className={loading === true ? "loading" : ""}
                            spellCheck={"false"}
                            variant="filled"
                            placeholder="Найти аниме"
                            onChange={(e: { target: { value: any } }) => {
                                setQuery(String(e.target.value));
                            }}
                            name="query"
                            suffix={
                                <Button type="link" htmlType="submit">
                                    <SearchOutlined />
                                </Button>
                            }
                        />
                    </Form.Item>
                </Form>
            </Popover>
        </ConfigProvider>
    );
};

export default SearchBar;
