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

    const onChangeCurrent = (value: number) => {
        setCurrent(value);
    };

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
        await registerUser(userRequest);
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
                    width: "660px",
                    maxWidth: "660px",
                    gap: 30,
                }}
            >
                <Typography.Title level={3}>
                    Регистрация на Series Tracker
                </Typography.Title>
                <Card
                    hoverable
                    style={{ width: "100%", padding: 24, cursor: "default" }}
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
                                    <div
                                        style={{
                                            display: "flex",
                                            rowGap: 16,
                                            flexDirection: "column",
                                        }}
                                    >
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
                                                                <Title
                                                                    level={5}
                                                                >
                                                                    Эл. почта
                                                                </Title>
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
                                                                autoFocus
                                                                onChange={(e: {
                                                                    target: {
                                                                        value: any;
                                                                    };
                                                                }) => {
                                                                    setEmail(
                                                                        e.target
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
                                                            label={
                                                                <Title
                                                                    level={5}
                                                                >
                                                                    Пароль
                                                                </Title>
                                                            }
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
                                                                onChange={(e: {
                                                                    target: {
                                                                        value: any;
                                                                    };
                                                                }) => {
                                                                    setPassword(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                                autoFocus
                                                                ref={inputRef}
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
                                                                <Title
                                                                    level={5}
                                                                >
                                                                    Логин
                                                                    (никнейм)
                                                                </Title>
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
                                                                onChange={(e: {
                                                                    target: {
                                                                        value: any;
                                                                    };
                                                                }) => {
                                                                    setUserName(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                                autoFocus
                                                                ref={inputRef2}
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
                                    </div>
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
                                    <AvatarPicker onChange={setAvatar} />
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
                                                new Date().getFullYear() - 12
                                            )
                                        )}
                                        onChange={(date) => {
                                            setDateBirth(
                                                date
                                                    ? date
                                                          .format("YYYY-MM-DD")
                                                          .toString()
                                                    : ""
                                            );
                                        }}
                                        value={
                                            !dateBirth ? null : dayjs(dateBirth)
                                        }
                                        style={{ width: "100%" }}
                                        placeholder="Укажите дату рождения"
                                    ></DatePicker>
                                </Form.Item>

                                <Flex gap={10} justify="center">
                                    <Button
                                        style={{
                                            opacity: 0.75,
                                        }}
                                        icon={<LongLeftArrow />}
                                        onClick={() => setCurrent(0)}
                                        type="link"
                                    >
                                        Назад
                                    </Button>

                                    <Button
                                        iconPosition="end"
                                        onClick={() => setCurrent(2)}
                                        icon={<LongRightArrow />}
                                        htmlType="submit"
                                    >
                                        Перейти к завершению
                                    </Button>
                                </Flex>
                            </Flex>
                        )}
                    </Form>
                    {current === 2 && (
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
                                },
                            }}
                        >
                            <Form
                                className="review-form"
                                spellCheck={false}
                                layout="horizontal"
                            >
                                <Flex
                                    style={{ marginBottom: 10 }}
                                    justify="center"
                                >
                                    <Image src={avatar} width={100} preview />
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
                                                        name={"dateBirth"}
                                                        label={"Дата рождения"}
                                                    >
                                                        <DatePicker
                                                            suffixIcon={null}
                                                            style={{
                                                                width: "100%",
                                                            }}
                                                            allowClear={false}
                                                            value={
                                                                !dateBirth
                                                                    ? null
                                                                    : dayjs(
                                                                          dateBirth
                                                                      )
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
                                <Flex gap={10} justify="center">
                                    <Form.Item
                                        style={{
                                            opacity: 0.75,
                                        }}
                                    >
                                        <Button
                                            icon={<LongLeftArrow />}
                                            onClick={() => setCurrent(1)}
                                            type="link"
                                        >
                                            Назад
                                        </Button>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button
                                            icon={<CheckOutlined />}
                                            htmlType="submit"
                                        >
                                            Завершить регистрацию
                                        </Button>
                                    </Form.Item>
                                </Flex>
                            </Form>
                        </ConfigProvider>
                    )}
                </Card>
                <Space wrap size={[5, 5]}>
                    <Typography.Text>Уже есть аккаунт?</Typography.Text>
                    <Link
                        target="_top"
                        href={"/login"}
                        style={{
                            fontWeight: 700,
                        }}
                    >
                        Войти
                    </Link>
                </Space>
            </Flex>
        </Flex>
    );
};

export default SignupPage;
