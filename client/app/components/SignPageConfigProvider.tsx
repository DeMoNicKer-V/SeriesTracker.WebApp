import { ConfigProvider } from "antd"; // Импорт компонента ConfigProvider из Ant Design
import React from "react"; // Обязательный импорт React

// Определение интерфейса Props для компонента SignPageConfigProvider
interface Props {
    children: React.ReactNode; // React-элементы, которые будут обернуты ConfigProvider'ом
}

/**
 * @component SignPageConfigProvider
 * @description Компонент для предоставления общих стилей для компонентов Ant Design на страницах входа и регистрации.
 * Использует ConfigProvider для настройки темы Ant Design и применяется ко всем дочерним элементам.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const SignPageConfigProvider: React.FC<Props> = ({
    children,
}: Props): JSX.Element => {
    return (
        <ConfigProvider
            theme={{
                components: {
                    Collapse: {
                        contentPadding: 0, // Убираем отступы внутри контента Collapse
                        headerPadding: "0 0 24px 0", // Настраиваем отступы для заголовка Collapse
                        boxShadow: "none !important", // Убираем тени у Collapse
                    },
                    Typography: {
                        colorLink: "#44a5a6", // Цвет ссылок
                        colorLinkHover: "#44a5a661", // Цвет ссылок при наведении
                        fontSize: 16, // Размер шрифта
                    },
                    Card: {
                        colorBgContainer: "#0b3c3c61", // Цвет фона контейнера
                        colorBorderSecondary: "#0b3c3c", // Цвет вторичной границы
                        bodyPadding: 24, // Отступы внутри Card
                    },
                    Input: {
                        activeBg: "transparent", // Цвет фона при активации
                        colorBgContainer: "transparent", // Цвет фона контейнера
                        fontSize: 16, // Размер шрифта
                        colorBorder: "#084949", // Цвет границы
                    },
                    Form: {
                        labelFontSize: 16, // Размер шрифта меток
                        labelColor: "#44a5a6", // Цвет меток
                        labelRequiredMarkColor: "#44a5a6", // Цвет обязательных меток
                        colorSuccess: "#44a5a6", // Цвет успеха
                    },
                    DatePicker: {
                        colorBgElevated: "#123535", // Цвет фона приподнятых элементов
                        fontSize: 16, // Размер шрифта
                    },
                    Button: { colorBorder: "#084949" }, // Цвет границы кнопок
                    Tooltip: {
                        colorBgSpotlight: "#123535", // Цвет фона подсказок
                    },
                    Divider: {
                        margin: 0, // Убираем отступы у разделителей
                    },
                },
            }}
        >
            {/* Дочерние элементы, к которым применяются стили */}
            {children}
        </ConfigProvider>
    );
};

export default SignPageConfigProvider;
