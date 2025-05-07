import { Flex, Typography } from "antd"; // Импорт компонентов из Ant Design
import React from "react"; // Обязательный импорт React

// Определение интерфейса Props для компонента TextIcon
interface Props {
    gap?: number; // Размер отступа между иконкой и текстом (необязательно, по умолчанию 5)
    text: string | React.ReactNode; // Текст (может быть строкой или React-элементом)
    icon: JSX.Element; // Иконка (JSX элемент)
    iconPositon?: "start" | "end"; // Позиция иконки (необязательно, по умолчанию "start")
    strong?: boolean; // Жирный шрифт (необязательно, по умолчанию false)
}

// Получаем компонент Text из Typography
const { Text } = Typography;

/**
 * @component TextIcon
 * @description Компонент для отображения однострочного текста с иконкой.
 * Позволяет настроить позицию иконки, отступ и стиль текста.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const TextIcon: React.FC<Props> = ({
    text,
    icon,
    iconPositon = "start",
    gap = 5,
    strong = false,
}): JSX.Element => {
    return iconPositon === "start" ? (
        <Flex className="cursor-default" gap={gap}>
            {icon}
            <Text className="secondary-text" strong={strong}>
                {text}
            </Text>
        </Flex>
    ) : (
        <Flex className="cursor-default" gap={gap}>
            <Text className="secondary-text" strong={strong}>
                {text}
            </Text>
            {icon}
        </Flex>
    );
};
export default TextIcon;
