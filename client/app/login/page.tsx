"use client";
import { KeyOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Flex, Form, Input, Typography } from "antd";
import { useState } from "react";
import { login } from "../api/auth";
import ConditionalContent from "../components/ConditionalContent";
import PageErrorView from "../components/PageErrorVIew";
import SignFormHeader from "../components/SignFormHeader";
import SignPageConfigProvider from "../components/SignPageConfigProvider";
import { useUser } from "../components/UserContext";
import { LoginRequest } from "../models/user/requests/LoginRequest";
import "./style.css";

const { Text, Title, Link } = Typography;

//  Основной компонент LoginPage (страница логина)
const LoginPage = () => {
    //  Получаем информацию о текущем пользователе из контекста
    const { user } = useUser();

    //  Получаем экземпляр Form (из Ant Design) для управления формой
    const [form] = Form.useForm();

    //  Состояние для отображения сообщения об ошибке
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    //  Асинхронная функция для обработки логина пользователя
    const loginUser = async (values: LoginRequest) => {
        setErrorMessage(null); //  Сбрасываем сообщение об ошибке перед отправкой

        try {
            await login(values); //  Вызываем функцию логина (из api/auth)
            window.location.href = "/animes"; //  Перенаправляем пользователя на главную страницу
        } catch (error: any) {
            setErrorMessage(error.message);
        }
    };

    //  Функция для обработки ошибок валидации формы (Ant Design)
    const loginFailed = async (values: any) => {
        setErrorMessage(values.errorFields[0].errors); //  Устанавливаем сообщение об ошибке на основе ошибок валидации
    };

    return (
        <ConditionalContent
            condition={user === null ? null : user != null}
            onErrorNode={<PageErrorView text="Вы уже вошли в свой аккаунт" />}
        >
            <Flex className="bg flex-column">
                <title>Series Tracker - Регистрация</title>
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
            </Flex>
        </ConditionalContent>
    );
};

export default LoginPage;
