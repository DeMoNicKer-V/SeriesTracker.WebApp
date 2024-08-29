"use client";
import React, { useEffect, useState } from "react";
import {
    CloseOutlined,
    UserOutlined,
    SolutionOutlined,
    RightOutlined,
    LoadingOutlined,
    SmileOutlined,
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
} from "antd";
import { title } from "process";
import ImgCrop from "antd-img-crop";
import Meta from "antd/es/card/Meta";

const App: React.FC = () => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
    const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
        if (newFileList.length) {
            const isJpgOrPng =
                newFileList[0].type === "image/jpeg" ||
                newFileList[0].type === "image/png";
            if (!isJpgOrPng) {
                message.error("You can only upload JPG/PNG file!");
            }
            const isLt2M = newFileList[0].size / 1024 / 1024 < 0.5;
            if (!isLt2M) {
                message.error("Image must smaller than 2MB!");
                return;
            }
        }
        setFileList(newFileList);
    };

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
    const [isActive, setIsActive] = useState({});

    const handleFocus = (name: any) => {
        setIsActive({ [name]: true });
    };

    const handleBlur = (name: any) => {
        setIsActive({ [name]: false });
    };
    const { getFieldError, isFieldTouched } = form;

    /*   const [email, setEmail] = useState<string>();
    var usernameError = getFieldError(["items", 0, "email"]).length > 0;
    useEffect(() => {
        usernameError = getFieldError(["items", 0, "email"]).length > 0;
        console.log(form.getFieldsError(["email"]));
    }, [email]);*/

    const [current, setCurrent] = useState(0);

    const onChangeCurrent = (value: number) => {
        console.log("onChange:", value);
        setCurrent(value);
    };
    const description = "This is a description.";
    return (
        <Flex
            style={{
                flexDirection: "column",
                flex: "auto",
            }}
        >
            <Flex
                style={{
                    flex: "auto",
                    paddingTop: "128px",
                    backgroundColor: "#0c162d",
                    justifyContent: "center",
                    border: "solid 1px #202637",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Steps
                    current={current}
                    onChange={onChangeCurrent}
                    items={[
                        {
                            title: "Step 1",
                            description,
                        },
                        {
                            title: "Step 2",
                            description,
                        },
                        {
                            title: "Step 3",
                            description,
                        },
                    ]}
                />
                {current === 0 && (
                    <Form
                        layout="vertical"
                        form={form}
                        name="requiredForm"
                        style={{ maxWidth: 660, width: "100%" }}
                        autoComplete="off"
                        initialValues={{ items: [{}] }}
                    >
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
                                                <Col span={18}>
                                                    <Form.Item
                                                        name={[
                                                            field.name,
                                                            "email",
                                                        ]}
                                                        label="Эл. почта"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "",
                                                            },
                                                            {
                                                                type: "email",
                                                                message: "",
                                                            },
                                                        ]}
                                                    >
                                                        <Input
                                                            spellCheck={false}
                                                            onFocus={() =>
                                                                handleFocus(
                                                                    "email"
                                                                )
                                                            }
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={6}>
                                                    {isActive.email ? (
                                                        <Form.Item shouldUpdate>
                                                            {() => (
                                                                <Button
                                                                    disabled={
                                                                        !form.isFieldsTouched(
                                                                            true
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
                                                                    onClick={() =>
                                                                        fields.length ===
                                                                            field.key +
                                                                                1 &&
                                                                        fields.length <
                                                                            3
                                                                            ? add()
                                                                            : null
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
                                        field.key === 1 && (
                                            <Row
                                                gutter={[10, 10]}
                                                align={"bottom"}
                                                justify={"center"}
                                            >
                                                <Col span={18}>
                                                    <Form.Item
                                                        name={[
                                                            field.name,
                                                            "passHash",
                                                        ]}
                                                        label="Пароль"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "",
                                                            },
                                                            {
                                                                min: 3,
                                                                message: "",
                                                            },
                                                        ]}
                                                    >
                                                        <Input.Password
                                                            spellCheck={false}
                                                            onFocus={() =>
                                                                handleFocus(
                                                                    "passHash"
                                                                )
                                                            }
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={6}>
                                                    {isActive.passHash ? (
                                                        <Form.Item shouldUpdate>
                                                            {() => (
                                                                <Button
                                                                    disabled={
                                                                        !form.isFieldsTouched(
                                                                            true
                                                                        ) ||
                                                                        getFieldError(
                                                                            [
                                                                                "items",
                                                                                field.name,
                                                                                "passHash",
                                                                            ]
                                                                        )
                                                                            .length >
                                                                            0
                                                                    }
                                                                    onClick={() =>
                                                                        fields.length ===
                                                                            field.key +
                                                                                1 &&
                                                                        fields.length <
                                                                            3
                                                                            ? add()
                                                                            : null
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
                                        field.key === 2 && (
                                            <Row
                                                gutter={[10, 10]}
                                                align={"bottom"}
                                                justify={"center"}
                                            >
                                                <Col span={18}>
                                                    <Form.Item
                                                        name={[
                                                            field.name,
                                                            "nickname",
                                                        ]}
                                                        label="Логин (никнейм)"
                                                        tooltip="Чувствителен к регистру"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "",
                                                            },
                                                            {
                                                                min: 5,
                                                                message: "",
                                                            },
                                                        ]}
                                                    >
                                                        <Input
                                                            spellCheck={false}
                                                            onFocus={() =>
                                                                handleFocus(
                                                                    "nickname"
                                                                )
                                                            }
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={6}>
                                                    {isActive.nickname ? (
                                                        <Form.Item shouldUpdate>
                                                            {() => (
                                                                <Button
                                                                    disabled={
                                                                        !form.isFieldsTouched(
                                                                            true
                                                                        ) ||
                                                                        getFieldError(
                                                                            [
                                                                                "items",
                                                                                field.name,
                                                                                "nickname",
                                                                            ]
                                                                        )
                                                                            .length >
                                                                            0
                                                                    }
                                                                    onClick={() =>
                                                                        fields.length ===
                                                                            field.key +
                                                                                1 &&
                                                                        fields.length <
                                                                            3
                                                                            ? add()
                                                                            : null
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

                        <Form.Item noStyle shouldUpdate>
                            {() => (
                                <Typography>
                                    <pre>
                                        {JSON.stringify(
                                            form.getFieldsValue(),
                                            null,
                                            2
                                        )}
                                    </pre>
                                </Typography>
                            )}
                        </Form.Item>
                    </Form>
                )}
                {current === 1 && (
                    <Form
                        layout="vertical"
                        form={form}
                        name="nonRequiredForm"
                        style={{ maxWidth: 660, width: "100%" }}
                        autoComplete="off"
                    >
                        <Space
                            style={{ justifyContent: "center" }}
                            wrap
                            size={[10, 10]}
                        >
                            <Form.Item>
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
                                                    flexDirection: "column",
                                                    justifyContent: "center",
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
                                        wrapperStyle={{ display: "none" }}
                                        preview={{
                                            visible: previewOpen,
                                            onVisibleChange: (visible) =>
                                                setPreviewOpen(visible),
                                            afterOpenChange: (visible) =>
                                                !visible && setPreviewImage(""),
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
                                <Form.Item>
                                    <Input placeholder="Имя"></Input>
                                </Form.Item>
                                <Form.Item>
                                    <Input placeholder="Фамилия "></Input>
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
                                <Form.Item style={{ width: "50%" }}>
                                    <DatePicker
                                        style={{ width: "100%" }}
                                        placeholder=""
                                    ></DatePicker>
                                </Form.Item>
                            </Flex>
                        </Card>
                        <Flex justify="center" align="center">
                            <Button
                                type="primary"
                                ghost
                                size="large"
                                style={{
                                    margin: 15,
                                    width: "60%",
                                    borderRadius: 5,
                                }}
                            >
                                Перейти к завершению <RightOutlined />
                            </Button>
                        </Flex>
                    </Form>
                )}
            </Flex>
        </Flex>
    );
};

export default App;
