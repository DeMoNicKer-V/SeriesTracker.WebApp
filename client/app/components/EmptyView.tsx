import { Flex } from "antd";

import { InfoCircleOutlined } from "@ant-design/icons";

interface Props {
    text: string;
    iconSize?: number;
    fontSize?: number;
    align?: "start" | "center";
}
export const EmptyView = ({
    text,
    iconSize = 32,
    fontSize = 22,
    align = "start",
}: Props) => {
    return (
        <Flex
            className="emptyview"
            justify="center"
            align={align}
            gap={10}
            style={{ textAlign: "center" }}
        >
            <InfoCircleOutlined style={{ fontSize: iconSize }} />
            <span style={{ fontSize: fontSize }}>{text}</span>
        </Flex>
    );
};
