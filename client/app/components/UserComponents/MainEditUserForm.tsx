import { isEmailExists, isUserNameExists, verify } from "@/app/api/auth";
import { updateUser } from "@/app/api/user/editUser";
import SecondaryEditUserForm from "@/app/components/UserComponents/SecondaryEditUserForm";
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
dayjs.locale("ru");

interface Props {
    messageApi: NotificationInstance;
    user?: User;
}
const MainEditUserForm = ({ messageApi, user }: Props) => {
    const [visibleFields, setVisibleFields] = useState({
        email: false,
        password: false,
    });

    const handleSwitchFields = (
        fieldNames: ("email" | "password")[],
        dest: boolean
    ) => {
        setVisibleFields((prev) => {
            const newState = { ...prev };
            fieldNames.forEach((field) => {
                newState[field] = dest;
            });
            return newState;
        });
    };

    const router = useRouter();
    const onFinish = async (values: any) => {
        if (!user) {
            return;
        }
        const UserRequest = {
            userName: values["userName"],
            name: values["name"],
            surName: values["surName"],
            email: values["newEmail"],
            password: values["newPassword"],
            avatar: values["avatar"],
            dateBirth: values["dateBirth"],
        };
        try {
            await updateUser(user.userName, UserRequest);
            messageApi.success({
                type: "success",
                message: "Профиль успешно обновлен!",
                onClose: () =>
                    (window.location.href = `../${values["userName"]}`),
                showProgress: true,
            });
        } catch (error: any) {
            messageApi.error({
                message: "Не удалось обновить данные",
                description: error.message,
            });
        }
    };
    const [form] = Form.useForm();
    const { isFieldsValidating, setFieldsValue } = form;

    useEffect(() => {
        setFieldsValue(user);
    }, []);

    return (
        <Form
            style={{ maxWidth: 600 }}
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
            <SecondaryEditUserForm previewFile={user?.avatar} />

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
                            style={{ width: "100%" }}
                            label={"Новая эл. почта"}
                            name={"newEmail"}
                            rules={[
                                {
                                    type: "email",
                                    message:
                                        "Эл. почта имеет некорректную сигнатуру",
                                },
                                {
                                    validator: async (_, value) => {
                                        if (!value || value === user?.email) {
                                            return Promise.resolve();
                                        }
                                        try {
                                            await isEmailExists(value);
                                        } catch (error: any) {
                                            return Promise.reject(error);
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
                                    style={{
                                        width: "100%",
                                    }}
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
                                                    return Promise.resolve(); // Возвращаем Promise.resolve(), если поле пустое
                                                }
                                                // Проверка на стороне сервера

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
                                    style={{
                                        width: "100%",
                                    }}
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
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
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
                                style={{
                                    marginTop: 15,
                                }}
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
                    style={{
                        opacity: 0.75,
                        fontSize: 12,
                    }}
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
                            style={{
                                opacity: 0.75,
                                fontSize: 12,
                            }}
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

export default MainEditUserForm;
