"use client";
import { register } from "@/app/api/auth";
import { LongLeftArrow } from "@/app/img/LongLeftArrow";
import { CreateUserRequest } from "@/app/models/user/requests/CreateUserRequest";
import { CheckOutlined, UserOutlined } from "@ant-design/icons";
import {
    Avatar,
    Button,
    Checkbox,
    CheckboxProps,
    Collapse,
    DatePicker,
    Divider,
    Flex,
    Form,
    Input,
    Typography,
} from "antd";
import locale from "antd/es/date-picker/locale/ru_RU";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { useState } from "react";
import styles from "./component.module.css";

const { Text, Link } = Typography;
dayjs.locale("ru");

// Определение интерфейса Props для компонента PreviewForm
interface Props {
    formData: CreateUserRequest;
    handleBack: () => void;
}

/**
 * @component PreviewForm
 * @description Форма для просмотра введенных данных и заверешния регистрации.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const PreviewForm: React.FC<Props> = ({
    formData,
    handleBack,
}: Props): JSX.Element => {
    //  Состояние для отображения, согласен ли пользователь с правилами
    const [checked, setChecked] = useState(false);

    //  Состояние для отображения сообщения об ошибке
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    //  Асинхронная функция для создания нового аккаунта (регистрации)
    const createNewAccount = async () => {
        setErrorMessage(null); //  Сбрасываем сообщение об ошибке перед отправкой
        try {
            await register(formData);
            window.location.href = "/login"; //  Перенаправляем пользователя на страницу логина после успешной регистрации
        } catch (error: any) {
            setErrorMessage(error.message);
        }
    };

    //  Функция для обработки изменения состояния чекбокса согласия с правилами
    const onChangeAgreeRules: CheckboxProps["onChange"] = (e) => {
        setChecked(e.target.checked);
    };

    return (
        <Form
            onFinish={() => createNewAccount()}
            name="preview-form"
            spellCheck={false}
            layout="horizontal"
        >
            <Flex
                className={styles["registration-form-preview"]}
                justify="center"
                align="center"
            >
                <Form.Item shouldUpdate>
                    {() => (
                        <Text
                            className={styles["registration-form-error-text"]}
                            type="danger"
                        >
                            {errorMessage}
                        </Text>
                    )}
                </Form.Item>

                <Form.Item noStyle>
                    <Avatar
                        icon={<UserOutlined />}
                        shape="circle"
                        src={formData.avatar}
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
                            <Divider orientation="left">
                                Необязательные данные
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
                                        value={formData.name}
                                        placeholder="не указано"
                                        readOnly
                                        variant="borderless"
                                    />
                                </Form.Item>
                                <Form.Item label={"Фамилия"}>
                                    <Input
                                        value={formData.surName}
                                        placeholder="не указано"
                                        readOnly
                                        variant="borderless"
                                    />
                                </Form.Item>
                                <Form.Item label={"Дата рождения"}>
                                    <DatePicker
                                        value={
                                            formData.dateBirth
                                                ? dayjs(formData.dateBirth)
                                                : null
                                        }
                                        locale={locale}
                                        format={"D MMMM, YYYY"}
                                        suffixIcon={null}
                                        className="width-100"
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
                    Я ознакомлен(а) с{" "}
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
                        className={styles["nav-button"]}
                        icon={<LongLeftArrow />}
                        onClick={() => handleBack()}
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
    );
};

export default PreviewForm;
