"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    UserOutlined,
    RightOutlined,
    LoginOutlined,
    ProfileOutlined,
    CheckSquareOutlined,
    EditOutlined,
    KeyOutlined,
    MinusCircleOutlined,
    QuestionCircleOutlined,
    SolutionOutlined,
    LoadingOutlined,
    SmileOutlined,
    CheckOutlined,
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
    Descriptions,
    DescriptionsProps,
    Tooltip,
    Checkbox,
    Collapse,
} from "antd";
import ImgCrop from "antd-img-crop";
import Meta from "antd/es/card/Meta";
import {
    checkExistEmail,
    checkExistUserName,
    registerUser,
    UserRequest,
} from "../services/user";
import Link from "next/link";
import locale from "antd/es/date-picker/locale/ru_RU";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import AvatarPicker from "../components/AvatarPicker";
import Title from "antd/es/typography/Title";
import "./style.css";
import { LongLeftArrow } from "../img/LongLeftArrow";
import { LongRightArrow } from "../img/LongRightArrow";
import { LogoIcon } from "../img/LogoIcon";
import { useRouter } from "next/navigation";
dayjs.locale("ru");
const SignupPage = () => {
    const [form] = Form.useForm();
    const [isActive, setIsActive] = useState<Record<string, boolean>>({
        email: true,
        password: false,
        userName: false,
    });

    const handleFocus = (name: string) => {
        setIsActive({ [name]: true });
    };
    const { getFieldError, isFieldTouched } = form;
    const inputRef = useRef<InputRef>(null);
    const inputRef2 = useRef<InputRef>(null);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const [avatar, setAvatar] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [surName, setSurname] = useState<string>("");
    const [dateBirth, setDateBirth] = useState<string>("");

    const [current, setCurrent] = useState(0);

    const router = useRouter();
    const createNewAccount = async () => {
        const userRequest: UserRequest = {
            email,
            password,
            userName,
            avatar,
            name,
            surName,
            dateBirth,
        };
        const response = await registerUser(userRequest);
        if (response !== false) {
            router.push("/login");
        }
    };

    return (
        <Flex
            className="bg flex-column"
            style={{
                alignItems: "center",
                padding: 24,
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
                            secondColor="#DE1EB2"
                        />
                    }
                />

                <Space size={[5, 5]}>
                    <Typography.Text style={{ fontSize: 16 }}>
                        Уже есть аккаунт?
                    </Typography.Text>
                    <Link
                        target="_top"
                        href={"/login"}
                        style={{
                            fontSize: 16,
                            fontWeight: 700,
                        }}
                    >
                        <Flex gap={5} justify="center" align="center">
                            Войти
                            <LongRightArrow />
                        </Flex>
                    </Link>
                </Space>
            </Flex>
            <Flex
                className="flex-column width-100"
                style={{
                    alignItems: "center",
                    maxWidth: "660px",
                    paddingTop: 128,
                    gap: 30,
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
                                colorLink: "#DE1EB2",
                                colorLinkHover: "#8b2675",
                            },
                            Card: {
                                colorBgContainer: "#3e0d2b61",
                                colorBorderSecondary: "#3e0d2b61",
                            },
                            Input: {
                                activeBg: "transparent",
                                colorBgContainer: "transparent",
                                fontSize: 16,
                            },
                            Form: {
                                labelFontSize: 16,
                                labelColor: "#DE1EB2",
                                labelRequiredMarkColor: "#DE1EB2",
                            },
                            DatePicker: {
                                colorBgElevated: "#3e0d2b",
                                fontSize: 16,
                            },
                        },
                    }}
                >
                    {" "}
                    <Typography.Title level={4}>
                        Регистрация на{" "}
                        <Typography.Link style={{ fontSize: 20 }}>
                            @SeriesTracker
                        </Typography.Link>
                    </Typography.Title>
                    <Card
                        hoverable
                        style={{
                            width: "100%",
                            padding: 24,
                            cursor: "default",
                        }}
                    >
                        <Form
                            id="registration-form"
                            onFinish={(values) => {
                                setCurrent(1);
                            }}
                            layout="vertical"
                            form={form}
                            name="requiredForm"
                            style={{ width: "100%" }}
                            initialValues={{ items: [{}] }}
                        >
                            {current === 0 && (
                                <Form.List name="items">
                                    {(fields, { add }) => (
                                        <Flex className="flex-column">
                                            {fields.map((field) => [
                                                field.key === 0 && (
                                                    <Row
                                                        gutter={[10, 10]}
                                                        align={"bottom"}
                                                        justify={"center"}
                                                    >
                                                        <Col sm={19} xs={24}>
                                                            <Form.Item
                                                                validateFirst
                                                                validateDebounce={
                                                                    1500
                                                                }
                                                                hasFeedback
                                                                name={[
                                                                    field.name,
                                                                    "email",
                                                                ]}
                                                                label={
                                                                    " Эл. почта"
                                                                }
                                                                rules={[
                                                                    {
                                                                        required:
                                                                            true,
                                                                        message:
                                                                            "Эл. почта обязательна для регистрации",
                                                                    },
                                                                    {
                                                                        type: "email",
                                                                        message:
                                                                            "Эл. почта имеет некорректную сигнатуру",
                                                                    },
                                                                    {
                                                                        validator:
                                                                            async (
                                                                                _,
                                                                                value
                                                                            ) => {
                                                                                if (
                                                                                    !value
                                                                                ) {
                                                                                    // Проверка на пустоту
                                                                                    return Promise.resolve(); // Возвращаем Promise.resolve(), если поле пустое
                                                                                }
                                                                                // Проверка на стороне сервера
                                                                                const exists =
                                                                                    await checkExistEmail(
                                                                                        value
                                                                                    );
                                                                                if (
                                                                                    exists
                                                                                ) {
                                                                                    return Promise.reject(
                                                                                        new Error(
                                                                                            "Этот email уже используется."
                                                                                        )
                                                                                    );
                                                                                }
                                                                                // Разрешить регистрацию, если email уникален
                                                                                return Promise.resolve();
                                                                            },
                                                                    },
                                                                ]}
                                                            >
                                                                <Input
                                                                    autoComplete="off"
                                                                    autoFocus
                                                                    onChange={(e: {
                                                                        target: {
                                                                            value: any;
                                                                        };
                                                                    }) => {
                                                                        setEmail(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                    }}
                                                                    spellCheck={
                                                                        false
                                                                    }
                                                                    onFocus={() =>
                                                                        handleFocus(
                                                                            "email"
                                                                        )
                                                                    }
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col sm={5} xs={24}>
                                                            {isActive.email ? (
                                                                <Form.Item
                                                                    shouldUpdate
                                                                >
                                                                    {() => (
                                                                        <Button
                                                                            type="primary"
                                                                            ghost
                                                                            className="width-100"
                                                                            disabled={
                                                                                form.isFieldsValidating() ||
                                                                                !form.getFieldValue(
                                                                                    [
                                                                                        "items",
                                                                                        field.name,
                                                                                        "email",
                                                                                    ]
                                                                                ) ||
                                                                                getFieldError(
                                                                                    [
                                                                                        "items",
                                                                                        field.name,
                                                                                        "email",
                                                                                    ]
                                                                                )
                                                                                    .length >
                                                                                    0
                                                                            }
                                                                            onClick={() => {
                                                                                if (
                                                                                    fields.length ===
                                                                                        field.key +
                                                                                            1 &&
                                                                                    fields.length <
                                                                                        3
                                                                                ) {
                                                                                    add();
                                                                                }

                                                                                if (
                                                                                    inputRef.current
                                                                                ) {
                                                                                    inputRef.current!.focus(
                                                                                        {
                                                                                            cursor: "start",
                                                                                        }
                                                                                    );
                                                                                }
                                                                            }}
                                                                        >
                                                                            Продолжить
                                                                        </Button>
                                                                    )}
                                                                </Form.Item>
                                                            ) : null}
                                                        </Col>
                                                    </Row>
                                                ),
                                                field.key === 1 && (
                                                    <Row
                                                        gutter={[10, 10]}
                                                        align={"bottom"}
                                                        justify={"center"}
                                                    >
                                                        <Col sm={19} xs={24}>
                                                            <Form.Item
                                                                validateFirst
                                                                validateDebounce={
                                                                    1500
                                                                }
                                                                hasFeedback
                                                                shouldUpdate
                                                                name={[
                                                                    field.name,
                                                                    "password",
                                                                ]}
                                                                label={"Пароль"}
                                                                rules={[
                                                                    {
                                                                        required:
                                                                            true,
                                                                        message:
                                                                            "Пароль обязателен для регистрации",
                                                                    },
                                                                    {
                                                                        pattern:
                                                                            new RegExp(
                                                                                "^(?=.*[A-Z]|[А-Я])(?=.*).{8,}$|.{15,}$"
                                                                            ),
                                                                        message:
                                                                            "Убедитесь, что пароль содержит не менее 15 символов или не менее 8 символов, включая цифру и строчную букву.",
                                                                    },
                                                                ]}
                                                            >
                                                                <Input.Password
                                                                    autoComplete="off"
                                                                    onChange={(e: {
                                                                        target: {
                                                                            value: any;
                                                                        };
                                                                    }) => {
                                                                        setPassword(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                    }}
                                                                    autoFocus
                                                                    ref={
                                                                        inputRef
                                                                    }
                                                                    spellCheck={
                                                                        false
                                                                    }
                                                                    onFocus={() =>
                                                                        handleFocus(
                                                                            "password"
                                                                        )
                                                                    }
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col sm={5} xs={24}>
                                                            {isActive.password ? (
                                                                <Form.Item
                                                                    shouldUpdate
                                                                >
                                                                    {() => (
                                                                        <Button
                                                                            type="primary"
                                                                            ghost
                                                                            disabled={
                                                                                form.isFieldsValidating() ||
                                                                                !form.getFieldValue(
                                                                                    [
                                                                                        "items",
                                                                                        field.name,
                                                                                        "password",
                                                                                    ]
                                                                                ) ||
                                                                                getFieldError(
                                                                                    [
                                                                                        "items",
                                                                                        field.name,
                                                                                        "password",
                                                                                    ]
                                                                                )
                                                                                    .length >
                                                                                    0
                                                                            }
                                                                            onClick={() => {
                                                                                if (
                                                                                    fields.length ===
                                                                                        field.key +
                                                                                            1 &&
                                                                                    fields.length <
                                                                                        3
                                                                                ) {
                                                                                    add();
                                                                                }

                                                                                if (
                                                                                    inputRef2.current
                                                                                ) {
                                                                                    inputRef2.current!.focus(
                                                                                        {
                                                                                            cursor: "start",
                                                                                        }
                                                                                    );
                                                                                }
                                                                            }}
                                                                        >
                                                                            Продолжить
                                                                        </Button>
                                                                    )}
                                                                </Form.Item>
                                                            ) : null}
                                                        </Col>
                                                    </Row>
                                                ),
                                                field.key === 2 && (
                                                    <Row
                                                        gutter={[10, 10]}
                                                        align={"bottom"}
                                                        justify={"center"}
                                                    >
                                                        <Col sm={19} xs={24}>
                                                            <Form.Item
                                                                validateFirst
                                                                validateDebounce={
                                                                    1500
                                                                }
                                                                hasFeedback
                                                                name={[
                                                                    field.name,
                                                                    "userName",
                                                                ]}
                                                                label={
                                                                    "Логин (никнейм)"
                                                                }
                                                                tooltip="Чувствителен к регистру"
                                                                rules={[
                                                                    {
                                                                        required:
                                                                            true,
                                                                        message:
                                                                            "Логин обязателен для регистрации",
                                                                    },
                                                                    {
                                                                        validator:
                                                                            async (
                                                                                _,
                                                                                value
                                                                            ) => {
                                                                                // Проверка на стороне сервера
                                                                                const exists =
                                                                                    await checkExistUserName(
                                                                                        value
                                                                                    );
                                                                                if (
                                                                                    exists
                                                                                ) {
                                                                                    return Promise.reject(
                                                                                        new Error(
                                                                                            "Этот логин уже используется."
                                                                                        )
                                                                                    );
                                                                                }
                                                                                // Разрешить регистрацию, если email уникален
                                                                                return Promise.resolve();
                                                                            },
                                                                    },
                                                                ]}
                                                            >
                                                                <Input
                                                                    autoComplete="off"
                                                                    onChange={(e: {
                                                                        target: {
                                                                            value: any;
                                                                        };
                                                                    }) => {
                                                                        setUserName(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                    }}
                                                                    autoFocus
                                                                    ref={
                                                                        inputRef2
                                                                    }
                                                                    spellCheck={
                                                                        false
                                                                    }
                                                                    onFocus={() =>
                                                                        handleFocus(
                                                                            "userName"
                                                                        )
                                                                    }
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col sm={5} xs={24}>
                                                            {isActive.userName ? (
                                                                <Form.Item
                                                                    shouldUpdate
                                                                >
                                                                    {() => (
                                                                        <Button
                                                                            type="primary"
                                                                            ghost
                                                                            className="width-100"
                                                                            htmlType="submit"
                                                                            disabled={
                                                                                !form.getFieldValue(
                                                                                    [
                                                                                        "items",
                                                                                        field.name,
                                                                                        "userName",
                                                                                    ]
                                                                                ) ||
                                                                                getFieldError(
                                                                                    [
                                                                                        "items",
                                                                                        field.name,
                                                                                        "userName",
                                                                                    ]
                                                                                )
                                                                                    .length >
                                                                                    0 ||
                                                                                form.isFieldsValidating()
                                                                            }
                                                                        >
                                                                            Продолжить
                                                                        </Button>
                                                                    )}
                                                                </Form.Item>
                                                            ) : null}
                                                        </Col>
                                                    </Row>
                                                ),
                                            ])}
                                        </Flex>
                                    )}
                                </Form.List>
                            )}
                            <Form.Item
                                style={{ marginTop: -5, marginBottom: -10 }}
                                shouldUpdate
                            >
                                {() => (
                                    <Typography.Text
                                        strong
                                        style={{
                                            fontSize: 16,
                                            opacity: 0.8,
                                        }}
                                    >
                                        {isActive.email &&
                                            form.getFieldError([
                                                "items",
                                                0,
                                                "email",
                                            ])}
                                        {isActive.password &&
                                            form.getFieldError([
                                                "items",
                                                1,
                                                "password",
                                            ])}
                                        {isActive.userName &&
                                            form.getFieldError([
                                                "items",
                                                2,
                                                "userName",
                                            ])}
                                    </Typography.Text>
                                )}
                            </Form.Item>

                            {current === 1 && (
                                <Flex style={{ flexDirection: "column" }}>
                                    <Space
                                        className="anime-title"
                                        style={{ justifyContent: "center" }}
                                        wrap
                                        size={[10, 10]}
                                    >
                                        <AvatarPicker
                                            preloadFile={avatar}
                                            onChange={setAvatar}
                                        />
                                        <Meta
                                            title={
                                                <Typography.Title level={5}>
                                                    {"Выберите ваш аватар"}
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

                                    <Divider>Как вас зовут?</Divider>

                                    <Space
                                        className="login-space"
                                        style={{
                                            width: "100%",
                                            textAlign: "center",
                                        }}
                                        wrap
                                        size={[10, 10]}
                                    >
                                        <Form.Item name={"name"}>
                                            <Input
                                                autoComplete="off"
                                                variant="filled"
                                                placeholder="Имя"
                                                onChange={(e: {
                                                    target: {
                                                        value: any;
                                                    };
                                                }) => {
                                                    setName(e.target.value);
                                                }}
                                            ></Input>
                                        </Form.Item>
                                        <Form.Item name={"surName"}>
                                            <Input
                                                autoComplete="off"
                                                variant="filled"
                                                placeholder="Фамилия "
                                                onChange={(e: {
                                                    target: {
                                                        value: any;
                                                    };
                                                }) => {
                                                    setSurname(e.target.value);
                                                }}
                                            ></Input>
                                        </Form.Item>
                                    </Space>

                                    <Form.Item
                                        layout="horizontal"
                                        label={<Divider>Дата рождения</Divider>}
                                        name={"dateBirth"}
                                        style={{ width: "100%" }}
                                    >
                                        <DatePicker
                                            variant="borderless"
                                            locale={locale}
                                            format={"D MMMM, YYYY"}
                                            maxDate={dayjs(
                                                new Date().setFullYear(
                                                    new Date().getFullYear() -
                                                        18
                                                )
                                            )}
                                            onChange={(date) => {
                                                setDateBirth(
                                                    date
                                                        ? date
                                                              .format(
                                                                  "YYYY-MM-DD"
                                                              )
                                                              .toString()
                                                        : ""
                                                );
                                            }}
                                            value={
                                                !dateBirth
                                                    ? null
                                                    : dayjs(dateBirth)
                                            }
                                            style={{ width: "100%" }}
                                            placeholder="Укажите дату рождения"
                                        ></DatePicker>
                                    </Form.Item>

                                    <Flex gap={10} justify="space-between">
                                        <Button
                                            style={{
                                                opacity: 0.75,
                                                fontSize: 12,
                                            }}
                                            icon={<LongLeftArrow />}
                                            onClick={() => setCurrent(0)}
                                            type="link"
                                        >
                                            Назад
                                        </Button>

                                        <Button
                                            type="link"
                                            style={{
                                                opacity: 0.75,
                                                fontSize: 12,
                                            }}
                                            iconPosition="end"
                                            onClick={() => setCurrent(2)}
                                            icon={<LongRightArrow />}
                                        >
                                            Перейти к завершению
                                        </Button>
                                    </Flex>
                                </Flex>
                            )}
                        </Form>
                        {current === 2 && (
                            <Form
                                className="review-form"
                                spellCheck={false}
                                layout="horizontal"
                            >
                                <Flex
                                    style={{ marginBottom: 10 }}
                                    justify="center"
                                >
                                    <Avatar
                                        shape="circle"
                                        src={avatar}
                                        size={120}
                                    />
                                </Flex>

                                <Form.Item label={"Никнейм"}>
                                    <Input
                                        variant="borderless"
                                        readOnly
                                        value={userName}
                                    />
                                </Form.Item>
                                <Form.Item label={"Эл. почта"}>
                                    <Input
                                        variant="borderless"
                                        readOnly
                                        value={email}
                                    />
                                </Form.Item>

                                <Form.Item label={"Пароль"}>
                                    <Input.Password
                                        readOnly
                                        value={password}
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
                                                <Divider
                                                    className="zero-margin"
                                                    orientation="left"
                                                >
                                                    Необязательные параметры
                                                </Divider>
                                            ),
                                            children: (
                                                <Flex
                                                    style={{
                                                        flexDirection: "column",
                                                    }}
                                                >
                                                    <Form.Item label={"Имя"}>
                                                        <Input
                                                            value={name}
                                                            placeholder="не указано"
                                                            readOnly
                                                            variant="borderless"
                                                        />
                                                    </Form.Item>
                                                    <Form.Item
                                                        label={"Фамилия"}
                                                    >
                                                        <Input
                                                            value={surName}
                                                            placeholder="не указано"
                                                            readOnly
                                                            variant="borderless"
                                                        />
                                                    </Form.Item>
                                                    <Form.Item
                                                        label={"Дата рождения"}
                                                    >
                                                        <DatePicker
                                                            locale={locale}
                                                            format={
                                                                "D MMMM, YYYY"
                                                            }
                                                            suffixIcon={null}
                                                            style={{
                                                                width: "100%",
                                                            }}
                                                            allowClear={false}
                                                            value={
                                                                dateBirth
                                                                    ? dayjs(
                                                                          dateBirth
                                                                      )
                                                                    : null
                                                            }
                                                            placeholder="не указано"
                                                            inputReadOnly
                                                            popupStyle={{
                                                                display: "none",
                                                            }}
                                                            variant="borderless"
                                                        />
                                                    </Form.Item>
                                                </Flex>
                                            ),
                                        },
                                    ]}
                                />

                                <Checkbox>
                                    <Typography.Paragraph>
                                        Я ознакомлен (а) с{" "}
                                        <Typography.Link
                                            href="/about"
                                            target="_blank"
                                        >
                                            правилами
                                        </Typography.Link>{" "}
                                        сайта и соглашаюсь с ними.
                                    </Typography.Paragraph>
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
                                            onClick={() => setCurrent(1)}
                                            type="link"
                                        >
                                            Назад
                                        </Button>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button
                                            onClick={() => createNewAccount()}
                                            type="primary"
                                            shape="circle"
                                            icon={<CheckOutlined />}
                                        ></Button>
                                    </Form.Item>
                                </Flex>
                            </Form>
                        )}
                    </Card>
                </ConfigProvider>
            </Flex>
        </Flex>
    );
};

export default SignupPage;
