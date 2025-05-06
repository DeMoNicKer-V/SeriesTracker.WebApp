import { InfoCircleOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";
import React from "react";
import styles from "./components.module.css";
const { Text } = Typography;

// Определение интерфейса Props для компонента EmptyView
interface Props {
    text: string; // Текст для отображения (обязательно)
    iconSize?: number; // Размер иконки (опционально, по умолчанию 32px)
    fontSize?: number; // Размер текста (опционально, по умолчанию 22px)
}

/**
 * @component EmptyView
 * @description Компонент для отображения сообщения о пустом состоянии (например, когда нет элементов в списке).
 * Используется для улучшения UX, когда необходимо сообщить пользователю, что данные отсутствуют.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
export const EmptyView: React.FC<Props> = ({
    text,
    iconSize = 32,
    fontSize = 22,
}: Props): JSX.Element => {
    return (
        <Space wrap className={styles["empty-view"]}>
            <InfoCircleOutlined
                className={styles["empty-view-icon"]}
                style={{ fontSize: iconSize }}
            />
            <Text
                strong
                style={{
                    fontSize: fontSize,
                }}
            >
                {text}
            </Text>
        </Space>
    );
};

export default EmptyView;
