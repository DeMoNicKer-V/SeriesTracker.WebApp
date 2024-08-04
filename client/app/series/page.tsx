"use client";
import Button, { ButtonProps } from "antd/es/button";
import { useEffect, useState } from "react";
import {
    SeriesReqruest,
    createSeries,
    deleteSeries,
    getAllSeries,
    getAllSeriesCount,
    updateSeries,
} from "../services/series";

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
import { Animes } from "../components/Animes";

export default function SeriesPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    type MenuItem = Required<MenuProps>["items"][number];
    const [query, setQuery] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [seriesCount, setseriesCount] = useState<number>();
    const [series, setSeries] = useState<Series[] | any>([]);

    const getSeries = async (query: any) => {
        const series = await getAllSeries(page, query);
        setseriesCount(series["count"]);
        setSeries(series);
        console.log(series);
    };
    useEffect(() => {
        getSeries(searchParams.get("query"));
        setQuery(searchParams.get("query"));
    }, [pathname, searchParams]);

    const gotoShikimori = () => {
        router.push("/shikimori");
    };

    const updateSeriesList = async (page: number) => {
        const series = await getAllSeries(page, query);
        setseriesCount(series["count"]);
        setSeries(series["userInfo"]);
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
            <Row align={"middle"} justify={"center"}>
                <Col span={10}>
                    <Title style={{ margin: 0 }} level={3}>
                        Ваши сериалы
                    </Title>
                    <Flex justify="start">
                        <Tag
                            style={{ cursor: "default" }}
                        >{`Всего: ${seriesCount}`}</Tag>

                        <Button
                            onClick={gotoShikimori}
                            size="small"
                            type="link"
                            icon={<PlusOutlined />}
                        >
                            Добавить
                        </Button>
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
            <Animes animes={series["animeInfo"]} />
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
