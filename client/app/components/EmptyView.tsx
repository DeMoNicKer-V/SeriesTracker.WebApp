import { Flex } from "antd";

import { InfoCircleOutlined } from "@ant-design/icons";

interface Props {
    text: string;
}
export const EmptyView = ({ text }: Props) => {
    return (
        <Flex className="emptyview" justify="center" align="middle" gap={10}>
            <InfoCircleOutlined style={{ fontSize: 32 }} />
            <span style={{ fontSize: 22 }}>{text}</span>
        </Flex>
    );
};
