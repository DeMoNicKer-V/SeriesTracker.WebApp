import React, { useEffect } from "react";
import {
    QuestionCircleOutlined,
    MinusCircleOutlined,
    EditOutlined,
    CloseOutlined,
    KeyOutlined,
    CheckOutlined,
} from "@ant-design/icons";
import { Button, Card, Flex, Form, Input, Divider, Tooltip } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { useRouter } from "next/navigation";
import SecondaryEditUserForm from "@/app/components/UserComponents/SecondaryEditUserForm";
import { LongLeftArrow } from "@/app/img/LongLeftArrow";
import { MessageInstance } from "antd/es/message/interface";
import {
    defaultUserValues,
    MainUserInfo,
} from "@/app/Models/User/MainUserInfo";
import { isEmailExists, isUserNameExists, verify } from "@/app/api/auth";
import { updateUser } from "@/app/api/user/editUser";
dayjs.locale("ru");

interface Props {
    messageApi: MessageInstance;
    user?: MainUserInfo | null;
}
const MainEditUserForm = ({ messageApi, user = defaultUserValues }: Props) => {
    const router = useRouter();
    const onFinish = async (values: any) => {
        const UserRequest = {
            userName: values["userName"],
            name: values["name"],
            surName: values["surName"],
            email: values["emailPassword"]?.[0].email,
            password:
                values["emailPassword"]?.[0].passwordList?.[0].newPassword,
            avatar: values["avatar"],
            dateBirth: values["dateBirth"],
        };
        if (user === null) {
            return;
        }
        const response = await updateUser(user.userName, UserRequest);
        try {
            await updateUser(user.userName, UserRequest); // Вызываем login и ждем результат
            messageApi
                .open({
                    type: "success",
                    content: "Профиль успешно обновлен!",
                    duration: 1.5,
                })
                .then(
                    () => (window.location.href = `../${values["userName"]}`)
                );
        } catch (error: any) {
            messageApi.open({
                type: "error",
                content: `Не удалось обновить пользователя. Ошибка - ${response}`,
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
            style={{ width: 500 }}
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

            <Form.List name="emailPassword">
                {(fields, { add, remove }) => (
                    <Flex className="flex-column">
                        {fields.map((field) => (
                            <Card
                                className="main-user-info"
                                size="small"
                                key={field.key}
                                extra={
                                    <CloseOutlined
                                        onClick={() => {
                                            remove(field.name);
                                        }}
                                    />
                                }
                            >
                                <Form.Item
                                    validateDebounce={1500}
                                    hasFeedback
                                    style={{ width: "100%" }}
                                    label={"Новая эл. почта"}
                                    name={[field.name, "email"]}
                                    rules={[
                                        {
                                            type: "email",
                                            message:
                                                "Эл. почта имеет некорректную сигнатуру",
                                        },
                                        {
                                            validator: async (_, value) => {
                                                if (
                                                    !value ||
                                                    value === user?.email
                                                ) {
                                                    return Promise.resolve();
                                                }
                                                try {
                                                    await isEmailExists(value);
                                                } catch (error: any) {
                                                    return Promise.reject(
                                                        error
                                                    );
                                                }
                                            },
                                        },
                                    ]}
                                >
                                    <Input placeholder="Введите новый адрес" />
                                </Form.Item>

                                <Form.List name={[field.name, "passwordList"]}>
                                    {(subFields, subOpt) => (
                                        <div>
                                            {subFields.map((subField) => (
                                                <Flex className="flex-column">
                                                    <Form.Item
                                                        validateDebounce={1500}
                                                        hasFeedback
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                        label={"Старый пароль"}
                                                        name={[
                                                            subField.name,
                                                            "oldPassword",
                                                        ]}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message:
                                                                    "Вы дожны подтвердить свой пароль.",
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
                                                        name={[
                                                            subField.name,
                                                            "newPassword",
                                                        ]}
                                                        rules={[
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
                                                        <Input.Password placeholder="Введите новый пароль" />
                                                    </Form.Item>
                                                    <Form.Item
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "center",
                                                        }}
                                                    >
                                                        <MinusCircleOutlined
                                                            onClick={() =>
                                                                subOpt.remove(
                                                                    subField.name
                                                                )
                                                            }
                                                        />
                                                    </Form.Item>
                                                </Flex>
                                            ))}
                                            {subFields.length < 1 && (
                                                <Form.Item
                                                    style={{
                                                        marginTop: 15,
                                                    }}
                                                >
                                                    <Button
                                                        type="text"
                                                        onClick={() =>
                                                            subOpt.add()
                                                        }
                                                        block
                                                        icon={<KeyOutlined />}
                                                    >
                                                        Изменить пароль
                                                    </Button>
                                                </Form.Item>
                                            )}
                                        </div>
                                    )}
                                </Form.List>
                            </Card>
                        ))}

                        {fields.length < 1 && (
                            <Form.Item>
                                <Button
                                    type="text"
                                    onClick={() => add()}
                                    block
                                    icon={<EditOutlined />}
                                >
                                    Изменить email и/или пароль
                                </Button>
                            </Form.Item>
                        )}
                    </Flex>
                )}
            </Form.List>

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
