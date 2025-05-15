import { Screenshot } from "@/app/models/anime/Screenshot";
import { ConfigProvider, Image, List } from "antd";
import { ListGridType } from "antd/es/list";
import React from "react";
import { EmptyView } from "../EmptyView";
import LinkButton from "../LinkButton";
import LoadAnimateImage from "../LoadAnimateImage";
import styles from "./component.module.css";

// Определение интерфейса Props для компонента ScreenshotsPreview
interface Props {
    grid?: ListGridType; // Параметры сетки для отображения скриншотов (необязательно)
    screenshots: Screenshot[]; // Список скриншотов (обязательно)
    maxWidth?: number; // Максимальная ширина скриншота (необязательно, по умолчанию 280)
    id?: number; // ID аниме (необязательно, по умолчанию 0)
}

/**
 * @component ScreenshotsPreview
 * @description Компонент для отображения превью списка скриншотов.
 * Использует ConfigProvider для настройки отображения пустого списка, Image.PreviewGroup для предпросмотра изображений,
 * List для отображения списка скриншотов и LinkButton для перехода к полному списку скриншотов.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const ScreenshotsPreview: React.FC<Props> = ({
    screenshots,
    grid = {
        gutter: 15,
        xs: 1,
        sm: 2,
        md: 2,
        lg: 4,
        xl: 4,
        xxl: 4,
    },
    maxWidth = 280,
    id = 0,
}: Props): JSX.Element => {
    return (
        <ConfigProvider
            renderEmpty={() => <EmptyView text={"Других кадров не найдено"} />}
        >
            <Image.PreviewGroup>
                <List
                    className={styles["my-centered-list"]}
                    grid={grid}
                    dataSource={screenshots}
                    renderItem={(item: Screenshot) => (
                        <List.Item
                            key={item.id}
                            className={styles["my-centered-item"]}
                        >
                            <LoadAnimateImage
                                src={item.originalUrl}
                                maxWidth={maxWidth}
                                aspectRatio="12/7"
                                preview={true}
                                alt={`screen-${item.id}`}
                            />
                        </List.Item>
                    )}
                />
            </Image.PreviewGroup>
            {id > 0 && (
                <LinkButton
                    href={`${id}/screen`}
                    text={"Посмотреть больше кадров"}
                />
            )}
        </ConfigProvider>
    );
};
export default ScreenshotsPreview;
