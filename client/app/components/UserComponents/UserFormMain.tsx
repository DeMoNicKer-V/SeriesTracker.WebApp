import { isEmailExists, isUserNameExists, verify } from "@/app/api/auth";
import { updateUser } from "@/app/api/user/editUser";
import UserFormOptional from "@/app/components/UserComponents/UserFormOptional";
import { LongLeftArrow } from "@/app/img/LongLeftArrow";
import {
    CheckOutlined,
    CloseOutlined,
    EditOutlined,
    KeyOutlined,
    MinusCircleOutlined,
    QuestionCircleOutlined,
} from "@ant-design/icons";
import { Button, Card, Divider, Flex, Form, Input, Tooltip } from "antd";
import { NotificationInstance } from "antd/es/notification/interface";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./component.module.css";
dayjs.locale("ru");

// Определение интерфейса Props для компонента UserFormMain
interface Props {
    messageApi: NotificationInstance; // Объект messageApi для отображения уведомлений
    user?: User; // Объект пользователя
}
interface FormValues {
    userName: string;
    name: string;
    surName: string;
    email: string;
    newEmail?: string;
    password?: string;
    newPassword?: string;
    avatar: string;
    dateBirth: string;
}
/**
 * @component UserFormMain
 * @description Компонент для отображения формы редактирования данных пользователя.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const UserFormMain: React.FC<Props> = ({ messageApi, user }): JSX.Element => {
    const router = useRouter();
    const [form] = Form.useForm<FormValues>(); // Создаем экземпляр Form
    const { isFieldsValidating, setFieldsValue } = form; // Получаем функции из form

    const [visibleFields, setVisibleFields] = useState({
        // Состояние для видимости полей email и password (изначально скрыты)
        email: false,
        password: false,
    });

    //     Переключает видимость указанных полей формы (email или password).
    const handleSwitchFields = (
        fieldNames: ("email" | "password")[],
        dest: boolean
    ) => {
        setVisibleFields((prev) => {
            // Обновляем состояние видимости полей
            const newState = { ...prev };
            fieldNames.forEach((field) => {
                newState[field] = dest;
            });
            return newState;
        });
    };

    //Обработчик отправки формы.
    // Собирает данные из формы, создает объект CreateUserRequest и отправляет запрос на сервер для обновления данных пользователя.

    const onFinish = async (values: FormValues): Promise<void> => {
        if (!user) {
            // Если объект пользователя не передан, выходим из функции
            return;
        }

        const CreateUserRequest = {
            // Создаем объект запроса
            userName: values.userName,
            name: values.name,
            surName: values.surName,
            email: values.newEmail || user.email, // Если поле newEmail не заполнено, используем email из объекта user
            password: values.newPassword,
            avatar: values.avatar,
            dateBirth: values.dateBirth,
        };

        try {
            await updateUser(user.userName, CreateUserRequest); // Отправляем запрос на сервер

            messageApi.success({
                type: "success",
                message: "Профиль успешно обновлен!",
                onClose: () => (window.location.href = `../${values.userName}`),
                showProgress: true,
            });
        } catch (error: any) {
            console.error("Ошибка при обновлении профиля:", error); // Логируем ошибку
            messageApi.error({
                message: "Не удалось обновить данные",
                description:
                    error.response?.data?.message ||
                    "Произошла неизвестная ошибка.", // Пытаемся получить сообщение об ошибке с сервера
            });
        }
    };

    useEffect(() => {
        // Заполняем форму данными пользователя при монтировании компонента
        if (user) {
            setFieldsValue(user);
        }
    }, [user, setFieldsValue]);

    return (
        <Form
            className={styles["user-edit-form"]}
            spellCheck={false}
            layout="vertical"
            onFinish={onFinish}
            form={form}
        >
            <Form.Item
                validateDebounce={1500}
                hasFeedback
                className="width-100"
                name={"userName"}
                rules={[
                    {
                        validator: async (_, value) => {
                            if (!value || value === user?.userName) {
                                return Promise.resolve();
                            }
                            try {
                                await isUserNameExists(value);
                            } catch (error: any) {
                                return Promise.reject(error);
                            }
                        },
                    },
                    {
                        required: true,
                        message: "Никнейм не может быть пустым",
                    },
                ]}
            >
                <Input
                    addonAfter={
                        <Tooltip title="Чувствителен к регистру">
                            <QuestionCircleOutlined />
                        </Tooltip>
                    }
                    addonBefore="Никнейм"
                />
            </Form.Item>
            <Divider>{user?.email}</Divider>
            <UserFormOptional previewFile={user?.avatar} />

            <Flex className="flex-column">
                {visibleFields["email"] && (
                    <Card
                        className="main-user-info"
                        size="small"
                        extra={
                            <CloseOutlined
                                onClick={() =>
                                    handleSwitchFields(
                                        ["email", "password"],
                                        false
                                    )
                                }
                            />
                        }
                    >
                        <Form.Item
                            validateDebounce={1500}
                            hasFeedback
                            className="width-100"
                            label={"Новая эл. почта"}
                            name={"newEmail"}
                            rules={[
                                {
                                    required: true,
                                    message: "Пожалуйста, введите email!", //  Более понятное сообщение
                                },
                                {
                                    type: "email",
                                    message:
                                        "Пожалуйста, введите корректный email!", //  Более понятное сообщение
                                },
                                {
                                    validator: async (_, value) => {
                                        if (!value) {
                                            return Promise.reject(
                                                "Пожалуйста, введите email!"
                                            ); // Обязательное поле
                                        }
                                        try {
                                            await isEmailExists(value); //  Вызываем isEmailExists
                                            return Promise.resolve(); // Email не существует, все хорошо
                                        } catch (error: any) {
                                            return Promise.reject(
                                                error?.message ||
                                                    "Этот email уже зарегистрирован!"
                                            ); // Email уже существует, возвращаем ошибку
                                        }
                                    },
                                },
                            ]}
                        >
                            <Input placeholder="Введите новый адрес" />
                        </Form.Item>
                        {visibleFields["password"] ? (
                            <Flex className="flex-column">
                                <Form.Item
                                    validateDebounce={1500}
                                    hasFeedback
                                    className="width-100"
                                    label={"Старый пароль"}
                                    name={["oldPassword"]}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Вы дожны подтвердить свой пароль.",
                                        },
                                        {
                                            validator: async (_, value) => {
                                                if (!value) {
                                                    // Проверка на пустоту
                                                    return Promise.resolve();
                                                }
                                                await verify(
                                                    user?.email,
                                                    value
                                                );
                                            },
                                        },
                                    ]}
                                >
                                    <Input.Password placeholder="Введите старый пароль" />
                                </Form.Item>
                                <Form.Item
                                    validateDebounce={1500}
                                    hasFeedback
                                    className="width-100"
                                    label={"Новый пароль"}
                                    name={["newPassword"]}
                                    rules={[
                                        {
                                            pattern: new RegExp(
                                                "^(?=.*[A-Z]|[А-Я])(?=.*).{8,}$|.{15,}$"
                                            ),
                                            message:
                                                "Убедитесь, что пароль содержит не менее 15 символов или не менее 8 символов, включая цифру и строчную букву.",
                                        },
                                    ]}
                                >
                                    <Input.Password placeholder="Введите новый пароль" />
                                </Form.Item>
                                <Form.Item
                                    className={
                                        styles["user-edit-form-passwords"]
                                    }
                                >
                                    <MinusCircleOutlined
                                        onClick={() =>
                                            handleSwitchFields(
                                                ["password"],
                                                false
                                            )
                                        }
                                    />
                                </Form.Item>
                            </Flex>
                        ) : (
                            <Form.Item
                                className={styles["user-edit-form-change-btn"]}
                            >
                                <Button
                                    type="text"
                                    onClick={() =>
                                        handleSwitchFields(["password"], true)
                                    }
                                    block
                                    icon={<KeyOutlined />}
                                >
                                    Изменить пароль
                                </Button>
                            </Form.Item>
                        )}
                    </Card>
                )}
                {!visibleFields["email"] && (
                    <Form.Item>
                        <Button
                            onClick={() => handleSwitchFields(["email"], true)}
                            type="text"
                            block
                            icon={<EditOutlined />}
                        >
                            Изменить email и/или пароль
                        </Button>
                    </Form.Item>
                )}
            </Flex>

            <Divider />
            <Flex gap={10} justify="space-between">
                <Button
                    className={styles["nav-button"]}
                    icon={<LongLeftArrow />}
                    onClick={() => router.back()}
                    type="link"
                >
                    Назад
                </Button>

                <Form.Item shouldUpdate>
                    {() => (
                        <Button
                            disabled={isFieldsValidating()}
                            htmlType="submit"
                            type="link"
                            className={styles["nav-button"]}
                            iconPosition="end"
                            icon={<CheckOutlined />}
                        >
                            Подтвердить изменения
                        </Button>
                    )}
                </Form.Item>
            </Flex>
        </Form>
    );
};

export default UserFormMain;
