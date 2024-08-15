export interface Props {
    listBG: string;
}
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
} from "antd";
import Input, { SearchProps } from "antd/es/input";
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

export const SearchBar = ({ listBG }: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState<string>("");

    useEffect(() => {
        const handleOutSideClick = (event: any) => {
            if (!ref.current?.contains(event.target)) {
                setIsShown(false);
            }
        };
        window.addEventListener("mousedown", handleOutSideClick);
    }, [ref]);

    useEffect(() => {
        if (!query) {
            setIsShown(false);
            setNullString("Введите для поиска");
            setLoading(false);
            return;
        }
        setLoading(true);
        setNullString("");
        const timer = setTimeout(() => {
            fakeApi();
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
    const [form] = Form.useForm();
    const router = useRouter();
    const onFinish = (values: any) => {
        setIsShown(false);
        form.resetFields();
        router.push(`/search?query=${values.query}`);
    };
    return (
        <ConfigProvider
            theme={{
                components: {
                    Input: {
                        borderRadius: 8,
                    },
                },
            }}
            renderEmpty={customizeRenderEmpty}
        >
            <div ref={ref} style={{ position: "relative" }}>
                <Form
                    form={form}
                    onFinish={onFinish}
                    noValidate={true}
                    autoComplete="off"
                    style={{ width: "100%", marginBottom: 3 }}
                >
                    <Form.Item
                        name={"query"}
                        style={{
                            margin: 0,
                            background: listBG,
                            borderRadius: 5,
                        }}
                    >
                        <Input
                            style={{ background: "none" }}
                            className={loading === true ? "loading" : ""}
                            spellCheck={"false"}
                            variant="borderless"
                            onClick={handleClick}
                            placeholder="Найти сериал"
                            onChange={(e: { target: { value: any } }) => {
                                setIsShown(true);
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

                {isShown && !loading && (
                    <List
                        style={{ background: listBG }}
                        className="search_result"
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
                        footer={
                            <Flex justify="end">
                                <Button type="text" href={"/search"}>
                                    <Text
                                        strong
                                        style={{ color: "#DE1EB2" }}
                                        italic
                                    >
                                        Расширенный поиск
                                    </Text>
                                </Button>
                            </Flex>
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
                                                <Tag
                                                    style={{
                                                        cursor: "default",
                                                    }}
                                                >
                                                    <Flex gap={4}>
                                                        <InfoCircleOutlined />
                                                        {item.kind}
                                                    </Flex>
                                                </Tag>
                                                <Tag
                                                    style={{
                                                        cursor: "default",
                                                    }}
                                                >
                                                    <Flex gap={4}>
                                                        <CalendarOutlined />
                                                        {new Date(
                                                            item.startDate
                                                        ).toLocaleString(
                                                            "ru-Ru",
                                                            {
                                                                year: "numeric",
                                                            }
                                                        )}
                                                    </Flex>
                                                </Tag>
                                                <Tag
                                                    style={{
                                                        cursor: "default",
                                                    }}
                                                >
                                                    <Flex gap={4}>
                                                        <FireOutlined />
                                                        {item.status}
                                                    </Flex>
                                                </Tag>
                                                <Tag
                                                    style={{
                                                        cursor: "default",
                                                    }}
                                                >
                                                    <Flex gap={4}>
                                                        <YoutubeOutlined />
                                                        {item.status === "Вышло"
                                                            ? `${item.episodes} эп.`
                                                            : `${item.episodesAired} из ${item.episodes} эп.`}
                                                    </Flex>
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
                                    dashed
                                />
                            </Link>
                        )}
                    />
                )}
            </div>
        </ConfigProvider>
    );
};

export default SearchBar;
