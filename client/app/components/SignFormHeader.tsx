import { Button, Flex, Space, Typography } from "antd";
import { LogoIcon } from "../img/LogoIcon";
import { LongRightArrow } from "../img/LongRightArrow";

const { Text, Link } = Typography;

// Определение интерфейса Props для компонента SignFormHeader
interface Props {
    actionText: string; // Текст для ссылки на действие (например, "Вход" или "Регистрация")
    text: string; // Основной текст (например, "Уже есть аккаунт?" или "Нет аккаунта?")
    href: string; // URL для ссылки на действие
}

/**
 * @component SignFormHeader
 * @description Компонент для отображения шапки на страницах входа и регистрации.
 * Содержит логотип, основной текст и ссылку на действие.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const SignFormHeader: React.FC<Props> = ({
    actionText,
    text,
    href,
}: Props): JSX.Element => {
    return (
        <Flex className="width-100 head" align="center" justify="space-around">
            <Button
                aria-label="Перейти на главную страницу"
                href="/animes"
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
                <Link strong target="_top" href={href}>
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
