"use client";
import "./style.css";
import React, { useEffect, useState } from "react";
import { MailOutlined, KeyOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Form, Input, Typography, Divider } from "antd";
import { login, LoginRequest } from "../services/user";

import { IsAuth } from "../api/coockie";

import SignPageConfigProvider from "../components/SignPageConfigProvider";
import PageErrorView from "../components/PageErrorVIew";
import SignFormHeader from "../components/SignFormHeader";

const { Text, Title, Link } = Typography;
const LoginPage = () => {
    const [form] = Form.useForm();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [auth, setAuth] = useState<boolean | null>(null);

    const getIsAuth = async () => {
        const status = await IsAuth();
        setAuth(status);
    };
    useEffect(() => {
        getIsAuth();
    }, []);

    const loginUser = async (values: LoginRequest) => {
        setErrorMessage(null); // Сбрасываем сообщение об ошибке перед отправкой

        const error = await login(values); // Получаем сообщение об ошибке или undefined при успехе
        if (error) {
            setErrorMessage(error); // Отображаем сообщение об ошибке
        } else {
            window.location.href = "/shikimori";
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
