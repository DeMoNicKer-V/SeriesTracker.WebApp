"use client";
import { GetRecentUserActivities } from "@/app/api/animes/getAnime";
import { getUserByUsername } from "@/app/api/user/getUser";
import { EmptyView } from "@/app/components/EmptyView";
import LoadingContentHandler from "@/app/components/LoadingContentHandler";
import MainShortInfo from "@/app/components/MainShortInfo/MainShortInfo";
import PageErrorView from "@/app/components/PageErrorVIew";
import SeriesGroupInfo from "@/app/components/SeriesGroupInfo";
import { useUser } from "@/app/components/UserContext";
import { SeriesAnime } from "@/app/models/anime/SeriesAnime";
import {
    defaultUserValues,
    MainUserInfo,
} from "@/app/models/user/MainUserInfo";
import {
    CrownOutlined,
    SettingOutlined,
    UserOutlined,
} from "@ant-design/icons";
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
import dayjs from "dayjs";
import "dayjs/locale/ru";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import styles from "./page.module.css";
dayjs.locale("ru");
dayjs.extend(relativeTime);

const { Text, Title, Paragraph } = Typography;

//  Основной компонент UserListPage (страница пользовательского профиля)
export default function UserPage({ params }: { params: { username: string } }) {
    //  Хук для навигации (получаем экземпляр роутера)
    const router = useRouter();

    //  Хук для получения текущего пути
    const pathname = usePathname();

    //  Получаем информацию о текущем пользователе из контекста
    const { user } = useUser();

    //  Состояние для отображения ошибок
    const [error, setError] = useState<boolean | null>(null);

    //  Состояние для хранения информации о пользователе (полученной с сервера)
    const [userInfo, setUserInfo] = useState<MainUserInfo>(defaultUserValues);

    //  Состояние для хранения списка аниме, связанных с пользователем
    const [animes, setAnimes] = useState<SeriesAnime[]>();

    //  Состояние, указывающее, является ли просматриваемый профиль профилем текущего пользователя
    const [currentUser, setCurrentUser] = useState<boolean>(false);

    //  Асинхронная функция для получения данных о пользователе
    const getCurrentUser = async (username: string) => {
        try {
            //  Проверяем, является ли просматриваемый профиль профилем текущего пользователя
            setCurrentUser(user?.userName === username);

            //  Получаем информацию о пользователе по имени пользователя
            const mainUserInfo = await getUserByUsername(username);

            //  Обновляем состояние с информацией о пользователе
            setUserInfo(mainUserInfo);

            //  Сбрасываем флаг ошибки
            setError(false);

            //  Если у пользователя есть какие-либо аниме в списке, получаем информацию об этих аниме
            if (mainUserInfo.seriesIDS.length > 0) {
                const animes = await GetRecentUserActivities(
                    username,
                    mainUserInfo.seriesIDS
                );
                //  Обновляем состояние со списком аниме
                setAnimes(animes);
            }
        } catch (error) {
            //  Обрабатываем ошибки при получении данных
            setError(true);
            return;
        }
    };

    //  Используем useSWR для управления запросом к API
    const { isLoading } = useSWR(params.username, getCurrentUser, {
        //  Отключаем автоматическую перепроверку при фокусе
        revalidateOnFocus: false,
        //  Отключаем автоматическую перепроверку при переподключении к сети
        revalidateOnReconnect: false,
        //  Устанавливаем количество попыток перезагрузки в случае ошибки на 0
        errorRetryCount: 0,
    });

    //  Функция для форматирования возраста пользователя
    const getFormatedAge = (dateBirth?: string) => {
        //  Проверяем, указана ли дата рождения
        if (!dateBirth) {
            return null; //  Если нет, возвращаем null
        } else
            return (
                <>
                    {/*  Отображаем возраст пользователя в формате "X (год|года|лет) назад" */}
                    {dayjs(dateBirth).fromNow(true)} <Divider type="vertical" />
                </>
            );
    };

    //  Функция для форматирования имени пользователя
    const getFormatedName = (name?: string, surName?: string) => {
        //  Используем name, если есть, иначе пустую строку
        const formattedName = name ? name : "";
        //  Используем surName, если есть, иначе пустую строку
        const formattedSurName = surName ? surName : "";

        //  Если есть имя или фамилия
        if (formattedName || formattedSurName) {
            return (
                <>
                    {/*  Отображаем имя и фамилию пользователя */}
                    {formattedName} {formattedSurName}
                    <Divider type="vertical" />
                </>
            );
        }
    };

    return (
        <LoadingContentHandler
            condition={error}
            defaultNode={
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
                                                        styles[
                                                            "username-divider"
                                                        ]
                                                    }
                                                >
                                                    <Flex align="baseline">
                                                        <Title level={3}>
                                                            {userInfo?.userName}
                                                        </Title>
                                                        {userInfo?.roleId ===
                                                            1 && (
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

                                                <Paragraph
                                                    style={{ fontSize: 16 }}
                                                >
                                                    {getFormatedName(
                                                        userInfo.name,
                                                        userInfo.surName
                                                    )}
                                                    {getFormatedAge(
                                                        userInfo?.dateBirth
                                                    )}
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
                                            <List.Item
                                                style={{ display: "block" }}
                                            >
                                                <Link
                                                    href={`/animes/${item.id}`}
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
                                                                    preview={
                                                                        false
                                                                    }
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
            }
            onErrorNode={
                <PageErrorView text="Такого пользователя не существует" />
            }
        />
    );
}
