"use client";
import styles from "./page.module.css";
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
import {
    defaultUserValues,
    getUserByUserName,
    MainUserInfo,
} from "../../services/user";
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
import SeriesGroupInfo from "@/app/components/SeriesGroupInfo";
dayjs.locale("ru");
dayjs.extend(relativeTime);

export default function UserPage({ params }: { params: { username: string } }) {
    const router = useRouter();
    const [error, setError] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<boolean>(false);
    const pathname = usePathname();
    const [userInfo, setUserInfo] = useState<MainUserInfo>(defaultUserValues);
    const [animes, setAnimes] = useState<LastActivityAnime[]>();
    const { Text, Title, Paragraph } = Typography;

    const getCurrentUser = async (username: string) => {
        const user = await getUserByUserName(username);
        if (!user) {
            return;
        }
        setError(true);
        setCurrentUser(await IsCurrentUser(username));
        setUserInfo(user);
        if (user.seriesIDS.length > 0) {
            const animes = await getAnimesById(username, user.seriesIDS);
            setAnimes(animes);
        }
    };

    const { isLoading } = useSWR(params.username, getCurrentUser, {
        // Опции для useSWR
        revalidateOnFocus: false, // Отключить обновление при фокусе
        revalidateOnReconnect: false, // Отключить обновление при восстановлении соединения
    });
    const getFormatedAge = (dateBirth?: string) => {
        if (!dateBirth) {
            return null;
        } else return dayjs(dateBirth).fromNow(true);
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
                    <Card style={{ padding: 12 }}>
                        <Row className={styles["header-user-info"]}>
                            <Col span={24}>
                                <Row align={"middle"} gutter={[0, 0]}>
                                    <Col>
                                        <Avatar
                                            style={{
                                                backgroundColor: "transparent",
                                            }}
                                            icon={<UserOutlined />}
                                            size={100}
                                            src={
                                                userInfo?.avatar
                                                    ? userInfo?.avatar
                                                    : null
                                            }
                                            shape="circle"
                                        ></Avatar>
                                    </Col>
                                    <Col>
                                        <Divider
                                            className={
                                                styles["username-divider"]
                                            }
                                        >
                                            <Flex align="baseline">
                                                <Title level={3}>
                                                    {userInfo?.userName}
                                                </Title>
                                                {userInfo?.roleId === 1 && (
                                                    <Tooltip title="Админ">
                                                        <Button
                                                            style={{
                                                                fontSize: 18,
                                                            }}
                                                            color="gold"
                                                            variant="link"
                                                            icon={
                                                                <CrownOutlined />
                                                            }
                                                        />
                                                    </Tooltip>
                                                )}
                                            </Flex>
                                        </Divider>

                                        <Paragraph>
                                            {userInfo?.name}
                                            {userInfo?.surName}
                                            <Divider type="vertical" />
                                            {getFormatedAge(
                                                userInfo?.dateBirth
                                            )}
                                            <Divider type="vertical" />
                                            {`на сайте с`}{" "}
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
                                                        userInfo.regDate
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
                                                        userInfo.regDate
                                                    ).getFullYear()} г.`}
                                                </Tooltip>
                                            </Text>
                                        </Paragraph>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                {userInfo.seriesGroup.length > 0 ? (
                    <SeriesGroupInfo
                        items={userInfo.seriesGroup}
                        username={userInfo.userName}
                    />
                ) : (
                    <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                        <EmptyView text="Пользователь еще ничего не добавил" />
                    </Col>
                )}
                {userInfo.seriesGroup.length > 0 && (
                    <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                        <Title level={4}>
                            <Link href={`${userInfo?.userName}/list`}>
                                Последняя активность
                            </Link>
                        </Title>
                        <Divider />
                        <ConfigProvider
                            renderEmpty={customizeRenderEmpty}
                            theme={{
                                components: {
                                    Card: {
                                        bodyPadding: 12,
                                    },
                                },
                            }}
                        >
                            <List
                                loading={{
                                    spinning: isLoading,
                                    size: "large",
                                }}
                                dataSource={animes}
                                renderItem={(item: LastActivityAnime) => (
                                    <List.Item style={{ display: "block" }}>
                                        <Link href={`/shikimori/${item.id}`}>
                                            <Card hoverable>
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
                href="/shikimori"
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
