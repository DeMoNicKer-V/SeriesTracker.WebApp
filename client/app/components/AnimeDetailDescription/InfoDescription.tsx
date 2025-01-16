import { Divider, Space } from "antd";
import TextIcon from "../TextIcon";
import React from "react";
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
        <Space align={"center"} size={size} wrap>
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
