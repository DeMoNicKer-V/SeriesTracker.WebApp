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
} from "antd";
import { login, LoginRequest } from "../services/user";
import Link from "next/link";
import { IsAuth } from "../api/coockie";

const LoginPage = () => {
    const router = useRouter();
    const [form] = Form.useForm();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [auth, setAuth] = useState<boolean>(false);

    const getIsAuth = async () => {
        const a = await IsAuth();
        setAuth(a);
    };
    useEffect(() => {
        getIsAuth();
    }, []);

    if (auth) {
        router.back();
    }
    const loginUser = async () => {
        setErrorMessage("");
        let user: LoginRequest = {
            email: email,
            password: password,
        };
        const response = await login(user);
        if (response) {
            setErrorMessage(response);
        } else {
            router.back();
        }
    };
    const finishFailed = async () => {
        setErrorMessage("Эл. почта и пароль обязательны для входа");
    };
    return (
        <Flex
            style={{
                flex: "auto",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Flex
                style={{
                    flex: "auto",
                    paddingTop: "128px",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "450px",
                    maxWidth: "450px",
                    gap: 30,
                }}
            >
                <Typography.Title level={4}>
                    Войти на Series Tracker Web
                </Typography.Title>
                <Typography.Text type="danger">{errorMessage}</Typography.Text>
                <Card
                    hoverable
                    style={{ width: "100%", padding: 24, cursor: "default" }}
                >
                    <Form
                        onFinishFailed={finishFailed}
                        scrollToFirstError
                        onFinish={loginUser}
                        layout="vertical"
                        form={form}
                        name="requiredForm"
                        style={{ width: "100%" }}
                        initialValues={{ items: [{}] }}
                    >
                        <Form.Item
                            name={["email"]}
                            label="Эл. почта"
                            rules={[
                                {
                                    required: true,
                                    message: "Вы не можете войти без эл. почты",
                                },
                                {
                                    type: "email",
                                    message: "Эл. почта неккоректна",
                                },
                            ]}
                        >
                            <Input
                                addonBefore={<MailOutlined />}
                                onChange={(e: {
                                    target: {
                                        value: any;
                                    };
                                }) => {
                                    setEmail(e.target.value);
                                }}
                                autoFocus
                                spellCheck={false}
                            />
                        </Form.Item>

                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: "Вы не можете войти без пароля",
                                },
                            ]}
                            name={["password"]}
                            label="Пароль"
                        >
                            <Input.Password
                                addonBefore={<KeyOutlined />}
                                onChange={(e: {
                                    target: {
                                        value: any;
                                    };
                                }) => {
                                    setPassword(e.target.value);
                                }}
                                autoFocus
                                spellCheck={false}
                            />
                        </Form.Item>
                        <Divider />
                        <Form.Item>
                            <Button block type="primary" htmlType="submit">
                                Войти в систему
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
                <Space wrap size={[5, 5]}>
                    <Typography.Text>Еще нет акканута?</Typography.Text>
                    <Link
                        href={"./"}
                        style={{
                            fontWeight: 700,
                        }}
                    >
                        Регистрация
                    </Link>
                </Space>
            </Flex>
        </Flex>
    );
};

export default LoginPage;
