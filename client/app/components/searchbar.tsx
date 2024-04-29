import { Avatar, Col, ConfigProvider, Flex, Form, List, Row } from "antd";
import Input, { SearchProps } from "antd/es/input";
import Search from "antd/es/transfer/search";
import { useEffect, useRef, useState } from "react";
import { getAllSeries, getAllSeriesSearch } from "../services/series";
import { SearchResult } from "./searchResult";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    InfoCircleOutlined,
    SmileOutlined,
} from "@ant-design/icons";
import Link from "next/link";

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
        const timer = setTimeout(() => {
            fakeApi();
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);
    const handleClick = () => {
        setIsShown((current) => !current);
    };
    const [isShown, setIsShown] = useState(false);
    const [nullString, setNullString] = useState("Введите для поиска");
    const [series1, setSeries] = useState<Series["item1"][] | any>([]);
    const fakeApi = async () => {
        const series = await getAllSeriesSearch(query);
        setSeries(series);

        query === ""
            ? setNullString("Введите для поиска.")
            : setNullString("Ничего не найдено.");
        if (series1 === undefined) return;
    };
    const customizeRenderEmpty = () => (
        <div style={{ textAlign: "center" }}>
            <InfoCircleOutlined style={{ fontSize: 20 }} />
            <p>{nullString}</p>
        </div>
    );
    return (
        <div
            className="d-flex align-center col col-4"
            style={{ position: "relative" }}
            ref={ref}
        >
            <Form>
                <Input
                    onClick={handleClick}
                    placeholder="Найти сериал"
                    onChange={(e: { target: { value: any } }) =>
                        setQuery(String(e.target.value))
                    }
                ></Input>
            </Form>
            {isShown && (
                <div className="my">
                    <ConfigProvider renderEmpty={customizeRenderEmpty}>
                        <List
                            grid={{ gutter: [0, 10], column: 1 }}
                            itemLayout="horizontal"
                            dataSource={series1}
                            renderItem={(item: Series["item1"]) => (
                                <Link href={`/series/${item.id}`}>
                                    <List.Item>
                                        <Flex
                                            align="center"
                                            justify="flex-start"
                                        >
                                            <List.Item.Meta
                                                avatar={
                                                    <div
                                                        className="image_content"
                                                        style={{
                                                            backgroundImage: `url(${item.imagePath})`,
                                                            backgroundSize:
                                                                "cover",
                                                            backgroundRepeat:
                                                                "no-repeat",
                                                            backgroundPosition:
                                                                "center center",

                                                            left: 0,
                                                            top: 0,
                                                            position:
                                                                "relative",
                                                        }}
                                                    />
                                                }
                                            />
                                            <div className="content">
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
                                        </Flex>
                                    </List.Item>
                                </Link>
                            )}
                        />
                    </ConfigProvider>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
