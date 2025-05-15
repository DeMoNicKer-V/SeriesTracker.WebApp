import { Space, Tag } from "antd";
import React from "react";
import styles from "./component.module.css";

// Определение интерфейса Props для компонента GenreDescription
interface Props {
    genresList: Genre[]; // Список жанров (обязательно)
    size?: [number, number]; // Размер отступов между жанрами (необязательно, по умолчанию [0, 0])
}

/**
 * @component GenreDescription
 * @description Компонент для отображения списка жанров.
 * Использует Space для автоматического размещения тегов жанров и Tag для отображения каждого жанра.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const GenreDescription: React.FC<Props> = ({
    genresList,
    size = [0, 0],
}): JSX.Element => {
    return (
        <Space
            className={styles["genre-list"]}
            align={"center"}
            size={size}
            wrap
        >
            {genresList.map((item: Genre, index) => (
                <Tag key={`tag-${index}`} className="tag transparent">
                    {item.russian}
                </Tag>
            ))}
        </Space>
    );
};

export default GenreDescription;
