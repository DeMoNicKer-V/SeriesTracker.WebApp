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
    Tooltip,
    Typography,
} from "antd";
import { useState } from "react";
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

import dayjs from "dayjs";
import "dayjs/locale/ru";
import relativeTime from "dayjs/plugin/relativeTime";
import SeriesGroupInfo from "@/app/components/SeriesGroupInfo";
import PageErrorView from "@/app/components/PageErrorVIew";
import MainShortInfo from "@/app/components/MainShortInfo/MainShortInfo";
import { SeriesAnime } from "@/app/Models/Anime/SeriesAnime";
import {
    defaultUserValues,
    MainUserInfo,
} from "@/app/Models/User/MainUserInfo";
import { getUserByUsername } from "@/app/api/user/getUser";
dayjs.locale("ru");
dayjs.extend(relativeTime);

export default function UserPage({ params }: { params: { username: string } }) {
    const router = useRouter();
    const [error, setError] = useState<boolean | null>(null);
    const [currentUser, setCurrentUser] = useState<boolean>(false);
    const pathname = usePathname();
    const [userInfo, setUserInfo] = useState<MainUserInfo>(defaultUserValues);
    const [animes, setAnimes] = useState<SeriesAnime[]>();
    const { Text, Title, Paragraph } = Typography;

    const getCurrentUser = async (username: string) => {
        const user = await getUserByUsername(username);
        if (!user) {
            setError(true);
            return;
        }
        setError(false);
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

    return (
        <div className="container">
            <title>{`${params.username} / Профиль`}</title>
            {error === false && (
                <Row gutter={[15, 15]} align={"top"} justify={"center"}>
                    <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
                        <Card style={{ padding: 12 }}>
                            <Row className={styles["header-user-info"]}>
                                <Col span={24}>
                                    <Row align={"middle"} gutter={[0, 0]}>
                                        <Col>
                                            <Avatar
                                                style={{
                                                    backgroundColor:
                                                        "transparent",
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

                                            <Paragraph style={{ fontSize: 16 }}>
                                                {`${userInfo?.name}${" "}${
                                                    userInfo?.surName
                                                }`}
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
                        <Col
                            style={{ textAlign: "center" }}
                            xs={24}
                            sm={24}
                            md={24}
                            lg={16}
                            xl={16}
                        >
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
                                renderEmpty={() => (
                                    <EmptyView text="Пользователь еще ничего не добавил" />
                                )}
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
                                    renderItem={(item: SeriesAnime) => (
                                        <List.Item style={{ display: "block" }}>
                                            <Link
                                                href={`/shikimori/${item.id}`}
                                            >
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
                                                                src={
                                                                    item.pictureUrl
                                                                }
                                                            />
                                                        </Col>
                                                        <Col
                                                            xs={24}
                                                            sm={20}
                                                            lg={20}
                                                            xxl={20}
                                                        >
                                                            <MainShortInfo
                                                                title={
                                                                    item.title
                                                                }
                                                                subTitle={new Date(
                                                                    item.changedDate
                                                                ).toLocaleDateString(
                                                                    "ru-RU",
                                                                    {
                                                                        day: "numeric",
                                                                        month: "long",
                                                                        year: "numeric",
                                                                        hour: "numeric",
                                                                        minute: "numeric",
                                                                    }
                                                                )}
                                                                showDescription
                                                                descriptionPrefix="Статус:"
                                                                description={
                                                                    item.categoryName
                                                                }
                                                                descriptionColor={
                                                                    item.categoryColor
                                                                }
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
            )}
            {error === true && (
                <PageErrorView text="Такого пользователя не существует" />
            )}
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
    );
}
