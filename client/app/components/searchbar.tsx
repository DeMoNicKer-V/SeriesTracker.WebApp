import {
    Avatar,
    Button,
    Col,
    ConfigProvider,
    Flex,
    Form,
    List,
    Row,
    Skeleton,
    Spin,
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
        <div style={{ textAlign: "center" }}>
            <InfoCircleOutlined style={{ fontSize: 20 }} />
            <p>{nullString}</p>
        </div>
    );
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
                    <Form.Item name={"query"} style={{ margin: 0 }}>
                        <Input
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
                            addonAfter={
                                <Button type="text" htmlType="submit">
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
                                <div
                                    style={{
                                        display: "flex",
                                        flex: "0 0 auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Button type="text">
                                        <span>Расширенный поиск</span>
                                    </Button>
                                </div>
                            }
                            grid={{ gutter: [0, 10], column: 1 }}
                            style={{
                                left: "0",
                                right: "0",
                                padding: "16px",
                                position: "absolute",
                                background: "red",
                            }}
                            itemLayout="horizontal"
                            dataSource={series1}
                            renderItem={(item: Series["item1"]) => (
                                <Link
                                    style={{ display: "flex" }}
                                    href={`/series/${item.id}`}
                                >
                                    <div
                                        className="image_content"
                                        style={{
                                            backgroundImage: `url(${item.imagePath})`,
                                            backgroundSize: "cover",
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "center center",
                                            left: 0,
                                            top: 0,
                                            position: "relative",
                                        }}
                                    />

                                    <div className="item_content">
                                        <div
                                            className="cardTitle"
                                            style={{
                                                fontSize: 18,
                                            }}
                                        >
                                            <span>{item.title}</span>
                                        </div>
                                        <div
                                            className="cardTitle"
                                            style={{
                                                fontSize: 12,
                                            }}
                                        >
                                            <span>
                                                {`Просмотрено ${item.watchedEpisode} из ${item.lastEpisode}`}
                                            </span>
                                            <div className="space"></div>
                                        </div>
                                    </div>
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
