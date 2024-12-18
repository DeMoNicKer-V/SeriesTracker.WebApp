"use client";
import React, { useEffect, useState } from "react";
import { MailOutlined, KeyOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import {
    Button,
    Card,
    Flex,
    Form,
    Input,
    Space,
    Typography,
    Divider,
    ConfigProvider,
} from "antd";
import { login, LoginRequest } from "../services/user";
import Link from "next/link";
import { IsAuth } from "../api/coockie";
import { EmptyView } from "../components/EmptyView";
import { LongRightArrow } from "../img/LongRightArrow";
import { LogoIcon } from "../img/LogoIcon";
import "./style.css";

const LoginPage = () => {
    const router = useRouter();
    const [form] = Form.useForm();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [auth, setAuth] = useState<boolean>(false);

    const getIsAuth = async () => {
        const a = await IsAuth();
        setAuth(a);
    };
    useEffect(() => {
        getIsAuth();
    }, []);

    const loginUser = async (values: LoginRequest) => {
        setErrorMessage("");
        const response = await login(values);
        if (response) {
            setErrorMessage(response);
        } else {
            router.back();
        }
    };
    const loginFailed = async () => {
        setErrorMessage("Эл. почта и пароль обязательны для входа");
    };

    return auth === false ? (
        <Flex
            className="flex-column width-height-100"
            align="center"
            style={{
                padding: 24,
            }}
        >
            <ConfigProvider
                theme={{
                    components: {
                        Collapse: {
                            contentPadding: 0,
                            headerPadding: "0 0 24px 0",
                            boxShadow: "none !important",
                        },
                        Typography: {
                            colorLink: "#44a5a6",
                            colorLinkHover: "#44a5a661",
                            fontSize: 16,
                        },
                        Card: {
                            colorBgContainer: "#0b3c3c61",
                            colorBorderSecondary: "#0b3c3c",
                        },
                        Input: {
                            activeBg: "transparent",
                            colorBgContainer: "transparent",
                            fontSize: 16,
                            colorBorder: "#084949",
                        },
                        Form: {
                            labelFontSize: 16,
                            labelColor: "#44a5a6",
                            labelRequiredMarkColor: "#44a5a6",
                            colorSuccess: "#44a5a6",
                        },
                    },
                }}
            >
                <Flex
                    className="width-100 head"
                    align="center"
                    justify="space-around"
                >
                    <Button
                        style={{ cursor: "pointer" }}
                        href="/shikimori"
                        type="link"
                        icon={
                            <LogoIcon
                                width={50}
                                height={50}
                                firstColor="white"
                                secondColor="#44a5a6"
                            />
                        }
                    />

                    <Space size={[5, 5]}>
                        <Typography.Text>Еще нет акканута?</Typography.Text>
                        <Link
                            target="_top"
                            href={"/signup"}
                            style={{
                                fontWeight: 700,
                            }}
                        >
                            <Flex gap={5} justify="center" align="center">
                                Регистрация
                                <LongRightArrow />
                            </Flex>
                        </Link>
                    </Space>
                </Flex>

                <Flex align="center" className="flex-column width-100 headline">
                    <Typography.Title level={4}>
                        Вход на{" "}
                        <Typography.Link style={{ fontSize: 20 }}>
                            @SeriesTracker
                        </Typography.Link>
                    </Typography.Title>

                    <Card
                        className="width-100"
                        style={{
                            padding: 24,
                            textAlign: "center",
                            cursor: "default",
                        }}
                    >
                        <Form
                            onFinishFailed={loginFailed}
                            onFinish={loginUser}
                            layout="vertical"
                            form={form}
                            name="loginForm"
                            style={{ width: "100%" }}
                            initialValues={{ items: [{}] }}
                        >
                            <Form.Item
                                name={["email"]}
                                label="Эл. почта"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Вы не можете войти без эл. почты",
                                    },
                                    {
                                        type: "email",
                                        message: "Эл. почта неккоректна",
                                    },
                                ]}
                            >
                                <Input
                                    autoComplete={"email"}
                                    addonBefore={<MailOutlined />}
                                    autoFocus
                                    spellCheck={false}
                                />
                            </Form.Item>

                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Вы не можете войти без пароля",
                                    },
                                ]}
                                name={["password"]}
                                label="Пароль"
                            >
                                <Input.Password
                                    autoComplete={"current-password"}
                                    addonBefore={<KeyOutlined />}
                                    autoFocus
                                    spellCheck={false}
                                />
                            </Form.Item>
                            <Form.Item
                                style={{ marginTop: -5, marginBottom: -10 }}
                                shouldUpdate
                            >
                                {() => (
                                    <Typography.Text
                                        strong
                                        type="danger"
                                        style={{
                                            opacity: 0.8,
                                        }}
                                    >
                                        {errorMessage}
                                    </Typography.Text>
                                )}
                            </Form.Item>

                            <Divider />
                            <Form.Item>
                                <Button
                                    ghost
                                    block
                                    type="primary"
                                    htmlType="submit"
                                >
                                    Войти
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Flex>
            </ConfigProvider>
        </Flex>
    ) : (
        <Flex
            gap={10}
            justify="center"
            align="center"
            className="flex-column height-100"
        >
            <EmptyView text="Вы уже вошли в свой аккаунт" />
            <Link href={"/shikimori"}>Вернуться на главную</Link>
        </Flex>
    );
};

export default LoginPage;
