"use client";
import {
    Avatar,
    Button,
    Card,
    Carousel,
    Col,
    Image,
    ConfigProvider,
    Flex,
    Row,
    Tag,
    Tooltip,
    Typography,
    FloatButton,
    Divider,
    Collapse,
    CollapseProps,
    Spin,
    Space,
    MenuProps,
    Dropdown,
    InputNumber,
    Input,
} from "antd";
import { useEffect, useRef, useState } from "react";
import Meta from "antd/es/card/Meta";
import { AnimeInfo, getAnimeById } from "@/app/services/shikimori";
import AbsoluteImage from "@/app/components/AbsoluteImage";
import {
    StarOutlined,
    LoadingOutlined,
    CalendarOutlined,
    DownOutlined,
    ClockCircleOutlined,
    BookOutlined,
    TeamOutlined,
    EyeOutlined,
    FireOutlined,
    YoutubeOutlined,
    ReadOutlined,
    PlusOutlined,
    DesktopOutlined,
    CopyrightOutlined,
    InfoCircleOutlined,
    MinusOutlined,
} from "@ant-design/icons";
import { title } from "process";
import {
    createSeries,
    deleteSeries,
    deleteSeriesByAnimeId,
} from "@/app/services/series";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LongLeftArrow } from "@/app/img/LongLeftArrow";
import { getCategoryById, getCategoryList } from "@/app/services/category";
import { skip } from "node:test";

