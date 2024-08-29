"use client";
import React, { useEffect, useState } from "react";
import {
    CloseOutlined,
    UserOutlined,
    SolutionOutlined,
    LoadingOutlined,
    SmileOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Flex,
    Form,
    Input,
    Row,
    Space,
    Steps,
    Typography,
} from "antd";
import { title } from "process";

const App: React.FC = () => {
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
                <Form
                    layout="vertical"
                    form={form}
                    name="dynamic_form_complex"
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
                                                    name={[field.name, "email"]}
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
                                                            handleFocus("email")
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
                                                                    ).length > 0
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
                                                                    ).length > 0
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
                                                                    ).length > 0
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
            </Flex>
        </Flex>
    );
};

export default App;
