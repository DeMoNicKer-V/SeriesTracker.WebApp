"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    UserOutlined,
    RightOutlined,
    LoginOutlined,
    ProfileOutlined,
    CheckSquareOutlined,
} from "@ant-design/icons";
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
dayjs.locale("ru");
const SignupPage = () => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
        if (newFileList.length) {
            const isJpgOrPng =
                newFileList[0].type === "image/jpeg" ||
                newFileList[0].type === "image/png";
            if (!isJpgOrPng) {
                message.error("Только JPG/PNG файлы!");
                return;
            }
            const isLt2M = newFileList[0].size / 1024 / 1024 < 0.5;
            if (!isLt2M) {
                message.error("Размер файла не должен превышать 512КБ!");
                return;
            }
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatar(reader.result?.toString());
        };
        reader.readAsDataURL(newFileList[0].originFileObj);
        setFileList(newFileList);
    };

    type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
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
        console.log("onChange:", value);
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
                <Meta
                    style={{ textAlign: "center" }}
                    title={
                        <Typography.Title level={3}>
                            Добро пожаловать на Series Tracker Web
                        </Typography.Title>
                    }
                    description={
                        <Typography.Text>
                            Давайте пройдем быструю регистрацию
                        </Typography.Text>
                    }
                />
                <Card
                    hoverable
                    style={{ width: "100%", padding: 24, cursor: "default" }}
                >
                    <Steps
                        current={current}
                        onChange={onChangeCurrent}
                        items={[
                            {
                                icon: <LoginOutlined />,
                            },
                            {
                                icon: <ProfileOutlined />,
                            },
                            {
                                icon: <CheckSquareOutlined />,
                            },
                        ]}
                    />

                    <Form
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
                                {(fields, { add, remove }) => (
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
                                                    <Col span={19}>
                                                        <Form.Item
                                                            validateDebounce={
                                                                1500
                                                            }
                                                            hasFeedback
                                                            name={[
                                                                field.name,
                                                                "email",
                                                            ]}
                                                            label="Эл. почта"
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
                                                                autoFocus
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
                                                    <Col span={5}>
                                                        {isActive.email ? (
                                                            <Form.Item
                                                                shouldUpdate
                                                            >
                                                                {() => (
                                                                    <Button
                                                                        disabled={
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
                                                    <Col span={19}>
                                                        <Form.Item
                                                            validateDebounce={
                                                                1500
                                                            }
                                                            hasFeedback
                                                            shouldUpdate
                                                            name={[
                                                                field.name,
                                                                "password",
                                                            ]}
                                                            label="Пароль"
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
                                                    <Col span={5}>
                                                        {isActive.password ? (
                                                            <Form.Item
                                                                shouldUpdate
                                                            >
                                                                {() => (
                                                                    <Button
                                                                        disabled={
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
                                                    <Col span={19}>
                                                        <Form.Item
                                                            validateDebounce={
                                                                1500
                                                            }
                                                            hasFeedback
                                                            name={[
                                                                field.name,
                                                                "userName",
                                                            ]}
                                                            label="Логин (никнейм)"
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
                                                    <Col span={5}>
                                                        {isActive.userName ? (
                                                            <Form.Item
                                                                shouldUpdate
                                                            >
                                                                {() => (
                                                                    <Button
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
                        <Form.Item style={{ marginTop: 10 }} shouldUpdate>
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
                                    style={{ justifyContent: "center" }}
                                    wrap
                                    size={[10, 10]}
                                >
                                    <Form.Item name={"avatar"}>
                                        <ImgCrop
                                            maxZoom={2}
                                            showReset
                                            resetText="Сбросить"
                                            modalOk="Выбрать"
                                            modalCancel="Отмена"
                                            fillColor={"transparent"}
                                            modalTitle="Выбор изображения профиля"
                                        >
                                            <Upload
                                                listType="picture-card"
                                                maxCount={1}
                                                fileList={fileList}
                                                onChange={onChange}
                                                onPreview={handlePreview}
                                            >
                                                {fileList.length < 1 && (
                                                    <Flex
                                                        style={{
                                                            flexDirection:
                                                                "column",
                                                            justifyContent:
                                                                "center",
                                                        }}
                                                    >
                                                        <UserOutlined
                                                            style={{
                                                                fontSize: 30,
                                                            }}
                                                        />
                                                    </Flex>
                                                )}
                                            </Upload>
                                        </ImgCrop>
                                        {previewImage && (
                                            <Image
                                                wrapperStyle={{
                                                    display: "none",
                                                }}
                                                preview={{
                                                    visible: previewOpen,
                                                    onVisibleChange: (
                                                        visible
                                                    ) =>
                                                        setPreviewOpen(visible),
                                                    afterOpenChange: (
                                                        visible
                                                    ) =>
                                                        !visible &&
                                                        setPreviewImage(""),
                                                }}
                                                src={previewImage}
                                            />
                                        )}
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
                                <Card
                                    style={{
                                        cursor: "default",
                                        width: "100%",
                                        padding: 5,
                                        backgroundColor: "transparent",
                                    }}
                                >
                                    <Flex
                                        align="center"
                                        justify="center"
                                        style={{ flexDirection: "column" }}
                                    >
                                        <Typography.Text italic>
                                            Как вас зовут?
                                        </Typography.Text>
                                        <Divider
                                            style={{
                                                margin: 10,
                                            }}
                                            dashed
                                            type="horizontal"
                                        ></Divider>
                                    </Flex>
                                    <Space
                                        className="login-space"
                                        style={{ width: "100%" }}
                                        wrap
                                        size={[10, 10]}
                                    >
                                        <Form.Item name={"name"}>
                                            <Input
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
                                </Card>
                                <Card
                                    style={{
                                        cursor: "default",
                                        width: "100%",
                                        padding: 5,
                                        backgroundColor: "transparent",
                                    }}
                                >
                                    <Flex
                                        align="center"
                                        justify="center"
                                        style={{ flexDirection: "column" }}
                                    >
                                        <Typography.Text italic>
                                            Ваша дата рождения?
                                        </Typography.Text>
                                        <Divider
                                            style={{
                                                width: "50%",
                                                minWidth: 0,
                                                margin: 10,
                                            }}
                                            dashed
                                            type="horizontal"
                                        ></Divider>
                                    </Flex>
                                    <Flex
                                        style={{ width: "100%" }}
                                        justify="center"
                                        align="center"
                                    >
                                        <Form.Item
                                            name={"dateBirth"}
                                            style={{ width: "50%" }}
                                        >
                                            <DatePicker
                                                locale={locale}
                                                format={"D MMMM, YYYY"}
                                                maxDate={dayjs(
                                                    new Date().setFullYear(
                                                        new Date().getFullYear() -
                                                            12
                                                    )
                                                )}
                                                onChange={(date) => {
                                                    setDateBirth(
                                                        date.toDate().toString()
                                                    );
                                                }}
                                                value={
                                                    !dateBirth
                                                        ? null
                                                        : dayjs(dateBirth)
                                                }
                                                style={{ width: "100%" }}
                                                placeholder="Укажите вашу дату рождения"
                                            ></DatePicker>
                                        </Form.Item>
                                    </Flex>
                                </Card>
                                <Flex justify="center" align="center">
                                    <Button
                                        htmlType="submit"
                                        onClick={() => setCurrent(2)}
                                        type="primary"
                                        style={{
                                            margin: 15,

                                            borderRadius: 5,
                                        }}
                                    >
                                        Перейти к завершению <RightOutlined />
                                    </Button>
                                </Flex>
                            </Flex>
                        )}
                    </Form>
                    {current === 2 && (
                        <Result
                            title="Мы почти закончили!"
                            subTitle="Пожалуйста, проверьте введеные данные и подтвердите регистрацию!"
                            extra={
                                <Button
                                    onClick={createNewAccount}
                                    type="primary"
                                    htmlType="submit"
                                >
                                    Зарегестрироваться
                                </Button>
                            }
                        />
                    )}
                </Card>
                <Space wrap size={[5, 5]}>
                    <Typography.Text>Уже есть аккаунт?</Typography.Text>
                    <Link
                        href={"./"}
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
