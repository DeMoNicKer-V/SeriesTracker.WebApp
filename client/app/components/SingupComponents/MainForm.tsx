import React, { useState } from "react";
import {
    Button,
    Col,
    Flex,
    Form,
    Input,
    Row,
    Typography,
    FormInstance,
} from "antd";
import { isEmailExists, isUserNameExists } from "@/app/api/auth";

const { Text } = Typography;

interface Props {
    form: FormInstance<any>;
    handleNext: () => void;
}
const MainForm = ({ form, handleNext }: Props) => {
    const [visibleFields, setVisibleFields] = useState([true]);

    const [isActive, setIsActive] = useState<Record<string, boolean>>({
        email: true,
        password: false,
        userName: false,
    });

    const { getFieldError, getFieldValue, isFieldsValidating, focusField } =
        form;

    const handleFocus = (name: string) => {
        setIsActive({ [name]: true });
    };

    const handleNextField = (index: number) => {
        setVisibleFields((prevVisibleFields) => {
            const nextVisibleFields = [...prevVisibleFields];
            nextVisibleFields[index + 1] = true;
            return nextVisibleFields;
        });
    };

    return (
        <Form
            layout="vertical"
            form={form}
            name="registration-form-main"
            className="width-100"
        >
            <Flex className="flex-column">
                <Row gutter={[10, 10]} align={"bottom"} justify={"center"}>
                    <Col sm={19} xs={24}>
                        <Form.Item
                            help={false}
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
                                    validator: async (_, value) => {
                                        try {
                                            await isEmailExists(value);
                                        } catch (error: any) {
                                            return Promise.reject(error);
                                        }
                                    },
                                },
                            ]}
                        >
                            <Input
                                autoComplete="off"
                                spellCheck={false}
                                onFocus={() => handleFocus("email")}
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
                                            !getFieldValue("email") ||
                                            getFieldError("email").length > 0
                                        }
                                        onClick={() => {
                                            handleNextField(0);

                                            focusField("password");
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
                    <Row gutter={[10, 10]} align={"bottom"} justify={"center"}>
                        <Col sm={19} xs={24}>
                            <Form.Item
                                help={false}
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
                                    onFocus={() => handleFocus("password")}
                                />
                            </Form.Item>
                        </Col>
                        <Col sm={5} xs={24}>
                            {isActive.password && (
                                <Form.Item shouldUpdate>
                                    {() => (
                                        <Button
                                            type="primary"
                                            ghost
                                            disabled={
                                                isFieldsValidating() ||
                                                !getFieldValue("password") ||
                                                getFieldError("password")
                                                    .length > 0
                                            }
                                            onClick={() => {
                                                handleNextField(1);

                                                focusField("userName");
                                            }}
                                        >
                                            Продолжить
                                        </Button>
                                    )}
                                </Form.Item>
                            )}
                        </Col>
                    </Row>
                )}

                {visibleFields[2] && (
                    <Row gutter={[10, 10]} align={"bottom"} justify={"center"}>
                        <Col sm={19} xs={24}>
                            <Form.Item
                                help={false}
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
                                        max: 16,
                                        message:
                                            "Длина логина не должна превышать 16 символов",
                                    },
                                    {
                                        pattern: new RegExp(
                                            "^[a-zA-Zа-яА-Я0-9]+$"
                                        ),
                                        message:
                                            "Логин не должен включать в себя спец. символы и пробел",
                                    },
                                    {
                                        validator: async (_, value) => {
                                            try {
                                                await isUserNameExists(value);
                                            } catch (error: any) {
                                                return Promise.reject(error);
                                            }
                                        },
                                    },
                                ]}
                            >
                                <Input
                                    autoComplete="off"
                                    autoFocus
                                    spellCheck={false}
                                    onFocus={() => handleFocus("userName")}
                                />
                            </Form.Item>
                        </Col>
                        <Col sm={5} xs={24}>
                            {isActive.userName && (
                                <Form.Item shouldUpdate>
                                    {() => (
                                        <Button
                                            onClick={handleNext}
                                            type="primary"
                                            ghost
                                            className="width-100"
                                            disabled={
                                                !getFieldValue("userName") ||
                                                getFieldError("userName")
                                                    .length > 0 ||
                                                isFieldsValidating()
                                            }
                                        >
                                            Продолжить
                                        </Button>
                                    )}
                                </Form.Item>
                            )}
                        </Col>
                    </Row>
                )}
            </Flex>

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
                        {isActive.email && getFieldError("email")}
                        {isActive.password && getFieldError("password")}
                        {isActive.userName && getFieldError("userName")}
                    </Text>
                )}
            </Form.Item>
        </Form>
    );
};

export default MainForm;
