import { Divider, Space } from "antd";
import React from "react";
import TextIcon from "../TextIcon";
import styles from "./component.module.css";

// Определение интерфейса для элемента списка (DataType)
interface DataType {
    icon: JSX.Element; // Иконка (JSX элемент)
    text: string; // Текст
}

// Определение интерфейса Props для компонента InfoDescription
interface Props {
    items: DataType[]; // Список элементов (обязательно)
    size?: [number, number]; // Размер отступов между элементами (необязательно, по умолчанию [8, 8])
}

/**
 * @component InfoDescription
 * @description Компонент для отображения списка информационных элементов (статус, сезон, кол-во эпизодов и т.д.).
 * Использует Space для размещения элементов и TextIcon для отображения каждого элемента с иконкой и текстом.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const InfoDescription: React.FC<Props> = ({
    items,
    size = [8, 8],
}: Props): JSX.Element => {
    return (
        <Space className={styles["info-list"]} size={size} wrap>
            {items.map((item: DataType, index) => (
                <React.Fragment key={index}>
                    <TextIcon strong text={item.text} icon={item.icon} />
                    {index !== items.length - 1 && <Divider type="vertical" />}
                </React.Fragment>
            ))}
        </Space>
    );
};

export default InfoDescription;
