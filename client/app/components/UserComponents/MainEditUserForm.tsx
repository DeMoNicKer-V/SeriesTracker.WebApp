import React, { useEffect, useState } from "react";
import {
    QuestionCircleOutlined,
    MinusCircleOutlined,
    EditOutlined,
    CloseOutlined,
    KeyOutlined,
    CheckOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Flex,
    Form,
    Input,
    Divider,
    Tooltip,
    ConfigProvider,
} from "antd";
import {
    checkExistEmail,
    defaultUserValues,
    MainUserInfo,
    updateUser,
    verify,
} from "../../services/user";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { useRouter } from "next/navigation";
import SecondaryEditUserForm from "@/app/components/UserComponents/SecondaryEditUserForm";
import { LongLeftArrow } from "@/app/img/LongLeftArrow";
import { MessageInstance } from "antd/es/message/interface";
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
            dateBirth: values["dateBirth"]
                ? values["dateBirth"].format("YYYY-MM-DD").toString()
                : "",
        };
        if (user === null) {
            return;
        }
        const response = await updateUser(user.userName, UserRequest);
        if (response === 200) {
            messageApi
                .open({
                    type: "success",
                    content: "Профиль успешно обновлен!",
                    duration: 1.5,
                })
                .then(() => router.push(`./user/${values["userName"]}`));

            return;
        }
        messageApi.open({
            type: "error",
            content: `Не удалось обновить пользователя. Ошибка - ${response}`,
        });
    };
    const [form] = Form.useForm();
    const { isFieldsValidating, setFieldsValue, setFieldValue } = form;

    useEffect(() => {
        setFieldsValue(user);
        setFieldValue(
            "dateBirth",
            !user?.dateBirth ? null : dayjs(user?.dateBirth)
        );
    }, []);

    return (
        <Form
            style={{ width: 500 }}
            spellCheck={false}
            layout="vertical"
            onFinish={onFinish}
            form={form}
        >
            <Form.Item noStyle className="width-100" name={"userName"}>
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
                                                                        const exists =
                                                                            await verify(
                                                                                {
                                                                                    email: user?.email,
                                                                                    password:
                                                                                        value,
                                                                                }
                                                                            );
                                                                        if (
                                                                            exists
                                                                        ) {
                                                                            return Promise.reject(
                                                                                new Error(
                                                                                    "Неверный пароль"
                                                                                )
                                                                            );
                                                                        }
                                                                        // Разрешить регистрацию, если email уникален
                                                                        return Promise.resolve();
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
