"use client";
import Button, { ButtonProps } from "antd/es/button";
import { Series } from "../components/Series";
import { useEffect, useState } from "react";
import {
    SeriesReqruest,
    createSeries,
    deleteSeries,
    getAllSeries,
    getAllSeriesCount,
    updateSeries,
} from "../services/series";
import { CreateUpdateSeries, Mode } from "../components/AddUpdateSeries";
import {
    Col,
    ConfigProvider,
    Divider,
    Flex,
    FloatButton,
    Menu,
    MenuProps,
    Pagination,
    PaginationProps,
    Popconfirm,
    Row,
    Space,
    Tag,
    Typography,
} from "antd";
import { usePathname, useSearchParams } from "next/navigation";
import {
    RightOutlined,
    LeftOutlined,
    PlusOutlined,
    SettingOutlined,
    EditOutlined,
    InfoCircleOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { redirect, useRouter } from "next/navigation";
import { ShikimoriLogo } from "../img/ShikimoriLogo";
import SeriesDrawer from "../components/SeriesDrawer";

export default function SeriesPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const defaultValues = {
        title: "",
        description: "",
        imagePath: "",
        watchedEpisode: 0,
        lastEpisode: 10,
        rating: 0,
        releaseDate: dayjs().toDate().toString(),
        isOver: false,
        isFavorite: false,
    } as Series["item1"];

    type MenuItem = Required<MenuProps>["items"][number];
    const [values, setValues] = useState<Series["item1"]>(defaultValues);
    const [query, setQuery] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [seriesCount, setseriesCount] = useState<Series["item2"]>();
    const [series, setSeries] = useState<Series["item1"][] | any>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [mode, setMode] = useState(Mode.Create);

    const getSeries = async (query: any) => {
        const series = await getAllSeries(page, query);
        setseriesCount(series["item2"]);
        setSeries(series["item1"]);
    };
    useEffect(() => {
        getSeries(searchParams.get("query"));
        setQuery(searchParams.get("query"));
    }, [pathname, searchParams]);

    const handleCreateSeries = async (request: SeriesReqruest) => {
        await createSeries(request);
        closeModal();

        const series = await getAllSeries(page, query);
        setseriesCount(series["item2"]);
        setSeries(series["item1"]);
    };

    const gotoShikimori = () => {
        router.push("/shikimori");
    };

    const updateSeriesList = async (page: number) => {
        const series = await getAllSeries(page, query);
        setseriesCount(series["item2"]);
        setSeries(series["item1"]);
    };

    const handleUpdateSeries = async (id: string, request: SeriesReqruest) => {
        await updateSeries(id, request);
        closeModal();

        const series = await getAllSeries(page, query);
        setSeries(series["item1"]);
    };

    const deleteThisSeries = async (id: string) => {
        await deleteSeries(id);
        closeModal();
        if (series.length == 1) {
            await updateSeriesList(page - 1);
        } else {
            const series1 = await getAllSeries(page, query);
            setseriesCount(series.item2);
            setSeries(series1["item1"]);
        }
    };

    const openEditModel = (series: Series["item1"]) => {
        setMode(Mode.Edit);
        setValues(series);
        setIsModalOpen(true);
    };

    const openModal = () => {
        setMode(Mode.Create);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setValues(defaultValues);
        setIsModalOpen(false);
    };
    const { Text, Title } = Typography;

    const items2: MenuItem[] = [
        {
            style: {
                marginLeft: "auto",
            },
            label: "По дате изменения",
            key: "changed",
            icon: <SettingOutlined />,
        },
        {
            label: "По дате добавления",
            key: "added",
            icon: <SettingOutlined />,
        },
        {
            label: "По избранным",
            key: "favorite",
            icon: <SettingOutlined />,
        },
        {
            style: {
                cursor: "default",
                padding: 0,
            },
            key: "prev_next",
            disabled: true,
            label: (
                <Space split={<Divider type="vertical" />}>
                    <Button size="small" icon={<LeftOutlined />}>
                        Назад
                    </Button>
                    <Button
                        size="small"
                        iconPosition="end"
                        icon={<RightOutlined />}
                    >
                        Вперед
                    </Button>
                </Space>
            ),
        },
    ];
    const buttonOk: ButtonProps = {
        size: "middle",
        type: "default",
        style: {
            fontSize: 16,
            marginBottom: 10,
            marginLeft: 10,
            marginRight: 10,
            marginTop: 0,
        },
        icon: <EditOutlined />,
    };
    const buttonCancel: ButtonProps = {
        size: "middle",
        type: "default",
        style: {
            fontSize: 16,
            marginBottom: 10,
            marginLeft: 10,
            marginRight: 10,
            marginTop: 0,
        },
        icon: <ShikimoriLogo />,
    };

    const [openDrawer, setOpenDrawer] = useState(false);

    const showDrawer = () => {
        setOpenDrawer(true);
    };

    const closeDrawer = () => {
        setOpenDrawer(false);
    };
    return (
        <div className="container">
            <CreateUpdateSeries
                mode={mode}
                values={values}
                isModalOpen={isModalOpen}
                handleCreate={handleCreateSeries}
                handleUpdate={handleUpdateSeries}
                handleCancel={closeModal}
            />
            <Row align={"middle"} justify={"center"}>
                <Col span={10}>
                    <Title style={{ margin: 0 }} level={3}>
                        Ваши сериалы
                    </Title>
                    <Flex justify="start">
                        <Tag
                            style={{ cursor: "default" }}
                        >{`Всего: ${seriesCount}`}</Tag>

                        <Popconfirm
                            placement="bottomLeft"
                            title={
                                <Title level={4}>
                                    {"Что вы хотите добавить?"}
                                </Title>
                            }
                            icon={
                                <InfoCircleOutlined style={{ fontSize: 28 }} />
                            }
                            okButtonProps={buttonOk}
                            cancelButtonProps={buttonCancel}
                            okText="Свой сериал"
                            cancelText="Аниме Shikimori"
                            onCancel={gotoShikimori}
                            onConfirm={openModal}
                        >
                            <Button
                                size="small"
                                type="link"
                                icon={<PlusOutlined />}
                            >
                                Добавить
                            </Button>
                        </Popconfirm>
                    </Flex>
                </Col>
                <Col span={14}>
                    <ConfigProvider
                        theme={{
                            components: {
                                Menu: {
                                    itemBg: "transparent",
                                    darkItemBg: "transparent",
                                },
                            },
                        }}
                    >
                        <Menu
                            defaultSelectedKeys={["changed"]}
                            items={items2}
                            mode="horizontal"
                        />
                    </ConfigProvider>
                </Col>
            </Row>
            <Divider />
            <Series series={series} />
            <Row style={{ marginTop: 20 }} justify="center">
                <Col>
                    <Pagination
                        responsive
                        current={page}
                        onChange={(current: any) => {
                            setPage(current);
                            updateSeriesList(current);
                        }}
                        showTitle={false}
                        pageSize={30}
                        total={Number(seriesCount)}
                        showSizeChanger={false}
                    />
                </Col>
            </Row>
            <SeriesDrawer isOpen={openDrawer} onClose={closeDrawer} />
            <FloatButton
                onClick={() => showDrawer()}
                style={{ right: 24 }}
                shape="circle"
                icon={<CalendarOutlined />}
            ></FloatButton>
        </div>
    );
}
