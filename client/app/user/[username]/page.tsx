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
import { useEffect, useState } from "react";
import { getUserByUserName, MainUserInfo } from "../../services/user";
import Meta from "antd/es/card/Meta";
import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { getAnimesById, LastActivityAnime } from "@/app/services/shikimori";
import { IsCurrentUser } from "@/app/api/coockie";
import { EmptyView } from "@/app/components/EmptyView";
import useSWR from "swr";
export default function UserPage({ params }: { params: { username: string } }) {
    const router = useRouter();
    const [error, setError] = useState<boolean>(false);
    const pathname = usePathname();
    const [userInfo, setUserInfo] = useState<MainUserInfo>();
    const [animes, setAnimes] = useState<LastActivityAnime[]>();
    const { Text, Title } = Typography;

    const getCurrentUser = async (username: string) => {
        setError(await IsCurrentUser(username));
        const currentUser = await getUserByUserName(username);
        setUserInfo(currentUser);
        if (currentUser.activityInfo.length > 0) {
            const animes = await getAnimesById(
                currentUser.activityInfo.join(",")
            );
            setAnimes(animes);
        }
    };

    const { data = [], isLoading } = useSWR(params.username, getCurrentUser, {
        // Опции для useSWR
        revalidateOnFocus: false, // Отключить обновление при фокусе
        revalidateOnReconnect: false, // Отключить обновление при восстановлении соединения
    });
    const getFormatedAge = (age: number) => {
        if (age % 10 === 1 && age % 100 !== 11) {
            return `${age} год`;
        } else if (
            age % 10 >= 2 &&
            age % 10 <= 4 &&
            (age % 100 < 12 || age % 100 > 14)
        ) {
            return `${age} года`;
        } else {
            return `${age} лет`;
        }
    };
    const { Meta } = Card;
    const customizeRenderEmpty = () => (
        <EmptyView text="Пользователь еще ничего не добавил" />
    );
    return (
        <div className="container">
            <title>{`${params.username} / Профиль`}</title>
            <Row gutter={[15, 15]} align={"top"} justify={"center"}>
                <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
                    <Row gutter={[15, 15]} align={"middle"}>
                        <Card
                            className="profile-header"
                            style={{
                                display: "flex",
                                width: "100%",
                                alignItems: "center",
                                padding: 12,
                                gap: 10,
                            }}
                            bordered
                            cover={
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
                                    shape="square"
                                ></Avatar>
                            }
                        >
                            <Meta
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
                                        {userInfo?.userInfo.userName}
                                    </Title>
                                }
                                description={
                                    <Flex
                                        gap={5}
                                        justify="center"
                                        align="center"
                                    >
                                        <Text>{userInfo?.userInfo.name}</Text>
                                        <Text>
                                            {userInfo?.userInfo.surName}
                                        </Text>

                                        <Divider type="vertical" />
                                        {userInfo?.userInfo.yearsOld && (
                                            <Text>
                                                {getFormatedAge(
                                                    userInfo?.userInfo.yearsOld
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
                        </Card>
                    </Row>
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
                                                className="related-anime"
                                                cover={
                                                    <Image
                                                        preview={false}
                                                        height={90}
                                                        src={item.image}
                                                    />
                                                }
                                                style={{
                                                    alignItems: "center",
                                                    gap: 10,
                                                    display: "flex",
                                                    padding: 12,
                                                    marginBottom: 8,
                                                }}
                                                hoverable
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
                                            </Card>
                                        </Link>
                                    </List.Item>
                                )}
                            ></List>
                        </ConfigProvider>
                    </Col>
                )}
            </Row>

            {error && (
                <FloatButton.Group style={{ right: 32 }}>
                    <FloatButton
                        onClick={() => router.push(`${pathname}/edit`)}
                        icon={<SettingOutlined />}
                    />
                    <FloatButton.BackTop />
                </FloatButton.Group>
            )}
        </div>
    );
}
