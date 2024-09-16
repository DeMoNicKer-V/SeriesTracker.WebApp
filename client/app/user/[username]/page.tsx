"use client";
import { Avatar, Col, Flex, Row, Space, Tooltip, Typography } from "antd";
import { useEffect, useState } from "react";
import {
    DefaultUser,
    getUserById,
    getUserByUserName,
    UserResponse,
} from "../../services/user";
import Meta from "antd/es/card/Meta";
import { QuestionCircleOutlined } from "@ant-design/icons";

export default function UserPage({ params }: { params: { username: string } }) {
    const [user, setUser] = useState<DefaultUser>();
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
                                                style={{ cursor: "help" }}
                                            />
                                        </Tooltip>
                                    </Text>
                                </Flex>
                            }
                        ></Meta>
                    </Space>
                </Col>
            </Row>
        </div>
    );
}
