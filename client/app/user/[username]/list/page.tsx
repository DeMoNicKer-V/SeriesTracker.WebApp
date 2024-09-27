"use client";
import {
    Avatar,
    Col,
    ConfigProvider,
    Divider,
    Flex,
    Menu,
    MenuProps,
    Row,
    Space,
    Tooltip,
    Typography,
} from "antd";
import { useEffect, useState } from "react";
import Meta from "antd/es/card/Meta";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Animes } from "@/app/components/Animes";
import {
    getAnimesByParams,
    getAnimesByUserId,
    ShikimoriRequest,
} from "@/app/services/shikimori";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function UserPage({ params }: { params: { username: string } }) {
    const [animes, setAnimes] = useState<SeriesAnime[] | any>([]);
    const { Text, Title } = Typography;
    const search = useSearchParams();
    const getAnimesPost = async (userId: string, mylist: number) => {
        const animes = await getAnimesByUserId(userId, mylist);
        setAnimes(animes);
        setLoading(false);
    };
    const pathname = usePathname();
    type MenuItem = Required<MenuProps>["items"][number];
    const sortMenuItems: MenuItem[] = [
        {
            style: { marginLeft: "auto" },
            label: "Все",
            key: "0",
        },
        {
            label: "Запланировано",
            key: "1",
        },
        {
            label: "Смотрю",
            key: "2",
        },
        {
            label: "Просмотрено",
            key: "3",
        },
    ];
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    useEffect(() => {
        setLoading(true);
        getAnimesPost(
            "46772ed5-b34e-4c11-be99-8084b906774b",
            Number(search.get("mylist"))
        );
    }, [search.get("mylist")]);
    const onClick: MenuProps["onSelect"] = (e) => {
        router.push(`?mylist=${e.key}`);
    };
    return (
        <div className="container">
            <ConfigProvider
                theme={{
                    components: {
                        Menu: {
                            itemBg: "transparent",
                            darkItemBg: "transparent",
                        },
                    },
                }}
            ></ConfigProvider>
            <Link href={"./"}>Назад</Link>
            {!loading && (
                <Row gutter={[15, 15]} align={"middle"} justify={"center"}>
                    <Col span={20}>
                        <Menu
                            onSelect={onClick}
                            selectedKeys={["ranked"]}
                            items={sortMenuItems}
                            mode="horizontal"
                        />
                    </Col>
                    <Divider />
                    <Col span={20}>
                        <Animes animes={animes} />
                    </Col>
                </Row>
            )}
        </div>
    );
}
