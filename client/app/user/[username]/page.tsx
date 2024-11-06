"use client";
import {
    Avatar,
    Button,
    Card,
    Col,
    Divider,
    Flex,
    FloatButton,
    Image,
    Row,
    Space,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import { useEffect, useState } from "react";
import { getUserByUserName, MainUserInfo } from "../../services/user";
import Meta from "antd/es/card/Meta";
import {
    EditOutlined,
    QuestionCircleOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
    AnimeInfo,
    getAnimeById,
    getAnimesById,
    LastActivityAnime,
} from "@/app/services/shikimori";
import { IsCurrentUser } from "@/app/api/coockie";
export default function UserPage({ params }: { params: { username: string } }) {
    const router = useRouter();
    const [error, setError] = useState<boolean>(false);
    const pathname = usePathname();
    const [userInfo, setUserInfo] = useState<MainUserInfo>();
    const [animes, setAnimes] = useState<LastActivityAnime[]>();
    const { Text, Title } = Typography;
    const getCurrentUser = async () => {
        setError(await IsCurrentUser(params.username));
        const currentUser = await getUserByUserName(params.username);
        setUserInfo(currentUser);
        if (currentUser.activityInfo.length > 0) {
            const animes = await getAnimesById(
                currentUser.activityInfo.join(",")
            );
            setAnimes(animes);
        }
    };

    useEffect(() => {
        return () => {
            getCurrentUser();
        };
    }, []);
    const getFormatedAge = (age: number) => {
        if (age % 10 === 1 && age % 100 !== 11) {
            return ` / ${age} год`;
        } else if (
            age % 10 >= 2 &&
            age % 10 <= 4 &&
            (age % 100 < 12 || age % 100 > 14)
        ) {
            return ` / ${age} года`;
        } else {
            return ` / ${age} лет`;
        }
    };
    const handleNavigate = (mylist: number) => {
        router.push(`${pathname}/list?mylist=${mylist}`);
    };
    return (
        <div className="container">
            <title>{`${params.username} / Профиль`}</title>
            <Row gutter={[15, 15]} align={"top"} justify={"center"}>
                <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
                    <Row
                        className="profile-header"
                        gutter={[15, 15]}
                        align={"middle"}
                    >
                        <Col>
                            <Avatar
                                size={100}
                                src={userInfo?.userInfo?.avatar}
                                shape="square"
                            ></Avatar>
                        </Col>
                        <Col>
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
                                    <Flex gap={5}>
                                        <Text>
                                            {userInfo?.userInfo.surName}
                                        </Text>
                                        <Text>{userInfo?.userInfo.name}</Text>
                                        {userInfo?.userInfo.yearsOld > 0 && (
                                            <Text>
                                                {getFormatedAge(
                                                    userInfo?.userInfo.yearsOld
                                                )}
                                            </Text>
                                        )}
                                        <Text>{`/ на сайте с`}</Text>
                                        <Tooltip
                                            title={new Date(
                                                userInfo?.userInfo?.regDate
                                            ).toLocaleDateString("ru-RU", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        >
                                            <Text>
                                                {`${new Date(
                                                    userInfo?.userInfo?.regDate
                                                ).getFullYear()} г.`}
                                            </Text>
                                        </Tooltip>
                                    </Flex>
                                }
                            />
                        </Col>
                    </Row>
                </Col>
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
                <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                    <Title level={4}>
                        <Link href={`${userInfo?.userInfo.userName}/list`}>
                            Последняя активность
                        </Link>
                    </Title>
                    <Divider />
                </Col>
                {animes && (
                    <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                        {animes.map((item) => (
                            <Link href={`/shikimori/${item.id}`}>
                                <Card
                                    style={{
                                        padding: 12,
                                        marginBottom: 8,
                                    }}
                                    hoverable
                                >
                                    <Row
                                        gutter={[15, 15]}
                                        className="related-anime"
                                        align={"middle"}
                                        justify={"start"}
                                    >
                                        <Col>
                                            <Image
                                                preview={false}
                                                height={90}
                                                src={item.image}
                                            />
                                        </Col>
                                        <Col>
                                            <Meta
                                                style={{
                                                    padding: 0,
                                                    marginBottom: 8,
                                                    whiteSpace: "break-spaces",
                                                }}
                                                title={item.title}
                                                description={new Date(
                                                    item.date
                                                ).toLocaleDateString("ru-RU", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            </Link>
                        ))}
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
