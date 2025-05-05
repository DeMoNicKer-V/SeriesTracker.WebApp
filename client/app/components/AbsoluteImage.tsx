import styles from "./components.module.css";

import React from "react";

// Определение интерфейса Props для компонента AbsoluteImage
interface Props {
    src: string; // URL изображения (обязательно)
    zIndex: number; // z-index элемента (обязательно)
    children?: React.ReactNode; // Дочерние элементы (опционально)
    filter?: boolean; // Применять ли CSS-фильтр для изображения (опционально)
}

/**
 * @component AbsoluteImage
 * @description Компонент для отображения изображения в качестве абсолютного "задника".
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
export const AbsoluteImage: React.FC<Props> = ({
    src,
    zIndex,
    children,
    filter = false,
}): JSX.Element => {
    return (
        <div
            className={`${styles["absolute-image"]} ${
                filter ? styles["absolute-image-filter"] : ""
            }`}
            style={{
                backgroundImage: `url(${src})`,
                zIndex: zIndex,
            }}
        >
            {children}
        </div>
    );
};

export default AbsoluteImage;
