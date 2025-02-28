"use client";
import React, { useEffect, useState } from "react";
import { MailOutlined, KeyOutlined } from "@ant-design/icons";
import {
    Button,
    Card,
    Flex,
    Form,
    Input,
    Space,
    Typography,
    Divider,
} from "antd";
import { login, LoginRequest } from "../services/user";

import { IsAuth } from "../api/coockie";
import { LongRightArrow } from "../img/LongRightArrow";
import { LogoIcon } from "../img/LogoIcon";
import "./style.css";
import SignPageConfigProvider from "../components/SignPageConfigProvider";
import PageErrorView from "../components/PageErrorVIew";

const { Text, Title, Link } = Typography;
const LoginPage = () => {
    const [form] = Form.useForm();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [auth, setAuth] = useState<boolean>(false);

    const getIsAuth = async () => {
        const status = await IsAuth();
        setAuth(status);
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
            window.location.href = "/shikimori";
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
            <title>Series Tracker - Вход</title>
            <SignPageConfigProvider>
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
                        <Text type="secondary" italic>
                            Еще нет акканута?
                        </Text>
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
                    <Title level={4}>
                        Вход на{" "}
                        <Link style={{ fontSize: 20 }}>@SeriesTracker</Link>
                    </Title>

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
                                    <Text
                                        strong
                                        type="danger"
                                        style={{
                                            opacity: 0.8,
                                        }}
                                    >
                                        {errorMessage}
                                    </Text>
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
            </SignPageConfigProvider>
        </Flex>
    ) : (
        <PageErrorView text="Вы уже вошли в свой аккаунт" />
    );
};

export default LoginPage;
