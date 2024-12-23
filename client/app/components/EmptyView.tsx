import { Flex } from "antd";

import { InfoCircleOutlined } from "@ant-design/icons";

interface Props {
    text: string;
}
export const EmptyView = ({ text }: Props) => {
    return (
        <Flex
            className="emptyview"
            justify="center"
            align="start"
            gap={10}
            style={{ textAlign: "center" }}
        >
            <InfoCircleOutlined style={{ fontSize: 32 }} />
            <span style={{ fontSize: 22 }}>{text}</span>
        </Flex>
    );
};
