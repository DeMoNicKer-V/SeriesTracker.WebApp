"use client";
import {
    Avatar,
    Button,
    Col,
    Divider,
    Flex,
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
import { QuestionCircleOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
    AnimeInfo,
    getAnimeById,
    getAnimesById,
    LastActivityAnime,
} from "@/app/services/shikimori";
const { Text, Title } = Typography;
export default function UserPage({ params }: { params: { username: string } }) {
    const router = useRouter();
    const pathname = usePathname();
    const [userInfo, setUserInfo] = useState<MainUserInfo>();
    const [animes, setAnimes] = useState<LastActivityAnime[]>();
    const { Text, Title } = Typography;
    const getCurrentUser = async () => {
        const currentUser = await getUserByUserName(params.username);
        setUserInfo(currentUser);
        if (currentUser.activityInfo.length > 0) {
            const animes = await getAnimesById(
                currentUser.activityInfo.join(",")
            );
            console.log(animes);
            setAnimes(animes);
        }
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
                <Col span={12}>
                    <Space wrap>
                        <Avatar
                            size={100}
                            src={userInfo?.userInfo?.avatar}
                            shape="square"
                        ></Avatar>

                        <Meta
                            title={
                                <Title level={3}>
                                    {userInfo?.userInfo?.userName}
                                </Title>
                            }
                            description={
                                <Flex align="center" justify="center" gap={5}>
                                    <Text>
                                        {userInfo?.userInfo?.surName}
                                        {userInfo?.userInfo?.name}
                                    </Text>
                                    {userInfo?.userInfo.yearsOld > 0 && (
                                        <Text>
                                            возраст:
                                            {userInfo?.userInfo?.yearsOld}
                                        </Text>
                                    )}
                                    <Text>
                                        {` сайте с: ${new Date(
                                            userInfo?.userInfo?.regDate
                                        ).getFullYear()} г.`}

                                        <Tooltip
                                            title={new Date(
                                                userInfo?.userInfo?.regDate
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
                    <Title level={4}>
                        <Link href={`${userInfo?.userInfo.userName}/list`}>
                            Список аниме
                        </Link>
                    </Title>
                    <Divider />
                    <Row>
                        {userInfo?.seriesInfo.map((item) => (
                            <Tooltip
                                color={item.categoryColor}
                                title={item.categoryName}
                            >
                                <Col
                                    flex={item.seriesCount}
                                    style={{
                                        backgroundColor: item.categoryColor,
                                        textAlign: "center",
                                    }}
                                >
                                    {item.seriesCount}
                                </Col>
                            </Tooltip>
                        ))}
                    </Row>
                    <Row gutter={[25, 25]} justify={"center"}>
                        {userInfo?.seriesInfo.map((item) => (
                            <Col>
                                <Flex style={{ flexDirection: "column" }}>
                                    <Link
                                        className="title-link"
                                        href={`${userInfo?.userInfo.userName}/list`}
                                    >
                                        {`${item.categoryName} (${item.seriesCount})`}
                                    </Link>
                                    <Tag
                                        style={{ padding: 0, margin: 0 }}
                                        color={item.categoryColor}
                                    ></Tag>
                                </Flex>
                            </Col>
                        ))}
                    </Row>
                </Col>
                <Col offset={1} span={6}>
                    <Title level={4}>
                        <Link href={`${userInfo?.userInfo.userName}/list`}>
                            Последняя активность
                        </Link>
                    </Title>
                    <Divider />

                    {animes &&
                        animes.map((item) => (
                            <Row
                                gutter={[15, 15]}
                                style={{ margin: "15px 0" }}
                                justify={"center"}
                            >
                                <Col>
                                    <Image
                                        preview={false}
                                        width={60}
                                        src={item.image}
                                    />
                                </Col>
                                <Col span={16}>
                                    <Title level={5}>
                                        <Link href={`/shikimori/${item.id}`}>
                                            {item.title}{" "}
                                        </Link>
                                    </Title>

                                    <Text>
                                        {new Date(item.date).toLocaleDateString(
                                            "ru-RU",
                                            {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            }
                                        )}
                                    </Text>
                                </Col>
                            </Row>
                        ))}
                </Col>
            </Row>
        </div>
    );
}
