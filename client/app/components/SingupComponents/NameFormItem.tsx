import { Form, Input } from "antd";
import React from "react";

// Определение интерфейса Props для компонента NameFormItem
interface Props {
    label: string; // Метка поля (отображается рядом с полем ввода) (обязательно)
    name: string; // Имя поля (используется для связывания поля с формой) (обязательно)
}

/**
 * @component NameFormItem
 * @description Компонент для отображения поля ввода имени или фамилии.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const NameFormItem: React.FC<Props> = ({ label, name }: Props): JSX.Element => {
    return (
        <Form.Item
            validateFirst // Валидировать поля по очереди (при первой ошибке останавливаем валидацию)
            rules={[
                {
                    min: 3, // Минимальная длина строки
                    message: "Длина слишком короткая",
                },
                {
                    max: 15, // Максимальная длина строки
                    message: "Длина не может превышать 15 символов",
                },
                {
                    pattern: new RegExp("^[a-zA-Zа-яА-Я]+$"), // Регулярное выражение для проверки отсутствия спец. символов и пробелов
                    message: `${label} не может включать в себя спец. символы и пробел`,
                },
            ]}
            name={name} // Имя поля
        >
            <Input
                maxLength={15}
                spellCheck={"false"}
                autoComplete="off"
                variant="filled"
                placeholder={label}
            ></Input>
        </Form.Item>
    );
};

export default NameFormItem;
