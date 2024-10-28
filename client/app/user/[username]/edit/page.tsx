"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    UserOutlined,
    RightOutlined,
    LoginOutlined,
    ProfileOutlined,
    CheckSquareOutlined,
} from "@ant-design/icons";
import Typewriter from "typewriter-effect";
import {
    Avatar,
    Button,
    Card,
    Col,
    DatePicker,
    Flex,
    Form,
    GetProp,
    Input,
    Row,
    Space,
    Image,
    Steps,
    Typography,
    Upload,
    UploadFile,
    UploadProps,
    message,
    Divider,
    Result,
    ConfigProvider,
    InputRef,
    Breadcrumb,
    DescriptionsProps,
    Descriptions,
} from "antd";
import ImgCrop from "antd-img-crop";
import Meta from "antd/es/card/Meta";
import {
    checkExistEmail,
    checkExistUserName,
    getUserByUserName,
    MainUserInfo,
    registerUser,
    UserRequest,
} from "../../../services/user";
import Link from "next/link";
import locale from "antd/es/date-picker/locale/ru_RU";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import AvatarPicker from "../../../components/AvatarPicker";
import Title from "antd/es/typography/Title";
import { LongLeftArrow } from "@/app/img/LongLeftArrow";
dayjs.locale("ru");
export default function EditUserPage({
    params,
}: {
    params: { username: string };
}) {
    const getUser = async () => {
        const user = await getUserByUserName(params.username);
        setUser(user);
    };
    useEffect(() => {
        getUser();
    }, []);
    const [user, setUser] = useState<MainUserInfo>();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const [avatar, setAvatar] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [surName, setSurname] = useState<string>("");
    const [dateBirth, setDateBirth] = useState<string>("");
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log("Success:", values);
        // Здесь вы должны обработать данные и обновить профиль пользователя
        setUser(values);
        message.success("Профиль успешно обновлен!");
    };

    useEffect(() => {
        form.setFieldsValue(user); // Устанавливаем начальные значения формы
    }, [user, form]);
    return (
        <div className="container">
            <Breadcrumb
                separator=""
                items={[
                    {
                        title: (
                            <Link href={"./"}>
                                <Flex justify="center" gap={5}>
                                    <UserOutlined /> {params.username}
                                </Flex>
                            </Link>
                        ),
                    },
                    {
                        type: "separator",
                        separator: ":",
                    },
                    {
                        title: (
                            <Link
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    fontStyle: "italic",
                                    gap: 5,
                                    fontSize: 11,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                href={"./"}
                            >
                                <LongLeftArrow />
                                Назад
                            </Link>
                        ),
                    },
                    {
                        type: "separator",
                    },
                    {
                        title: "Редактирование профиля",
                    },
                ]}
            />
            <Form
                initialValues={{
                    name: user?.userInfo.name,
                    dateBirth: !user?.userInfo.dateBirth
                        ? null
                        : dayjs(user?.userInfo.dateBirth),
                    userName: user?.userInfo.userName,
                    surName: user?.userInfo.surName,
                }}
            >
                <Form.Item name={"avatar"}>
                    <Space
                        style={{ justifyContent: "center" }}
                        wrap
                        size={[10, 10]}
                    >
                        <Avatar
                            size={160}
                            shape="square"
                            src={user?.userInfo.avatar}
                        />

                        <Meta
                            title={
                                <Typography.Title level={5}>
                                    {"Нажмите, чтобы изменить аватар"}
                                </Typography.Title>
                            }
                            description={
                                <Typography.Text
                                    italic
                                    style={{ fontSize: 12 }}
                                >
                                    {
                                        "допускаются только файлы формата JPG/PNG, размером не превышающие 512 КБ"
                                    }
                                </Typography.Text>
                            }
                        ></Meta>
                    </Space>
                </Form.Item>
                <Form.Item
                    name={"userName"}
                    tooltip={"чувст к регитсру"}
                    label={"Имя пользователя"}
                >
                    <Input />
                </Form.Item>
                <Divider>Необязательные параметры</Divider>
                <Form.Item name={"name"} label={"Имя"}>
                    <Input />
                </Form.Item>
                <Form.Item name={"surName"} label={"Фамилия"}>
                    <Input />
                </Form.Item>
                <Form.Item name={"dateBirth"} label={"Дата рождения"}>
                    <DatePicker
                        maxDate={dayjs(
                            new Date().setFullYear(
                                new Date().getFullYear() - 12
                            )
                        )}
                        style={{ width: "100%" }}
                        placeholder="Укажите вашу дату рождения"
                    />
                </Form.Item>
                <Divider />
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Назад
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Сохранить изменения
                    </Button>
                </Form.Item>
            </Form>

            <Button>Изменить email и/или пароль</Button>

            <Button>Очистить мои списки</Button>
            <Button>Удалить аккаунт</Button>
        </div>
    );
}
