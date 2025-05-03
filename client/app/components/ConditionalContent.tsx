import React from "react"; // Обязательный импорт React
import Loading from "./Loading"; // Импорт компонента Loading

// Определение интерфейса Props для компонента ConditionalContent
interface Props {
    condition: boolean | null; // Состояние загрузки/ошибки: null - загрузка, false - успешно, true - ошибка
    children: React.ReactNode; // React-элемент, отображаемый при успешной загрузке (condition === false)
    onErrorNode?: React.ReactNode; // React-элемент, отображаемый при ошибке (condition === true) (опционально, если не указан - ничего не отображается)
}

/**
 * @component ConditionalContent
 * @description Компонент для условного отображения контента в зависимости от состояния загрузки/ошибки.
 * Отображает индикатор загрузки, основной контент или сообщение об ошибке.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element | null}
 */
const ConditionalContent: React.FC<Props> = ({
    condition,
    children,
    onErrorNode,
}) => {
    if (condition === null) {
        // Если состояние null - отображаем индикатор загрузки
        return <Loading loading />;
    }

    // Если состояние false - отображаем основной контент, если true - отображаем контент ошибки
    return condition === false ? children : onErrorNode;
};

export default ConditionalContent;
