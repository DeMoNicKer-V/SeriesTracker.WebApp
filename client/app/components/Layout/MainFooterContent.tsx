import { GithubLogo } from "@/app/img/socials/github";
import { TelegramLogo } from "@/app/img/socials/telegram";
import { VKLogo } from "@/app/img/socials/vk";
import { Button, Divider, Flex, Space, Typography } from "antd";
import { Footer } from "antd/es/layout/layout";

interface Props {
    alignItems?: "start" | "center" | "end";
}
const MainFooterContent = ({ alignItems = "start" }: Props) => {
    const { Text, Title } = Typography;
    return (
        <Flex className="flex-column" align={alignItems}>
            <Title level={4}>Соц. сети</Title>
            <Space size={[10, 10]}>
                <Button
                    target="_blank"
                    href="https://vk.com/v_shakov"
                    type="link"
                    icon={<VKLogo size={24} />}
                ></Button>
                <Button
                    target="_blank"
                    href="https://github.com/DeMoNicKer-V"
                    type="link"
                    icon={<GithubLogo size={24} />}
                ></Button>
                <Button
                    target="_blank"
                    href="https://t.me/Vitek_Dev"
                    type="link"
                    icon={<TelegramLogo size={24} />}
                ></Button>
            </Space>
            <Text style={{ fontSize: 11 }} type="secondary">
                Данный сайт не хранит на своем сервере никаких данных. Весь
                контент на сайте предоставляется сайтом{" "}
                <Typography.Link
                    href="https://shikimori.one"
                    target="_blank"
                    style={{ fontSize: 11 }}
                    type="secondary"
                >
                    Shikimori.One.
                </Typography.Link>
            </Text>
            <Text strong style={{ fontSize: 15 }}>
                Copyright ©
                <Typography.Link
                    style={{ fontSize: 15 }}
                    className="info"
                    strong
                    href={"/shikimori"}
                >
                    Series Tracker
                </Typography.Link>
                {` ${new Date().getFullYear()}. `}
                All Rights Reserved.
            </Text>
        </Flex>
    );
};

export default MainFooterContent;
