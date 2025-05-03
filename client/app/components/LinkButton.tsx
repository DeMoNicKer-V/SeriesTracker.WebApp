import { Button, Flex } from "antd";
import React from "react";
import { LongLeftArrow } from "../img/LongLeftArrow";
import { LongRightArrow } from "../img/LongRightArrow";
import styles from "./components.module.css";

// Определение интерфейса Props для компонента LinkButton
interface Props {
    text?: string; // Текст кнопки (опционально)
    href: string; // URL, на который ведет ссылка (обязательно)
    iconPosition?: "start" | "end"; // Позиция иконки относительно текста (опционально, по умолчанию "end")
    arrowIcon?: "left" | "right"; // Тип иконки стрелки (опционально, по умолчанию "right")
}

/**
 * @component LinkButton
 * @description Компонент для отображения кнопки-ссылки с иконкой.
 * Используется для создания кнопок, которые ведут на другие страницы или выполняют действия.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const LinkButton: React.FC<Props> = ({
    href,
    text,
    iconPosition = "end",
    arrowIcon = "right",
}: Props): JSX.Element => {
    return (
        <Flex justify="center">
            <Button
                className={styles["link-button"]}
                type="link"
                href={href}
                icon={
                    arrowIcon === "left" ? (
                        <LongLeftArrow />
                    ) : (
                        <LongRightArrow />
                    )
                }
                iconPosition={iconPosition}
            >
                {text}
            </Button>
        </Flex>
    );
};

export default LinkButton;
