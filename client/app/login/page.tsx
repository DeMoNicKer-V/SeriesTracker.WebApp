"use client";
import "./style.css";
import React, { useEffect, useState } from "react";
import { MailOutlined, KeyOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Form, Input, Typography, Divider } from "antd";
import SignPageConfigProvider from "../components/SignPageConfigProvider";
import PageErrorView from "../components/PageErrorVIew";
import SignFormHeader from "../components/SignFormHeader";
import { LoginRequest } from "../Models/User/Requests/LoginRequest";
import { login } from "../api/auth";
import { getDecodedUserToken } from "../utils/cookie";

const { Text, Title, Link } = Typography;
const LoginPage = () => {
    const [form] = Form.useForm();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [auth, setAuth] = useState<boolean | null>(null);

    const getIsAuth = async () => {
        const status = await getDecodedUserToken();
        setAuth(status !== null);
    };
    useEffect(() => {
        getIsAuth();
    }, []);

    const loginUser = async (values: LoginRequest) => {
        setErrorMessage(null); // Сбрасываем сообщение об ошибке перед отправкой

        try {
            await login(values); // Вызываем login и ждем результат
            window.location.href = "/shikimori"; // Перенаправляем при успехе
        } catch (error: any) {
            // Перехватываем ошибку, выброшенную login
            setErrorMessage(error.message || "Произошла неизвестная ошибка."); // Отображаем сообщение об ошибке
        }
    };

    const loginFailed = async (values: any) => {
        setErrorMessage(values.errorFields[0].errors);
    };

    return (
        <Flex className="bg flex-column">
            <title>Series Tracker - Вход</title>
            {auth === false && (
                <SignPageConfigProvider>
                    <SignFormHeader
                        text="Ещё нет аккаунта?"
                        actionText="Регистрация"
                        href="/signup"
                    />

                    <Flex
                        align="center"
                        className="flex-column width-100 headline"
                    >
                        <Title level={4}>
                            Вход на{" "}
                            <Link style={{ fontSize: 20 }}>@SeriesTracker</Link>
                        </Title>

                        <Card
                            className="width-100"
                            style={{
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
                                    validateFirst
                                    help={false}
                                    name={["email"]}
                                    label="Эл. почта"
                                    rules={[
                                        {
                                            type: "email",
                                            message: "Эл. почта неккоректна",
                                        },
                                        {
                                            required: true,
                                            message:
                                                "Вы не можете войти без эл. почты",
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
                                    validateFirst
                                    help={false}
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
                                        spellCheck={false}
                                    />
                                </Form.Item>
                                <Form.Item shouldUpdate>
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
            )}
            {auth === true && (
                <PageErrorView text="Вы уже вошли в свой аккаунт" />
            )}
        </Flex>
    );
};

export default LoginPage;
