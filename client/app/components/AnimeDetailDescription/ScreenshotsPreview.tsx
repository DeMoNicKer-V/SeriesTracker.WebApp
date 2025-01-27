import { Divider, Flex, Space, Image, List } from "antd";
import TextIcon from "../TextIcon";
import React from "react";

import styles from "./component.module.css";
import { ListGridType } from "antd/es/list";

interface Props {
    grid?: ListGridType;
    screenshots: Screenshot[];
    maxWidth?: number;
}

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
}: Props) => {
    return (
        <Image.PreviewGroup>
            <List
                className={styles["my-centered-list"]}
                grid={grid}
                dataSource={screenshots}
                renderItem={(item: Screenshot) => (
                    <List.Item className={styles["my-centered-item"]}>
                        <Image
                            src={item.originalUrl}
                            style={{
                                maxWidth: maxWidth,
                            }}
                            preview={{
                                mask: "Посмотреть",
                            }}
                        />
                    </List.Item>
                )}
            />
        </Image.PreviewGroup>
    );
};
export default ScreenshotsPreview;
