import { Flex, Typography } from "antd";

interface Props {
    gap?: number;
    text: string | any;
    icon: JSX.Element;
    iconPositon?: "start" | "end";
    strong?: boolean;
}

const { Text } = Typography;
const TextIcon = ({
    text,
    icon,
    iconPositon = "start",
    gap = 5,
    strong = false,
}: Props) => {
    return iconPositon === "start" ? (
        <Flex style={{ cursor: "default" }} gap={gap}>
            {icon}
            <Text style={{ fontSize: 12 }} strong={strong}>
                {text}
            </Text>
        </Flex>
    ) : (
        <Flex style={{ cursor: "default" }} gap={gap}>
            <Text style={{ fontSize: 12 }} strong={strong}>
                {text}
            </Text>
            {icon}
        </Flex>
    );
};
export default TextIcon;
