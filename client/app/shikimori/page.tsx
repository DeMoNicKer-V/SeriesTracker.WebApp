"use client";
import { useEffect, useState } from "react";
import { Animes } from "../components/Animes";
import { getAnimes, getGenres } from "../services/shikimori";
import {
    Button,
    Col,
    Divider,
    Input,
    List,
    Row,
    Spin,
    Tag,
    Typography,
} from "antd";
import {
    RightOutlined,
    LeftOutlined,
    PlusOutlined,
    SearchOutlined,
} from "@ant-design/icons";
export default function ShikimoriPage() {
    const [loading, setLoading] = useState(false);
    const [animes, setAnimes] = useState<Anime[] | any>([]);
    const [genres, setGenres] = useState<Genre[] | any>([]);

    const getSeries = async (page: number) => {
        const animes = await getAnimes(page);
        setAnimes(animes);
    };

    const getGenresList = async () => {
        const genres = await getGenres();
        setGenres(genres);
    };
    useEffect(() => {
        getGenresList();
        getSeries(1);
    }, []);

    const [selectedTags, setSelectedTags] = useState<Genre[]>([]);
    const handleChange = (genre: Genre, checked: boolean) => {
        const nextSelectedTags = checked
            ? [...selectedTags, genre]
            : selectedTags.filter((t) => t.id !== genre.id);
        setSelectedTags(nextSelectedTags);
    };
    return (
        <div className="container">
            <title>Series Tracker - Shikimori</title>
            <Spin
                size="large"
                spinning={loading}
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                }}
            />

            <Row align={"middle"} justify={"center"}>
                <Col span={16}>
                    <div
                        style={{ zIndex: 1 }}
                        className={loading === true ? "loading" : ""}
                    >
                        <Input
                            placeholder="Введите для поиска"
                            suffix={<SearchOutlined />}
                            spellCheck={false}
                        />
                    </div>
                </Col>
            </Row>

            <Divider dashed style={{ margin: 15 }}></Divider>
            <Row>
                <Col span={4}>
                    <List
                        header={
                            <div>
                                <Input />
                                <div>
                                    {selectedTags.map((genre) => (
                                        <Tag
                                            key={genre.id}
                                            className="tag"
                                            style={{
                                                cursor: "default",
                                                backgroundColor: "transparent",
                                                borderStyle: "dashed",
                                            }}
                                        >
                                            {genre.russian}
                                        </Tag>
                                    ))}
                                </div>
                            </div>
                        }
                        bordered
                        dataSource={genres}
                        renderItem={(item: Genre) => (
                            <List.Item>
                                <Tag.CheckableTag
                                    key={item.id}
                                    checked={selectedTags.includes(item)}
                                    onChange={(checked) =>
                                        handleChange(item, checked)
                                    }
                                >
                                    {item.russian}
                                </Tag.CheckableTag>
                            </List.Item>
                        )}
                    />
                </Col>
                <Col span={20}>
                    <Animes animes={animes} />
                </Col>
            </Row>
        </div>
    );
}
