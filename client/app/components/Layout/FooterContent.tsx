import { GithubLogo } from "@/app/img/socials/github";
import { TelegramLogo } from "@/app/img/socials/telegram";
import { VKLogo } from "@/app/img/socials/vk";
import { Button, Flex, Space, Typography } from "antd";
import styles from "./component.module.css";

const { Text, Title, Link } = Typography;

// Определение интерфейса Props для компонента FooterContent
interface Props {
    alignItems?: "start" | "center" | "end"; // Выравнивание элементов по вертикали (необязательно, по умолчанию "start")
}

/**
 * @component FooterContent
 * @description Компонент для отображения контента в нижней части сайта (футере).
 * Включает в себя ссылки на социальные сети, информацию об авторских правах и ссылку на сайт-источник данных.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const FooterContent: React.FC<Props> = ({
    alignItems = "start",
}: Props): JSX.Element => {
    return (
        <Flex className="flex-column" align={alignItems}>
            <Title level={4}>Соц. сети</Title>
            <Space size={[10, 10]}>
                <Button
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://vk.com/v_shakov"
                    type="link"
                    icon={<VKLogo size={24} />}
                ></Button>
                <Button
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://github.com/DeMoNicKer-V"
                    type="link"
                    icon={<GithubLogo size={24} />}
                ></Button>
                <Button
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://t.me/Vitek_Dev"
                    type="link"
                    icon={<TelegramLogo size={24} />}
                ></Button>
            </Space>
            <Text className={styles["footer-secondary-text"]}>
                Данный сайт не хранит на своем сервере никаких данных. Весь
                контент на сайте предоставляется сайтом{" "}
                <Link
                    href="https://shikimori.one"
                    target="_blank"
                    className={styles["footer-secondary-text"]}
                >
                    Shikimori.One.
                </Link>
            </Text>
            <Text className={styles["footer-primary-text"]}>
                Copyright ©
                <Link
                    className={styles["footer-primary-text"]}
                    href={"/animes"}
                >
                    Series Tracker
                </Link>
                {` ${new Date().getFullYear()}. `}
                All Rights Reserved.
            </Text>
        </Flex>
    );
};

export default FooterContent;
