"use client";
import { Card, Flex, Form, Typography } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { useState } from "react";
import ConditionalContent from "../components/ConditionalContent";
import PageErrorView from "../components/PageErrorVIew";
import SignFormHeader from "../components/SignFormHeader";
import SignPageConfigProvider from "../components/SignPageConfigProvider";
import MainRegistrationForm from "../components/SingupComponents/MainRegistrationForm";
import OptinalRegistrationForm from "../components/SingupComponents/OptinalRegistrationForm";
import PreviewForm from "../components/SingupComponents/PreviewForm";
import { useUser } from "../components/UserContext";
import { CreateUserRequest } from "../models/user/requests/CreateUserRequest";
import "./style.css";
dayjs.locale("ru");

const { Title, Link } = Typography;

//  Основной компонент SignupPage (страница регистрации)
const SignupPage = () => {
    //  Получаем информацию о текущем пользователе из контекста
    const { user } = useUser();

    //  Получаем экземпляр Form (из Ant Design) для управления формой
    const [form] = Form.useForm();

    //  Состояние для отслеживания текущего шага (этапа) регистрации
    const [current, setCurrent] = useState<number>(0);

    //  Состояние для хранения данных формы регистрации
    const [formData, setFormData] = useState<CreateUserRequest>({
        email: "",
        password: "",
        userName: "",
    });

    //  Получаем функцию для получения значений полей формы
    const { getFieldsValue } = form;

    //  Функция для перехода к следующему шагу (этапу) регистрации
    const handleNext = () => {
        const values = getFieldsValue(); //  Получаем значения полей формы
        setFormData((prevFormData) => ({
            ...prevFormData, //  Сохраняем предыдущие значения
            ...values, //  Обновляем значения новыми значениями
        }));
        setCurrent(current + 1); //  Увеличиваем текущий шаг
    };

    return (
        <ConditionalContent
            condition={user === null ? null : user != null}
            onErrorNode={<PageErrorView text="Вы уже вошли в свой аккаунт" />}
        >
            <Flex className="bg flex-column">
                <title>Series Tracker - Регистрация</title>

                <SignPageConfigProvider>
                    <SignFormHeader
                        text="Уже есть аккаунт?"
                        actionText="Войти"
                        href="/login"
                    />

                    <Flex className="flex-column width-100 form-content">
                        <Title level={4}>
                            Регистрация на{" "}
                            <Link style={{ fontSize: 20 }}>@SeriesTracker</Link>
                        </Title>
                        <Card className="width-100">
                            {current === 0 && (
                                <MainRegistrationForm
                                    form={form}
                                    handleNext={handleNext}
                                />
                            )}
                            {current === 1 && (
                                <OptinalRegistrationForm
                                    form={form}
                                    handleNext={handleNext}
                                    setCurrent={setCurrent}
                                />
                            )}
                            {current === 2 && (
                                <PreviewForm
                                    formData={formData}
                                    handleBack={() => setCurrent(1)}
                                />
                            )}
                        </Card>
                    </Flex>
                </SignPageConfigProvider>
            </Flex>
        </ConditionalContent>
    );
};

export default SignupPage;