export default function AnimePage({ params }: { params: { id: string } }) {
    const [animes, setAnimes] = useState<Anime[] | any>([]);
    const [series, setSeries] = useState<SeriesInfo | any>();
    const [loading, setLoading] = useState<boolean>(true);
    const [genres, setGenres] = useState<string[]>([]);
    const [categories, setCategories] = useState<MenuProps["items"]>([]);
    const [category, setCategory] = useState<Category | any>();
    const getCategories = async (series: SeriesInfo) => {
        const categories2 = await getCategoryList();
        const array: MenuProps["items"] = [];
        categories2.forEach((element: { id: number; title: string }) => {
            if (element.id === series.categoryId) {
                array.push({
                    key: -1,
                    label: "Удалить из списка",
                    danger: true,
                    onClick: async () => deleteFromMylist(series.animeId),
                });
            } else {
                array.unshift({
                    key: element.id,
                    label: element.title,
                });
            }
        });

        setCategories(array);
    };
    const getAnimes = async (id: string) => {
        const series = await getAnimeById(id);
        setAnimes(series.anime);
        if (series.series.id) {
            setSeries(series.series);
            const category = await getCategoryById(series.series.categoryId);
            setCategory(category);
        }
        getCategories(series.series);
        const gg = series.anime.genres.split(",");
        setGenres(gg);
        setLoading(false);
    };
    useEffect(() => {
        if (params.id) {
            getAnimes(params.id);
        }
    }, []);

    const deleteFromMylist = async (id: number) => {
        await deleteSeriesByAnimeId(id);
    };
    const AddToMyList = async () => {
        const seriesRequest = {
            animeId: animes.id,
            watchedEpisode: 0,
            categoryId: 1,
            isFavorite: false,
        };
        await createSeries(seriesRequest);
    };

    const cardStyle: React.CSSProperties = {
        padding: "22% 20px 20px 20px",
        height: "100%",
        alignItems: "flex-end",
    };

    const subCol: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: "3px",
        padding: "10px",
    };
    const { Title, Text } = Typography;
    const items: MenuProps["items"] = categories;
    const menuProps = {
        items,
    };
    return (
        <div
            className="container detail"
            style={{
                marginLeft: "auto",
                marginRight: "auto",
            }}
        >
            <title>
                {!animes.title
                    ? "Series Tracker"
                    : `Series Tracker - ${animes.subTitle}`}
            </title>
            <Spin
                size="large"
                spinning={loading}
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                }}
            />
            {!loading && (
                <Row align={"middle"} justify={"center"}>
                    <Col span={21}>
                        <Card
                            cover={
                                <Flex
                                    style={{
                                        maxWidth: "100%",
                                        overflow: "hidden",
                                        position: "relative",
                                        zIndex: 0,
                                        borderBottomRightRadius: "0",
                                        borderBottomLeftRadius: "0",
                                        borderTopRightRadius: "5px",
                                        borderTopLeftRadius: "5px",
                                    }}
                                >
                                    <AbsoluteImage
                                        src={animes.pictureUrl}
                                        zIndex={-1}
                                    />
                                    <div className="overlay-background">
                                        <Row
                                            className="anime-detail-row"
                                            align={"middle"}
                                            justify={"center"}
                                            style={cardStyle}
                                        >
                                            <Col
                                                xs={24}
                                                sm={24}
                                                lg={24}
                                                xl={7}
                                                md={24}
                                                xxl={5}
                                            >
                                                <Flex className="flex-detail">
                                                    <Image
                                                        style={{
                                                            maxHeight: "380px",
                                                            pointerEvents:
                                                                "none",
                                                            borderRadius: 5,
                                                            aspectRatio: "7/10",
                                                        }}
                                                        preview={false}
                                                        src={animes.pictureUrl}
                                                    />
                                                </Flex>
                                            </Col>
                                            <Col
                                                className="anime-detail-col"
                                                style={subCol}
                                                xs={24}
                                                sm={24}
                                                lg={24}
                                                md={24}
                                                xl={17}
                                                xxl={19}
                                            >
                                                <Meta
                                                    className="anime-detail-title"
                                                    style={{
                                                        marginBottom: 0,
                                                        fontSize: 17,
                                                    }}
                                                    title={
                                                        <Title
                                                            style={{
                                                                margin: 0,
                                                            }}
                                                            level={3}
                                                        >
                                                            {animes.title}
                                                        </Title>
                                                    }
                                                    description={
                                                        animes.subTitle
                                                    }
                                                />
                                                <Space
                                                    align={"center"}
                                                    size={[8, 8]}
                                                    wrap
                                                >
                                                    {genres.map(
                                                        (genre: string) => (
                                                            <Tag
                                                                className="tag"
                                                                style={{
                                                                    cursor: "default",
                                                                    backgroundColor:
                                                                        "transparent",
                                                                }}
                                                            >
                                                                {genre}
                                                            </Tag>
                                                        )
                                                    )}
                                                </Space>
                                                <Space
                                                    align={"center"}
                                                    size={[8, 8]}
                                                    wrap
                                                    style={{
                                                        cursor: "default",
                                                    }}
                                                >
                                                    <Flex gap={5}>
                                                        <InfoCircleOutlined />
                                                        <Text>
                                                            {animes.kind}
                                                        </Text>
                                                    </Flex>

                                                    <Text className="dot-separator">
                                                        •
                                                    </Text>
                                                    <Flex gap={5}>
                                                        <TeamOutlined />
                                                        <Text>
                                                            {animes.rating}
                                                        </Text>
                                                    </Flex>
                                                    <Text className="dot-separator">
                                                        •
                                                    </Text>
                                                    <Flex gap={5}>
                                                        <FireOutlined />
                                                        <Text>
                                                            {animes.status}
                                                        </Text>
                                                    </Flex>
                                                    <Text className="dot-separator">
                                                        •
                                                    </Text>
                                                    <Tooltip
                                                        arrow={false}
                                                        title={`Дата выхода: ${new Date(
                                                            animes.startDate
                                                        ).toLocaleString(
                                                            "ru-Ru",
                                                            {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            }
                                                        )}`}
                                                    >
                                                        <Flex gap={5}>
                                                            <CalendarOutlined />
                                                            <Text>
                                                                {new Date(
                                                                    animes.startDate
                                                                ).getFullYear()}
                                                            </Text>
                                                        </Flex>
                                                    </Tooltip>
                                                    <Text className="dot-separator">
                                                        •
                                                    </Text>
                                                    <Flex gap={5}>
                                                        <YoutubeOutlined />
                                                        <Text>
                                                            {`${animes.episodes} эп.`}
                                                        </Text>
                                                    </Flex>

                                                    <Text className="dot-separator">
                                                        •
                                                    </Text>
                                                    <Tooltip
                                                        arrow={false}
                                                        title={`Ср. длительность эпизода:  ${animes.duration} мин.`}
                                                    >
                                                        <Flex gap={5}>
                                                            <ClockCircleOutlined />
                                                            <Text>{`${animes.duration} мин.`}</Text>
                                                        </Flex>
                                                    </Tooltip>
                                                    <Text className="dot-separator">
                                                        •
                                                    </Text>
                                                    <Tooltip
                                                        arrow={false}
                                                        title={`Оценка ${animes.score} из 10`}
                                                    >
                                                        <Flex gap={5}>
                                                            <StarOutlined />
                                                            <Text>
                                                                {animes.score}
                                                            </Text>
                                                        </Flex>
                                                    </Tooltip>
                                                </Space>
                                                <Space
                                                    wrap
                                                    className="space-buttons"
                                                    style={{
                                                        cursor: "default",
                                                    }}
                                                >
                                                    <Button
                                                        type="link"
                                                        size="large"
                                                        ghost
                                                    >
                                                        <Link
                                                            className="manage-button"
                                                            style={{
                                                                display: "flex",
                                                                flexDirection:
                                                                    "row",
                                                                justifyContent:
                                                                    "center",
                                                                alignItems:
                                                                    "center",
                                                                gap: "5px",
                                                            }}
                                                            href={"./"}
                                                        >
                                                            <LongLeftArrow />
                                                            назад
                                                        </Link>
                                                    </Button>
                                                    <Dropdown.Button
                                                        size="small"
                                                        menu={menuProps}
                                                        icon={<DownOutlined />}
                                                        className="manage-button"
                                                        onClick={AddToMyList}
                                                        style={{
                                                            width: "100%",
                                                            whiteSpace:
                                                                "break-spaces",
                                                            height: "auto",
                                                            borderRadius: 5,
                                                        }}
                                                    >
                                                        <PlusOutlined />
                                                        {!series &&
                                                            "Добавить в мой список"}
                                                        {series &&
                                                            category.title}
                                                    </Dropdown.Button>
                                                    {category && (
                                                        <InputNumber
                                                            size="small"
                                                            maxLength={4}
                                                            addonBefore={
                                                                <Button
                                                                    type="link"
                                                                    size="small"
                                                                    icon={
                                                                        <MinusOutlined />
                                                                    }
                                                                ></Button>
                                                            }
                                                            addonAfter={
                                                                <Button
                                                                    type="link"
                                                                    size="small"
                                                                    icon={
                                                                        <PlusOutlined />
                                                                    }
                                                                ></Button>
                                                            }
                                                            style={{
                                                                width: "auto",
                                                            }}
                                                            max={
                                                                animes.episodes
                                                            }
                                                            prefix={
                                                                <Text>
                                                                    {"Эпизоды:"}
                                                                </Text>
                                                            }
                                                            suffix={
                                                                <Text>{`из ${animes.episodes} эп.`}</Text>
                                                            }
                                                            min={0}
                                                            defaultValue={
                                                                series.watchedEpisode
                                                            }
                                                            variant="filled"
                                                            step={1}
                                                            controls={false}
                                                        />
                                                    )}
                                                </Space>
                                            </Col>
                                        </Row>
                                    </div>
                                </Flex>
                            }
                        >
                            <Meta
                                style={{ padding: 24 }}
                                title={<Title level={3}>Описание</Title>}
                                description={animes.description}
                            />
                            <Collapse
                                items={[
                                    {
                                        key: "1",
                                        label: (
                                            <Button type="link" size="small">
                                                Посмотреть кадры
                                            </Button>
                                        ),
                                        children: (
                                            <Row
                                                justify="center"
                                                align="middle"
                                            >
                                                <Col span={24}>
                                                    <Flex
                                                        className="flex-ant-image"
                                                        justify="center"
                                                        align="center"
                                                        gap={10}
                                                    >
                                                        {animes.screenshots
                                                            .slice(0, 3)
                                                            .map(
                                                                (
                                                                    animes: Screenshot
                                                                ) => (
                                                                    <Image
                                                                        style={{
                                                                            maxWidth: 300,
                                                                            width: 300,
                                                                        }}
                                                                        preview
                                                                        src={
                                                                            animes.originalUrl
                                                                        }
                                                                    ></Image>
                                                                )
                                                            )}
                                                    </Flex>
                                                </Col>
                                                <Col style={{ padding: 12 }}>
                                                    <Link
                                                        style={{
                                                            fontStyle: "italic",
                                                        }}
                                                        href={`${params.id}/screen`}
                                                    >
                                                        Посмотреть больше кадров
                                                    </Link>
                                                </Col>
                                            </Row>
                                        ),
                                    },
                                    {
                                        key: "2",
                                        label: (
                                            <Button type="link" size="small">
                                                Связанное с этим аниме
                                            </Button>
                                        ),
                                        children:
                                            animes.relateds &&
                                            animes.relateds.map(
                                                (a: Related) => (
                                                    <Link
                                                        href={`/shikimori/${a.anime.id}`}
                                                    >
                                                        <Card
                                                            style={{
                                                                padding: 12,
                                                                marginBottom: 8,
                                                            }}
                                                            hoverable
                                                        >
                                                            <Row
                                                                className="related-anime"
                                                                align={"middle"}
                                                                justify={
                                                                    "start"
                                                                }
                                                            >
                                                                <Col>
                                                                    <Image
                                                                        preview={
                                                                            false
                                                                        }
                                                                        height={
                                                                            90
                                                                        }
                                                                        src={
                                                                            a
                                                                                .anime
                                                                                .pictureUrl
                                                                        }
                                                                    />
                                                                </Col>
                                                                <Col offset={1}>
                                                                    <Meta
                                                                        style={{
                                                                            padding: 0,
                                                                            marginBottom: 8,
                                                                            whiteSpace:
                                                                                "break-spaces",
                                                                        }}
                                                                        title={
                                                                            a
                                                                                .anime
                                                                                .title
                                                                        }
                                                                        description={
                                                                            a
                                                                                .anime
                                                                                .subTitle
                                                                        }
                                                                    />
                                                                    <Space
                                                                        wrap
                                                                        size={[
                                                                            5,
                                                                            5,
                                                                        ]}
                                                                    >
                                                                        <Tag
                                                                            style={{
                                                                                cursor: "default",
                                                                            }}
                                                                        >
                                                                            <Flex
                                                                                gap={
                                                                                    4
                                                                                }
                                                                            >
                                                                                <InfoCircleOutlined />
                                                                                {
                                                                                    a
                                                                                        .anime
                                                                                        .kind
                                                                                }
                                                                            </Flex>
                                                                        </Tag>
                                                                        <Tag
                                                                            style={{
                                                                                cursor: "default",
                                                                            }}
                                                                        >
                                                                            <Flex
                                                                                gap={
                                                                                    4
                                                                                }
                                                                            >
                                                                                <CalendarOutlined />
                                                                                {
                                                                                    a
                                                                                        .anime
                                                                                        .startDate
                                                                                }
                                                                            </Flex>
                                                                        </Tag>
                                                                        <Tag
                                                                            style={{
                                                                                cursor: "default",
                                                                            }}
                                                                        >
                                                                            <Flex
                                                                                gap={
                                                                                    4
                                                                                }
                                                                            >
                                                                                <ReadOutlined />
                                                                                {
                                                                                    a.relationText
                                                                                }
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
                                                                margin: "0px 15px",
                                                            }}
                                                            dashed
                                                        />
                                                    </Link>
                                                )
                                            ),
                                    },
                                ]}
                                bordered={false}
                                style={{ margin: 24 }}
                            ></Collapse>
                        </Card>
                    </Col>
                </Row>
            )}
            <FloatButton.BackTop style={{ right: 24 }} />
        </div>
    );
}
