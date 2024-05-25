import {
    Avatar,
    Button,
    Card,
    Col,
    ConfigProvider,
    Empty,
    Flex,
    Form,
    List,
    Row,
    Skeleton,
    Spin,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import Input, { SearchProps } from "antd/es/input";
import Search from "antd/es/transfer/search";
import { useEffect, useRef, useState } from "react";
import { getAllSeries, getAllSeriesSearch } from "../services/series";
import { SearchResult } from "./searchResult";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SearchOutlined,
    InfoCircleOutlined,
    SmileOutlined,
    LoadingOutlined,
    FileImageOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import "./searchbar.css";
import { redirect, useRouter } from "next/navigation";
import { useForm } from "antd/es/form/Form";

export const SearchBar = ({}) => {
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
        setLoading(true);
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
    const [series1, setSeries] = useState<Series["item1"][] | any>([]);
    const fakeApi = async () => {
        const series = await getAllSeriesSearch(query);
        setSeries(series);

        query === ""
            ? setNullString("Введите для поиска.")
            : setNullString("Ничего не найдено.");

        setLoading(false);
        if (series1 === undefined) return;
    };
    const customizeRenderEmpty = () => (
        <Flex justify="center" gap={5}>
            <InfoCircleOutlined style={{ fontSize: 30 }} />{" "}
            <Text>{nullString}</Text>
        </Flex>
    );
    const { Link } = Typography;
    const { Text } = Typography;
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
                            background: "#1e1e1e",
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

                {isShown && (
                    <div className="search_result">
                        <List
                            footer={
                                <Flex justify="end">
                                    <Tooltip title="Расширенный поиск">
                                        <Button
                                            type="dashed"
                                            shape="circle"
                                            icon={<SearchOutlined />}
                                        />
                                    </Tooltip>
                                </Flex>
                            }
                            grid={{ gutter: [0, 10], column: 1 }}
                            itemLayout="horizontal"
                            dataSource={series1}
                            renderItem={(item: Series["item1"]) => (
                                <Link
                                    target="_self"
                                    href={`/series/${item.id}`}
                                >
                                    <Card
                                        bordered={false}
                                        hoverable
                                        style={{
                                            padding: 10,
                                            background: "transparent",
                                            width: "100%",
                                        }}
                                    >
                                        <Card.Grid
                                            hoverable={false}
                                            style={{
                                                boxShadow: "none",
                                                width: "18%",
                                                margin: 0,
                                                padding: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "start",
                                            }}
                                        >
                                            {item.imagePath === "" && (
                                                <div
                                                    className="image_content"
                                                    style={{
                                                        overflow: "hidden",
                                                        backgroundSize: "cover",
                                                        backgroundRepeat:
                                                            "no-repeat",
                                                        backgroundPosition:
                                                            "center center",
                                                    }}
                                                >
                                                    <FileImageOutlined />
                                                </div>
                                            )}
                                            {item.imagePath !== "" && (
                                                <div
                                                    className="image_content"
                                                    style={{
                                                        overflow: "hidden",
                                                        backgroundImage: `url(${item.imagePath})`,
                                                        backgroundSize: "cover",
                                                        backgroundRepeat:
                                                            "no-repeat",
                                                        backgroundPosition:
                                                            "center center",
                                                    }}
                                                ></div>
                                            )}
                                        </Card.Grid>
                                        <Card.Grid
                                            hoverable={false}
                                            style={{
                                                boxShadow: "none",
                                                width: "60%",
                                                margin: 0,
                                                padding: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "start",
                                            }}
                                        >
                                            <div>
                                                <Text
                                                    strong
                                                    style={{ fontSize: 12 }}
                                                >
                                                    {item.title}
                                                </Text>

                                                <Flex>
                                                    <Tag
                                                        style={{ fontSize: 10 }}
                                                    >{`Просмотрено ${item.watchedEpisode} из ${item.lastEpisode}`}</Tag>
                                                    <Tag
                                                        style={{ fontSize: 10 }}
                                                    >{`Рейтинг ${item.rating} из 10`}</Tag>
                                                </Flex>
                                            </div>
                                        </Card.Grid>
                                        <Card.Grid
                                            hoverable={false}
                                            style={{
                                                boxShadow: "none",
                                                width: "22%",
                                                margin: 0,
                                                padding: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "end",
                                            }}
                                        >
                                            <div style={{ fontSize: 12 }}>
                                                {new Date(
                                                    item.addedDate
                                                ).toLocaleString("ru-Ru", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </div>
                                        </Card.Grid>
                                    </Card>
                                </Link>
                            )}
                        />
                    </div>
                )}
            </div>
        </ConfigProvider>
    );
};

export default SearchBar;
