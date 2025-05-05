import { isEmailExists, isUserNameExists } from "@/app/api/auth";
import {
    Button,
    Col,
    Flex,
    Form,
    FormInstance,
    Input,
    Row,
    Typography,
} from "antd";
import React, { useState } from "react";
import styles from "./component.module.css";

const { Text } = Typography;

// Определение интерфейса для значений формы
interface FormValues {
    email: string;
    password: string;
    userName?: string;
    dateBirth?: string;
}

// Определение интерфейса для пропсов компонента
interface Props {
    form: FormInstance<FormValues>; // Экземпляр Form из Ant Design (обязательно)
    handleNext: () => void; // Функция для перехода к следующему шагу (обязательно)
}

/**
 * @component MainRegistrationForm
 * @description Первая форма регистрации (обязательная).
 * Предоставляет поля для ввода email, пароля и имени пользователя.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const MainRegistrationForm: React.FC<Props> = ({
    form,
    handleNext,
}: Props): JSX.Element => {
    const [activeField, setActiveField] = useState<Record<string, boolean>>({
        // Состояние для активности полей (изначально активен только email)
        email: true,
        password: false,
        userName: false,
    });
    const [visibleFields, setVisibleFields] = useState([true]);
    // Получаем функции из form
    const { getFieldError, getFieldValue, isFieldsValidating, focusField } =
        form;

    //Устанавливает поле с указанным именем активным.
    const onFocusField = (name: string) => {
        setActiveField({ [name]: true });
    };

    // Открывает следующее поле формы.
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
                                onFocus={() => onFocusField("email")}
                            />
                        </Form.Item>
                    </Col>
                    <Col sm={5} xs={24}>
                        {activeField.email && (
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
                        )}
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
                                    onFocus={() => onFocusField("password")}
                                />
                            </Form.Item>
                        </Col>
                        <Col sm={5} xs={24}>
                            {activeField.password && (
                                <Form.Item shouldUpdate>
                                    {() => (
                                        <Button
                                            className="width-100"
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
                                            "Длина логина должна быть не менее 3 символов",
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
                                    onFocus={() => onFocusField("userName")}
                                />
                            </Form.Item>
                        </Col>
                        <Col sm={5} xs={24}>
                            {activeField.userName && (
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
                className={styles["registration-form-errors"]}
                shouldUpdate
            >
                {() => (
                    <Text className={styles["registration-form-error-text"]}>
                        {activeField.email && getFieldError("email")}
                        {activeField.password && getFieldError("password")}
                        {activeField.userName && getFieldError("userName")}
                    </Text>
                )}
            </Form.Item>
        </Form>
    );
};

export default MainRegistrationForm;
