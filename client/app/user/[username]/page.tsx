"use client";
import {
    Avatar,
    Button,
    Card,
    Col,
    ConfigProvider,
    Divider,
    Flex,
    FloatButton,
    Image,
    List,
    Row,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import { useState } from "react";
import { getUserByUserName, MainUserInfo } from "../../services/user";
import {
    CrownOutlined,
    SettingOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { getAnimesById, LastActivityAnime } from "@/app/services/shikimori";
import { IsCurrentUser } from "@/app/api/coockie";
import { EmptyView } from "@/app/components/EmptyView";
import useSWR from "swr";
import { LongRightArrow } from "@/app/img/LongRightArrow";

import dayjs from "dayjs";
import "dayjs/locale/ru";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.locale("ru");
dayjs.extend(relativeTime);

export default function UserPage({ params }: { params: { username: string } }) {
    const router = useRouter();
    const [error, setError] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<boolean>(false);
    const pathname = usePathname();
    const [userInfo, setUserInfo] = useState<MainUserInfo | null>(null);
    const [animes, setAnimes] = useState<LastActivityAnime[]>();
    const { Text, Title } = Typography;

    const getCurrentUser = async (username: string) => {
        const user = await getUserByUserName(username);
        console.log(username);
        if (!user) {
            return;
        }
        setError(true);
        setCurrentUser(await IsCurrentUser(username));
        setUserInfo(user);
        if (user.activityInfo.length > 0) {
            const animes = await getAnimesById(user.activityInfo);
            setAnimes(animes);
        }
    };

    const { isLoading } = useSWR(params.username, getCurrentUser, {
        // Опции для useSWR
        revalidateOnFocus: false, // Отключить обновление при фокусе
        revalidateOnReconnect: false, // Отключить обновление при восстановлении соединения
    });
    const getFormatedAge = (dateBirth: string) => {
        return dayjs(dateBirth).fromNow(true);
    };
    const { Meta } = Card;
    const customizeRenderEmpty = () => (
        <EmptyView text="Пользователь еще ничего не добавил" />
    );
    return error === true ? (
        <div className="container">
            <title>{`${params.username} / Профиль`}</title>
            <Row gutter={[15, 15]} align={"top"} justify={"center"}>
                <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
                    <Card
                        style={{
                            padding: 12,
                        }}
                        bordered
                    >
                        <Row
                            className="responsive-text-align"
                            gutter={[15, 15]}
                            align={"middle"}
                        >
                            <Col>
                                <Avatar
                                    style={{
                                        backgroundColor: "transparent",
                                    }}
                                    icon={<UserOutlined />}
                                    size={100}
                                    src={
                                        userInfo?.userInfo?.avatar
                                            ? userInfo?.userInfo?.avatar
                                            : null
                                    }
                                    shape="circle"
                                ></Avatar>
                            </Col>
                            <Col>
                                <Meta
                                    style={{
                                        marginBottom: 0,
                                        fontSize: 17,
                                    }}
                                    title={
                                        <Flex
                                            align="center"
                                            className="responsive-text-align"
                                        >
                                            <Title
                                                style={{
                                                    margin: 0,
                                                }}
                                                level={3}
                                            >
                                                {userInfo?.userInfo.userName}
                                            </Title>
                                            {userInfo?.userInfo.roleId ===
                                                1 && (
                                                <Tooltip title="Админ">
                                                    <Button
                                                        color="gold"
                                                        variant="link"
                                                        icon={<CrownOutlined />}
                                                    />
                                                </Tooltip>
                                            )}
                                        </Flex>
                                    }
                                    description={
                                        <Flex
                                            gap={5}
                                            justify="center"
                                            align="center"
                                        >
                                            <Text>
                                                {userInfo?.userInfo.name}
                                            </Text>
                                            <Text>
                                                {userInfo?.userInfo.surName}
                                            </Text>

                                            <Divider type="vertical" />
                                            {userInfo?.userInfo.dateBirth && (
                                                <Text>
                                                    {getFormatedAge(
                                                        userInfo?.userInfo
                                                            .dateBirth
                                                    )}
                                                </Text>
                                            )}
                                            <Divider type="vertical" />
                                            {userInfo?.userInfo.regDate && (
                                                <Flex gap={5}>
                                                    <Text>{`на сайте с`}</Text>
                                                    <Text
                                                        underline
                                                        style={{
                                                            cursor: "help",
                                                            textDecorationStyle:
                                                                "dashed",
                                                        }}
                                                    >
                                                        <Tooltip
                                                            title={new Date(
                                                                userInfo?.userInfo?.regDate
                                                            ).toLocaleDateString(
                                                                "ru-RU",
                                                                {
                                                                    day: "numeric",
                                                                    month: "long",
                                                                    year: "numeric",
                                                                }
                                                            )}
                                                        >
                                                            {`${new Date(
                                                                userInfo?.userInfo?.regDate
                                                            ).getFullYear()} г.`}{" "}
                                                        </Tooltip>
                                                    </Text>
                                                </Flex>
                                            )}
                                        </Flex>
                                    }
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>
                {userInfo?.seriesInfo.length ? (
                    <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                        <Title level={4}>
                            <Link
                                href={`${userInfo?.userInfo.userName}/list?mylist=0`}
                            >
                                Список аниме
                            </Link>
                        </Title>
                        <Divider />
                        <Row>
                            {userInfo?.seriesInfo.map((item) => (
                                <Tooltip color={item.color} title={item.name}>
                                    <Col flex={item.seriesCount}>
                                        <Card
                                            bordered={false}
                                            hoverable
                                            style={{
                                                backgroundColor: item.color,
                                                borderRadius: 0,
                                                textAlign: "center",
                                                padding: 0,
                                                margin: 0,
                                            }}
                                        >
                                            {item.seriesCount}
                                        </Card>
                                    </Col>
                                </Tooltip>
                            ))}
                        </Row>
                    </Col>
                ) : (
                    <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                        <EmptyView text="Пользователь еще ничего не добавил" />
                    </Col>
                )}
                <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                    <Row gutter={[25, 25]} justify={"center"}>
                        {userInfo?.seriesInfo.map((item) => (
                            <Col>
                                <Flex style={{ flexDirection: "column" }}>
                                    <Link
                                        style={{ marginBottom: 3 }}
                                        className="title-link"
                                        href={`${userInfo?.userInfo.userName}/list?mylist=${item.id}`}
                                    >
                                        {`${item.name} (${item.seriesCount})`}
                                    </Link>
                                    <Tag
                                        style={{ padding: 0, margin: 0 }}
                                        color={item.color}
                                    ></Tag>
                                </Flex>
                            </Col>
                        ))}
                    </Row>
                </Col>
                {userInfo?.seriesInfo.length > 0 && (
                    <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                        <Title level={4}>
                            <Link href={`${userInfo?.userInfo.userName}/list`}>
                                Последняя активность
                            </Link>
                        </Title>
                        <Divider />
                        <ConfigProvider renderEmpty={customizeRenderEmpty}>
                            <List
                                loading={{
                                    spinning: isLoading,
                                    size: "large",
                                }}
                                dataSource={animes}
                                renderItem={(item: LastActivityAnime) => (
                                    <List.Item style={{ display: "block" }}>
                                        <Link href={`/shikimori/${item.id}`}>
                                            <Card
                                                style={{ padding: 12 }}
                                                hoverable
                                            >
                                                <Row
                                                    className="responsive-text-align"
                                                    gutter={[20, 20]}
                                                    align={"middle"}
                                                >
                                                    <Col
                                                        xs={24}
                                                        sm={4}
                                                        lg={4}
                                                        xxl={2}
                                                    >
                                                        <Image
                                                            preview={false}
                                                            height={90}
                                                            src={item.image}
                                                        />
                                                    </Col>
                                                    <Col
                                                        xs={24}
                                                        sm={20}
                                                        lg={20}
                                                        xxl={20}
                                                    >
                                                        <Meta
                                                            title={item.title}
                                                            description={new Date(
                                                                item.date
                                                            ).toLocaleDateString(
                                                                "ru-RU",
                                                                {
                                                                    day: "numeric",
                                                                    month: "long",
                                                                    year: "numeric",
                                                                }
                                                            )}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </Link>
                                    </List.Item>
                                )}
                            ></List>
                        </ConfigProvider>
                    </Col>
                )}
            </Row>

            {currentUser && (
                <FloatButton.Group style={{ right: 32 }}>
                    <FloatButton
                        onClick={() => router.push(`${pathname}/edit`)}
                        icon={<SettingOutlined />}
                    />
                    <FloatButton.BackTop />
                </FloatButton.Group>
            )}
        </div>
    ) : (
        <Flex
            gap={10}
            justify="center"
            align="center"
            className="flex-column height-100"
        >
            <EmptyView text="Такого пользователя не существует" />

            <Button
                style={{ fontWeight: 700 }}
                type="link"
                icon={<LongRightArrow />}
                iconPosition="end"
            >
                Вернуться на главную
            </Button>
        </Flex>
    );
}
