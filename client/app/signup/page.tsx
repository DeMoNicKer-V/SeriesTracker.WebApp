"use client";
import React, { useEffect, useRef, useState } from "react";
import { CheckOutlined } from "@ant-design/icons";
import {
    Avatar,
    Button,
    Card,
    Col,
    DatePicker,
    Flex,
    Form,
    Input,
    Row,
    Space,
    Typography,
    Divider,
    ConfigProvider,
    InputRef,
    Checkbox,
    Collapse,
} from "antd";
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
import "./style.css";
import { LongLeftArrow } from "../img/LongLeftArrow";
import { LongRightArrow } from "../img/LongRightArrow";
import { LogoIcon } from "../img/LogoIcon";
import { useRouter } from "next/navigation";
import { IsAuth } from "../api/coockie";
import { EmptyView } from "../components/EmptyView";
dayjs.locale("ru");
const SignupPage = () => {
    const [auth, setAuth] = useState<boolean>(false);
    const [visibleFields, setVisibleFields] = useState([true]);
    const getIsAuth = async () => {
        const a = await IsAuth();
        setAuth(a);
    };

    const [form] = Form.useForm();
    const [isActive, setIsActive] = useState<Record<string, boolean>>({
        email: true,
        password: false,
        userName: false,
    });

    const handleFocus = (name: string) => {
        setIsActive({ [name]: true });
    };
    const { getFieldError } = form;

    const [avatar, setAvatar] = useState<string>("");

    const [current, setCurrent] = useState(0);
    const [formData, setFormData] = useState<UserRequest>({
        email: "",
        password: "",
        userName: "",
    });

    const router = useRouter();
    const createNewAccount = async () => {
        formData.dateBirth = dayjs(formData.dateBirth)
            .format("YYYY-MM-DD")
            .toString();
        const response = await registerUser(formData);
        if (response !== false) {
            router.push("/login");
        }
    };

    useEffect(() => {
        getIsAuth();
    }, []);

    const handleNextField = (index: number) => {
        setVisibleFields((prevVisibleFields) => {
            const nextVisibleFields = [...prevVisibleFields];
            nextVisibleFields[index + 1] = true;
            return nextVisibleFields;
        });
    };

    const handleNext = () => {
        const values = form.getFieldsValue();
        setFormData((prevFormData) => ({
            ...prevFormData,
            ...values,
        }));
        setCurrent(current + 1);
    };

    return auth === false ? (
        <Flex
            className="bg flex-column"
            style={{
                alignItems: "center",
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
                        DatePicker: {
                            colorBgElevated: "#084949",
                            fontSize: 16,
                        },
                        Button: { colorBorder: "#084949" },
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
                        <Typography.Text type="secondary" italic>
                            Уже есть аккаунт?
                        </Typography.Text>
                        <Typography.Link
                            target="_top"
                            href={"/login"}
                            style={{
                                fontWeight: 700,
                            }}
                        >
                            <Flex gap={5} justify="center" align="center">
                                Войти
                                <LongRightArrow />
                            </Flex>
                        </Typography.Link>
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
                            layout="vertical"
                            form={form}
                            onFinish={() => createNewAccount()}
                            name="registration-form"
                            className="width-100"
                            initialValues={{ formData }}
                        >
                            {current === 0 && (
                                <Flex className="flex-column">
                                    <Row
                                        gutter={[10, 10]}
                                        align={"bottom"}
                                        justify={"center"}
                                    >
                                        <Col sm={19} xs={24}>
                                            <Form.Item
                                                validateFirst
                                                validateDebounce={1500}
                                                hasFeedback
                                                name={"email"}
                                                label={" Эл. почта"}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Эл. почта обязательна для регистрации",
                                                    },
                                                    {
                                                        type: "email",
                                                        message:
                                                            "Эл. почта имеет некорректную сигнатуру",
                                                    },
                                                    {
                                                        validator: async (
                                                            _,
                                                            value
                                                        ) => {
                                                            if (!value) {
                                                                // Проверка на пустоту
                                                                return Promise.resolve(); // Возвращаем Promise.resolve(), если поле пустое
                                                            }
                                                            // Проверка на стороне сервера
                                                            const exists =
                                                                await checkExistEmail(
                                                                    value
                                                                );
                                                            if (exists) {
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
                                                    spellCheck={false}
                                                    onFocus={() =>
                                                        handleFocus("email")
                                                    }
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col sm={5} xs={24}>
                                            {isActive.email ? (
                                                <Form.Item shouldUpdate>
                                                    {() => (
                                                        <Button
                                                            type="primary"
                                                            ghost
                                                            className="width-100"
                                                            disabled={
                                                                form.isFieldsValidating() ||
                                                                !form.getFieldValue(
                                                                    "email"
                                                                ) ||
                                                                getFieldError(
                                                                    "email"
                                                                ).length > 0
                                                            }
                                                            onClick={() => {
                                                                handleNextField(
                                                                    0
                                                                );

                                                                form.focusField(
                                                                    "password"
                                                                );
                                                            }}
                                                        >
                                                            Продолжить
                                                        </Button>
                                                    )}
                                                </Form.Item>
                                            ) : null}
                                        </Col>
                                    </Row>
                                    {visibleFields[1] && (
                                        <Row
                                            gutter={[10, 10]}
                                            align={"bottom"}
                                            justify={"center"}
                                        >
                                            <Col sm={19} xs={24}>
                                                <Form.Item
                                                    style={{
                                                        display:
                                                            visibleFields[1]
                                                                ? "block"
                                                                : "none",
                                                    }}
                                                    validateFirst
                                                    validateDebounce={1500}
                                                    hasFeedback
                                                    shouldUpdate
                                                    name={"password"}
                                                    label={"Пароль"}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Пароль обязателен для регистрации",
                                                        },
                                                        {
                                                            pattern: new RegExp(
                                                                "^(?=.*[A-Z]|[А-Я])(?=.*).{8,}$|.{15,}$"
                                                            ),
                                                            message:
                                                                "Убедитесь, что пароль содержит не менее 15 символов или не менее 8 символов, включая цифру и строчную букву.",
                                                        },
                                                    ]}
                                                >
                                                    <Input.Password
                                                        autoComplete="off"
                                                        autoFocus
                                                        spellCheck={false}
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
                                                    <Form.Item shouldUpdate>
                                                        {() => (
                                                            <Button
                                                                type="primary"
                                                                ghost
                                                                disabled={
                                                                    form.isFieldsValidating() ||
                                                                    !form.getFieldValue(
                                                                        "password"
                                                                    ) ||
                                                                    getFieldError(
                                                                        "password"
                                                                    ).length > 0
                                                                }
                                                                onClick={() => {
                                                                    handleNextField(
                                                                        1
                                                                    );

                                                                    form.focusField(
                                                                        "userName"
                                                                    );
                                                                }}
                                                            >
                                                                Продолжить
                                                            </Button>
                                                        )}
                                                    </Form.Item>
                                                ) : null}
                                            </Col>
                                        </Row>
                                    )}

                                    {visibleFields[2] && (
                                        <Row
                                            gutter={[10, 10]}
                                            align={"bottom"}
                                            justify={"center"}
                                        >
                                            <Col sm={19} xs={24}>
                                                <Form.Item
                                                    validateFirst
                                                    validateDebounce={1500}
                                                    hasFeedback
                                                    name={"userName"}
                                                    label={"Логин (никнейм)"}
                                                    tooltip="Чувствителен к регистру"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Логин обязателен для регистрации",
                                                        },
                                                        {
                                                            validator: async (
                                                                _,
                                                                value
                                                            ) => {
                                                                // Проверка на стороне сервера
                                                                const exists =
                                                                    await checkExistUserName(
                                                                        value
                                                                    );
                                                                if (exists) {
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
                                                        autoFocus
                                                        spellCheck={false}
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
                                                    <Form.Item shouldUpdate>
                                                        {() => (
                                                            <Button
                                                                onClick={
                                                                    handleNext
                                                                }
                                                                type="primary"
                                                                ghost
                                                                className="width-100"
                                                                htmlType="submit"
                                                                disabled={
                                                                    !form.getFieldValue(
                                                                        "userName"
                                                                    ) ||
                                                                    getFieldError(
                                                                        "userName"
                                                                    ).length >
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
                                    )}
                                </Flex>
                            )}
                            <Form.Item
                                style={{ marginTop: -5, marginBottom: -10 }}
                                shouldUpdate
                            >
                                {() => (
                                    <Typography.Text
                                        strong
                                        style={{
                                            opacity: 0.8,
                                        }}
                                    >
                                        {isActive.email &&
                                            form.getFieldError("email")}
                                        {isActive.password &&
                                            form.getFieldError("password")}
                                        {isActive.userName &&
                                            form.getFieldError("userName")}
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
                                        <Form.Item
                                            valuePropName="fileList"
                                            name={"avatar"}
                                        >
                                            <AvatarPicker
                                                preloadFile={avatar}
                                                onChange={setAvatar}
                                            />
                                        </Form.Item>
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
                                            ></Input>
                                        </Form.Item>
                                        <Form.Item name={"surName"}>
                                            <Input
                                                autoComplete="off"
                                                variant="filled"
                                                placeholder="Фамилия "
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
                                            onClick={handleNext}
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
                                                            value={
                                                                formData.name
                                                            }
                                                            placeholder="не указано"
                                                            readOnly
                                                            variant="borderless"
                                                        />
                                                    </Form.Item>
                                                    <Form.Item
                                                        label={"Фамилия"}
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
                                                                formData.dateBirth
                                                                    ? dayjs(
                                                                          formData.dateBirth
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
                </Flex>
            </ConfigProvider>
        </Flex>
    ) : (
        <Flex
            gap={10}
            justify="center"
            align="center"
            className="bg flex-column"
        >
            <EmptyView text="Вы уже вошли в свой аккаунт" />
            <Link href={"/shikimori"}>Вернуться на главную</Link>
        </Flex>
    );
};

export default SignupPage;
