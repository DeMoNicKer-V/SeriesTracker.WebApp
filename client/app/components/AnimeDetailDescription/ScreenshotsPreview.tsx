import { ConfigProvider, Image, List } from "antd";
import React from "react";

import styles from "./component.module.css";
import { ListGridType } from "antd/es/list";
import LoadAnimateImage from "../LoadAnimateImage";
import { EmptyView } from "../EmptyView";
import LinkButton from "../LinkButton";

interface Props {
    grid?: ListGridType;
    screenshots: Screenshot[];
    maxWidth?: number;
    id?: number;
}
const customizeRenderEmpty = () => (
    <EmptyView text={"Других кадров не найдено"} align={"center"} />
);
const ScreenshotsPreview = ({
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
}: Props) => {
    return (
        <Image.PreviewGroup>
            <ConfigProvider renderEmpty={customizeRenderEmpty}>
                <List
                    loadMore={
                        id > 0 && (
                            <LinkButton
                                href={`${id}/screen`}
                                text={"Посмотреть больше кадров"}
                            />
                        )
                    }
                    className={styles["my-centered-list"]}
                    grid={grid}
                    dataSource={screenshots}
                    renderItem={(item: Screenshot) => (
                        <List.Item className={styles["my-centered-item"]}>
                            <LoadAnimateImage
                                src={item.originalUrl}
                                maxWidth={maxWidth}
                                aspectRatio="12/7"
                                prev={true}
                            />
                        </List.Item>
                    )}
                />
            </ConfigProvider>
        </Image.PreviewGroup>
    );
};
export default ScreenshotsPreview;
