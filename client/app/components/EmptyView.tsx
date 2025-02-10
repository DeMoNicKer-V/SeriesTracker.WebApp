import { Flex, Typography } from "antd";

import { InfoCircleOutlined } from "@ant-design/icons";

interface Props {
    text: string;
    iconSize?: number;
    fontSize?: number;
}
export const EmptyView = ({ text, iconSize = 32, fontSize = 22 }: Props) => {
    return (
        <Typography.Text
            style={{
                fontSize: fontSize,
                textAlign: "center",
            }}
        >
            <InfoCircleOutlined
                style={{ fontSize: iconSize, verticalAlign: "bottom" }}
            />{" "}
            {text}
        </Typography.Text>
    );
};
