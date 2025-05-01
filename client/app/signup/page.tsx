"use client";
import { CheckOutlined, UserOutlined } from "@ant-design/icons";
import {
    Avatar,
    Button,
    Card,
    Checkbox,
    CheckboxProps,
    Collapse,
    DatePicker,
    Divider,
    Flex,
    Form,
    Input,
    Typography,
} from "antd";
import { useEffect, useState } from "react";
import "./style.css";

import locale from "antd/es/date-picker/locale/ru_RU";
import PageErrorView from "../components/PageErrorVIew";
import SignFormHeader from "../components/SignFormHeader";
import SignPageConfigProvider from "../components/SignPageConfigProvider";
import MainForm from "../components/SingupComponents/MainForm";
import SecondaryForm from "../components/SingupComponents/SecondaryForm";
import { LongLeftArrow } from "../img/LongLeftArrow";

import dayjs from "dayjs";
import "dayjs/locale/ru";
import { UserRequest } from "../Models/User/Requests/UserRequest";
import { register } from "../api/auth";
import LoadingContentHandler from "../components/LoadingContentHandler";
import { getDecodedUserToken } from "../utils/cookie";
dayjs.locale("ru");

const { Text, Title, Link } = Typography;

const SignupPage = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [current, setCurrent] = useState<number>(0);
    const [formData, setFormData] = useState<UserRequest>({
        email: "",
        password: "",
        userName: "",
    });
    const [auth, setAuth] = useState<boolean | null>(null);
    const [checked, setChecked] = useState(false);

    const [form] = Form.useForm();
    const { getFieldsValue } = form;

    const createNewAccount = async () => {
        setErrorMessage(null); // Сбрасываем сообщение об ошибке перед отправкой

        try {
            await register(formData);
            window.location.href = "/login";
        } catch (error: any) {
            // Перехватываем ошибку, выброшенную login
            setErrorMessage(error.message || "Произошла неизвестная ошибка."); // Отображаем сообщение об ошибке
        }
    };

    const onChangeAgreeRules: CheckboxProps["onChange"] = (e) => {
        setChecked(e.target.checked);
    };

    const handleNext = () => {
        const values = getFieldsValue();
        setFormData((prevFormData) => ({
            ...prevFormData,
            ...values,
        }));
        setCurrent(current + 1);
    };

    const getIsAuth = async () => {
        const token = await getDecodedUserToken();
        setAuth(token !== null);
    };

    useEffect(() => {
        getIsAuth();
    }, []);

    return (
        <LoadingContentHandler
            condition={auth}
            defaultNode={
                <Flex className="bg flex-column">
                    <title>Series Tracker - Регистрация</title>

                    <SignPageConfigProvider>
                        <SignFormHeader
                            text="Уже есть аккаунт?"
                            actionText="Войти"
                            href="/login"
                        />

                        <Flex className="flex-column width-100 form-content">
                            <Title level={4}>
                                Регистрация на{" "}
                                <Link style={{ fontSize: 20 }}>
                                    @SeriesTracker
                                </Link>
                            </Title>
                            <Card className="width-100">
                                {current === 0 && (
                                    <MainForm
                                        form={form}
                                        handleNext={handleNext}
                                    />
                                )}
                                {current === 1 && (
                                    <SecondaryForm
                                        form={form}
                                        handleNext={handleNext}
                                        setCurrent={setCurrent}
                                    />
                                )}
                                {current === 2 && (
                                    <Form
                                        onFinish={() => createNewAccount()}
                                        className="review-form"
                                        spellCheck={false}
                                        layout="horizontal"
                                    >
                                        <Flex
                                            className="flex-column"
                                            style={{ marginBottom: 10 }}
                                            justify="center"
                                            align="center"
                                        >
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

                                            <Form.Item noStyle>
                                                <Avatar
                                                    icon={<UserOutlined />}
                                                    shape="circle"
                                                    src={formData.avatar}
                                                    size={120}
                                                />
                                            </Form.Item>
                                        </Flex>

                                        <Form.Item label={"Никнейм"}>
                                            <Input
                                                autoComplete="off"
                                                variant="borderless"
                                                readOnly
                                                value={formData.userName}
                                            />
                                        </Form.Item>
                                        <Form.Item label={"Эл. почта"}>
                                            <Input
                                                autoComplete="off"
                                                variant="borderless"
                                                readOnly
                                                value={formData.email}
                                            />
                                        </Form.Item>

                                        <Form.Item label={"Пароль"}>
                                            <Input.Password
                                                autoComplete="off"
                                                readOnly
                                                value={formData.password}
                                                variant="borderless"
                                            />
                                        </Form.Item>

                                        <Collapse
                                            className="nonrequired-collapse"
                                            bordered={false}
                                            style={{
                                                backgroundColor: "transparent",
                                            }}
                                            items={[
                                                {
                                                    key: "1",
                                                    label: (
                                                        <Divider orientation="left">
                                                            Необязательные
                                                            данные
                                                        </Divider>
                                                    ),
                                                    children: (
                                                        <Flex
                                                            style={{
                                                                flexDirection:
                                                                    "column",
                                                            }}
                                                        >
                                                            <Form.Item
                                                                label={"Имя"}
                                                            >
                                                                <Input
                                                                    value={
                                                                        formData.name
                                                                    }
                                                                    placeholder="не указано"
                                                                    readOnly
                                                                    variant="borderless"
                                                                />
                                                            </Form.Item>
                                                            <Form.Item
                                                                label={
                                                                    "Фамилия"
                                                                }
                                                            >
                                                                <Input
                                                                    value={
                                                                        formData.surName
                                                                    }
                                                                    placeholder="не указано"
                                                                    readOnly
                                                                    variant="borderless"
                                                                />
                                                            </Form.Item>
                                                            <Form.Item
                                                                label={
                                                                    "Дата рождения"
                                                                }
                                                            >
                                                                <DatePicker
                                                                    value={
                                                                        formData.dateBirth
                                                                            ? dayjs(
                                                                                  formData.dateBirth
                                                                              )
                                                                            : null
                                                                    }
                                                                    locale={
                                                                        locale
                                                                    }
                                                                    format={
                                                                        "D MMMM, YYYY"
                                                                    }
                                                                    suffixIcon={
                                                                        null
                                                                    }
                                                                    className="width-100"
                                                                    allowClear={
                                                                        false
                                                                    }
                                                                    placeholder="не указано"
                                                                    inputReadOnly
                                                                    popupStyle={{
                                                                        display:
                                                                            "none",
                                                                    }}
                                                                    variant="borderless"
                                                                />
                                                            </Form.Item>
                                                        </Flex>
                                                    ),
                                                },
                                            ]}
                                        />

                                        <Checkbox onChange={onChangeAgreeRules}>
                                            <Text>
                                                Я ознакомлен(а) с{" "}
                                                <Link
                                                    href="/about"
                                                    target="_blank"
                                                >
                                                    правилами
                                                </Link>{" "}
                                                сайта и соглашаюсь с ними.
                                            </Text>
                                        </Checkbox>

                                        <Divider />
                                        <Flex gap={10} justify="space-between">
                                            <Form.Item>
                                                <Button
                                                    style={{
                                                        opacity: 0.75,
                                                        fontSize: 12,
                                                    }}
                                                    icon={<LongLeftArrow />}
                                                    onClick={() =>
                                                        setCurrent(1)
                                                    }
                                                    type="link"
                                                >
                                                    Назад
                                                </Button>
                                            </Form.Item>
                                            <Form.Item>
                                                <Button
                                                    disabled={!checked}
                                                    htmlType="submit"
                                                    type="primary"
                                                    shape="circle"
                                                    icon={<CheckOutlined />}
                                                ></Button>
                                            </Form.Item>
                                        </Flex>
                                    </Form>
                                )}
                            </Card>
                        </Flex>
                    </SignPageConfigProvider>
                </Flex>
            }
            onErrorNode={<PageErrorView text="Вы уже вошли в свой аккаунт" />}
        />
    );
};

export default SignupPage;
