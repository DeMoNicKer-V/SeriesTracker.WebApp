import { Form } from "antd";
import Input, { SearchProps } from "antd/es/input";
import Search from "antd/es/transfer/search";
import { useEffect, useRef, useState } from "react";
import { getAllSeries, getAllSeriesSearch } from "../services/series";
import { SearchResult } from "./searchResult";

export const SearchBar = ({}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState<string>("");

    useEffect(() => {
        const handleOutSideClick = (event: any) => {
            if (!ref.current?.contains(event.target)) {
                setIsShown(false);
            } else {
                handleClick();
            }
        };
        window.addEventListener("mousedown", handleOutSideClick);

        return () => {
            window.removeEventListener("mousedown", handleOutSideClick);
        };
    }, [ref]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fakeApi();
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);
    const [isShown, setIsShown] = useState(false);
    const handleClick = () => {
        // 👇️ toggle shown state
        setIsShown((current) => !current);

        // 👇️ or simply set it to true
        // setIsShown(true);
    };
    const [series, setSeries] = useState<Series["item1"][] | any>([]);
    const fakeApi = async () => {
        const series = await getAllSeriesSearch(query);
        setSeries(series);
    };

    return (
        <div
            ref={ref}
            style={{
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "auto",
            }}
        >
            <Input
                style={{ width: "300px" }}
                placeholder="Найти сериал"
                onChange={(e: { target: { value: any } }) =>
                    setQuery(String(e.target.value))
                }
            ></Input>
            {isShown && (
                <div
                    className="menuSearch"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <div>Результаты</div>
                    <SearchResult series={series} />
                    <div>Навигация</div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
