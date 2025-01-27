import { Divider, Space } from "antd";
import TextIcon from "../TextIcon";
import React from "react";

import styles from "./component.module.css";
interface DataType {
    icon: JSX.Element;
    text: string;
}

interface Props {
    items: DataType[];
    size?: [number, number];
}

const InfoDescription = ({ items, size = [8, 8] }: Props) => {
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
