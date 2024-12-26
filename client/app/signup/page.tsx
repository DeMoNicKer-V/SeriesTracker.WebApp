"use client";
import React, { useEffect, useState } from "react";
import {
    CheckOutlined,
    QuestionCircleOutlined,
    UserOutlined,
} from "@ant-design/icons";
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
    Checkbox,
    Collapse,
    CheckboxProps,
    Tooltip,
} from "antd";
import Meta from "antd/es/card/Meta";
import {
    checkExistEmail,
    checkExistUserName,
    registerUser,
    UserRequest,
} from "../services/user";
import locale from "antd/es/date-picker/locale/ru_RU";
import "dayjs/locale/ru";
import AvatarPicker from "../components/AvatarPicker";
import "./style.css";
import { LongLeftArrow } from "../img/LongLeftArrow";
import { LongRightArrow } from "../img/LongRightArrow";
import { LogoIcon } from "../img/LogoIcon";
import { useRouter } from "next/navigation";
import { IsAuth } from "../api/coockie";
import { EmptyView } from "../components/EmptyView";
import dayjs from "dayjs";
import SignPageConfigProvider from "../components/SignPageConfigProvider";

dayjs.locale("ru");
const { Text, Title, Link } = Typography;

const SignupPage = () => {
    const router = useRouter();
    const [avatar, setAvatar] = useState<string>("");
    const [current, setCurrent] = useState<number>(0);
    const [formData, setFormData] = useState<UserRequest>({
        email: "",
        password: "",
        userName: "",
    });
    const [auth, setAuth] = useState<boolean>(false);
    const [visibleFields, setVisibleFields] = useState([true]);
    const [checked, setChecked] = useState(false);

    const [isActive, setIsActive] = useState<Record<string, boolean>>({
        email: true,
        password: false,
        userName: false,
    });

    const [form] = Form.useForm();
    const {
        getFieldError,
        getFieldValue,
        getFieldsValue,
        isFieldsValidating,
        focusField,
    } = form;

    const handleFocus = (name: string) => {
        setIsActive({ [name]: true });
    };

    const createNewAccount = async () => {
        formData.dateBirth = dayjs(formData.dateBirth)
            .format("YYYY-MM-DD")
            .toString();
        const response = await registerUser(formData);
        if (response !== false) {
            router.push("/login");
        }
    };

    const DefaultFormInput = ({
        name,
        label,
    }: {
        name: string;
        label: string;
    }) => {
        return (
            <Form.Item
                rules={[
                    {
                        min: 3,
                        message: "Длина слишком короткая",
                    },
                    {
                        pattern: new RegExp("^[a-zA-Zа-яА-Я]+$"),
                        message: `${label} не может включать в себя спец. символы и пробел`,
                    },
                ]}
                name={name}
            >
                <Input
                    autoComplete="off"
                    variant="filled"
                    placeholder={label}
                ></Input>
            </Form.Item>
        );
    };
    const onChangeAgreeRules: CheckboxProps["onChange"] = (e) => {
        setChecked(e.target.checked);
    };

    const handleNextField = (index: number) => {
        setVisibleFields((prevVisibleFields) => {
            const nextVisibleFields = [...prevVisibleFields];
            nextVisibleFields[index + 1] = true;
            return nextVisibleFields;
        });
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
        const a = await IsAuth();
        setAuth(a);
    };

    useEffect(() => {
        getIsAuth();
    }, []);

    return auth === false ? (
        <Flex
            className="bg flex-column"
            style={{
                alignItems: "center",
                padding: 24,
            }}
        >
            <title>Series Tracker - Регистрация</title>
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
                            Уже есть аккаунт?
                        </Text>
                        <Link
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
                    <Title level={4}>
                        Регистрация на{" "}
                        <Link style={{ fontSize: 20 }}>@SeriesTracker</Link>
                    </Title>
                    <Card
                        style={{
                            width: "100%",
                            padding: 24,
                            cursor: "default",
                        }}
                    >
                        <Form
                            layout="vertical"
                            form={form}
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
                                                                isFieldsValidating() ||
                                                                !getFieldValue(
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

                                                                focusField(
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
                                                                "Убедитесь, что пароль содержит не менее 15 символов или не менее 8 символов, включая цифру и большую букву.",
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
                                                                    isFieldsValidating() ||
                                                                    !getFieldValue(
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

                                                                    focusField(
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
                                                            min: 3,
                                                            message:
                                                                "Длина логина должны быть не менее 3 символов",
                                                        },
                                                        {
                                                            pattern: new RegExp(
                                                                "^[a-zA-Zа-яА-Я0-9]+$"
                                                            ),
                                                            message:
                                                                "Логин не должен включать в себя спец. символы и пробел",
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
                                                                // Разрешить регистрацию, если userName уникален
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
                                                                disabled={
                                                                    !getFieldValue(
                                                                        "userName"
                                                                    ) ||
                                                                    getFieldError(
                                                                        "userName"
                                                                    ).length >
                                                                        0 ||
                                                                    isFieldsValidating()
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
                                    <Text
                                        strong
                                        style={{
                                            opacity: 0.8,
                                        }}
                                    >
                                        {isActive.email &&
                                            getFieldError("email")}
                                        {isActive.password &&
                                            getFieldError("password")}
                                        {isActive.userName &&
                                            getFieldError("userName")}
                                    </Text>
                                )}
                            </Form.Item>

                            {current === 1 && (
                                <Flex className="flex-column">
                                    <Space
                                        className="wrap-title"
                                        style={{ justifyContent: "center" }}
                                        wrap
                                        size={[10, 10]}
                                    >
                                        <Form.Item
                                            noStyle
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
                                                <Title level={5}>
                                                    {"Выберите ваш аватар"}
                                                </Title>
                                            }
                                            description={
                                                <Text
                                                    type="secondary"
                                                    style={{ fontSize: 12 }}
                                                >
                                                    {
                                                        "допускаются только файлы формата JPG/PNG, размером не превышающие 512 КБ"
                                                    }
                                                </Text>
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
                                        <DefaultFormInput
                                            name={"name"}
                                            label={"Имя"}
                                        />
                                        <DefaultFormInput
                                            name={"surName"}
                                            label={"Фамилия"}
                                        />
                                    </Space>

                                    <Form.Item
                                        layout="horizontal"
                                        label={<Divider>Дата рождения</Divider>}
                                        name={"dateBirth"}
                                        style={{ width: "100%" }}
                                        getValueProps={(value) => ({
                                            value: value && dayjs(value),
                                        })}
                                        normalize={(value) =>
                                            value &&
                                            `${dayjs(value).format(
                                                "YYYY-MM-DD"
                                            )}`
                                        }
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
                                    <Divider className="zero-margin" dashed>
                                        <Text type="secondary">
                                            Необязательные данные{" "}
                                            <Tooltip
                                                title={
                                                    "Вы можете не заполнять вышеприведенные поля"
                                                }
                                            >
                                                <QuestionCircleOutlined />
                                            </Tooltip>
                                        </Text>
                                    </Divider>
                                </Flex>
                            )}
                        </Form>
                        {current === 2 && (
                            <Form
                                onFinish={() => createNewAccount()}
                                className="review-form"
                                spellCheck={false}
                                layout="horizontal"
                            >
                                <Flex
                                    style={{ marginBottom: 10 }}
                                    justify="center"
                                >
                                    <Form.Item noStyle>
                                        <Avatar
                                            icon={<UserOutlined />}
                                            shape="circle"
                                            src={avatar}
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
                                                            value={
                                                                formData.dateBirth
                                                                    ? dayjs(
                                                                          formData.dateBirth
                                                                      )
                                                                    : null
                                                            }
                                                            locale={locale}
                                                            format={
                                                                "D MMMM, YYYY"
                                                            }
                                                            suffixIcon={null}
                                                            style={{
                                                                width: "100%",
                                                            }}
                                                            allowClear={false}
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

                                <Checkbox onChange={onChangeAgreeRules}>
                                    <Text>
                                        Я ознакомлен (а) с{" "}
                                        <Link href="/about" target="_blank">
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
                                            onClick={() => setCurrent(1)}
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
    ) : (
        <Flex
            gap={10}
            justify="center"
            align="center"
            className="bg flex-column"
        >
            <EmptyView text="Вы уже вошли в свой аккаунт" />
            <Link
                href={"/shikimori"}
                style={{
                    fontWeight: 700,
                }}
            >
                <Flex gap={5} justify="center" align="center">
                    Вернуться на главную
                    <LongRightArrow />
                </Flex>
            </Link>
        </Flex>
    );
};

export default SignupPage;
