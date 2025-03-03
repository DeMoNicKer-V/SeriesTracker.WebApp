import { Flex, Space, Typography } from "antd";

import { InfoCircleOutlined } from "@ant-design/icons";

interface Props {
    text: string;
    iconSize?: number;
    fontSize?: number;
}
export const EmptyView = ({ text, iconSize = 32, fontSize = 22 }: Props) => {
    return (
        <Space wrap style={{ justifyContent: "center", textAlign: "center" }}>
            <InfoCircleOutlined
                style={{ fontSize: iconSize, verticalAlign: "bottom" }}
            />
            <p
                style={{
                    fontSize: fontSize,
                    fontWeight: 500,
                }}
            >
                {text}
            </p>
        </Space>
    );
};
