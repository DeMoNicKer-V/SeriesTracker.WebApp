import { Button, Flex, Space, Typography } from "antd";
import { LogoIcon } from "../img/LogoIcon";
import { LongRightArrow } from "../img/LongRightArrow";

const { Text, Link } = Typography;

interface Props {
    actionText: string;
    text: string;
    href: string;
}

const SignFormHeader = ({ actionText, text, href }: Props) => {
    return (
        <Flex className="width-100 head" align="center" justify="space-around">
            <Button
                style={{ cursor: "pointer" }}
                href="/shikimori"
                type="link"
                icon={
                    <LogoIcon
                        width={50}
                        height={50}
                        firstColor="white"
                        secondColor="#44a5a6"
                    />
                }
            />

            <Space size={[5, 5]}>
                <Text type="secondary" italic>
                    {text}
                </Text>
                <Link
                    target="_top"
                    href={href}
                    style={{
                        fontWeight: 700,
                    }}
                >
                    <Flex gap={5} justify="center" align="center">
                        {actionText}
                        <LongRightArrow />
                    </Flex>
                </Link>
            </Space>
        </Flex>
    );
};

export default SignFormHeader;
