import { Flex, Typography } from "antd";
import React from "react";
import styles from "./component.module.css";

const { Text, Title, Paragraph } = Typography;

// Определение интерфейса Props для компонента ShortInfo
interface Props {
    title?: string; // Заголовок (обязательно)
    subTitle?: string; // Подзаголовок (обязательно)
    strongSubTitle?: boolean; // Сделать подзаголовок жирным (необязательно, по умолчанию false)
    description?: string; // Описание (обязательно)
    descriptionColor?: string; // Цвет описания (необязательно)
    showDescription?: boolean; // Показывать описание (необязательно, по умолчанию false)
    descriptionPrefix?: string; // Префикс для описания (необязательно, по умолчанию "Описание:")
    children?: React.ReactNode; // Дочерние элементы (необязательно)
}

/**
 * @component ShortInfo
 * @description Компонент для отображения краткой информации.
 * Используется для отображения заголовка, подзаголовка и описания.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const ShortInfo: React.FC<Props> = ({
    title,
    subTitle,
    strongSubTitle = false,
    description,
    descriptionColor,
    showDescription = false,
    descriptionPrefix = "Описание:",
    children,
}): JSX.Element => {
    return (
        <Flex className="flex-column">
            <Title className={`${styles.trimText} ${styles.title}`} level={5}>
                {title}
            </Title>
            <Text
                className={`${styles.trimText} ${styles.subTitle}`}
                strong={strongSubTitle}
                italic
                type="secondary"
            >
                {subTitle}
            </Text>

            {/* Отображаем описание, если showDescription === true */}
            {showDescription && (
                <Paragraph
                    style={{ color: descriptionColor }} //  Устанавливаем цвет описания
                    className={`${styles.trimText} ${styles.description}`}
                >
                    <Text strong type="secondary">
                        {descriptionPrefix}{" "}
                    </Text>
                    {!description ? "отсутствует" : description}
                </Paragraph>
            )}
            {/* Отображаем дочерние элементы */}
            {children}
        </Flex>
    );
};

export default ShortInfo;
