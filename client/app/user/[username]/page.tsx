"use client";
import {
    Avatar,
    Button,
    Col,
    Flex,
    Row,
    Space,
    Tooltip,
    Typography,
} from "antd";
import { useEffect, useState } from "react";
import {
    DefaultUser,
    getUserById,
    getUserByUserName,
    UserResponse,
} from "../../services/user";
import Meta from "antd/es/card/Meta";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Animes } from "@/app/components/Animes";
import {
    getAnimesByParams,
    getAnimesByUserId,
    ShikimoriRequest,
} from "@/app/services/shikimori";
import { usePathname, useRouter } from "next/navigation";

export default function UserPage({ params }: { params: { username: string } }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<DefaultUser>();
    const [animes, setAnimes] = useState<SeriesAnime[] | any>([]);
    const { Text, Title } = Typography;
    const getCurrentUser = async () => {
        const currentUser = await getUserByUserName(params.username);
        setUser(currentUser);
    };

    useEffect(() => {
        return () => {
            getCurrentUser();
        };
    }, []);
    const handleNavigate = () => {
        router.push(`${pathname}/list?mylist=0`);
    };
    return (
        <div className="container">
            <Row gutter={[15, 15]} align={"middle"} justify={"center"}>
                <Col span={18}>
                    <Space wrap>
                        <Avatar
                            size={100}
                            src={user?.avatar}
                            shape="square"
                        ></Avatar>

                        <Meta
                            title={<Title level={3}>{user?.userName}</Title>}
                            description={
                                <Flex align="center" justify="center" gap={5}>
                                    <Text>
                                        {user?.surName}
                                        {user?.name}
                                    </Text>

                                    <Text>возраст:{user?.yearsOld}</Text>
                                    <Text>
                                        {` сайте с: ${new Date(
                                            user?.regDate
                                        ).getFullYear()} г.`}

                                        <Tooltip
                                            title={new Date(
                                                user?.regDate
                                            ).toLocaleDateString("ru-RU", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        >
                                            <QuestionCircleOutlined
                                                onClick={handleNavigate}
                                                style={{ cursor: "help" }}
                                            />
                                        </Tooltip>
                                    </Text>
                                    <Button onClick={handleNavigate}>
                                        Вперед
                                    </Button>
                                </Flex>
                            }
                        ></Meta>
                    </Space>
                </Col>
            </Row>
        </div>
    );
}
