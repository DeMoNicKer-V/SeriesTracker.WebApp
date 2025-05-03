import { Flex } from "antd";
import { EmptyView } from "./EmptyView";
import LinkButton from "./LinkButton";

// Определение интерфейса Props для компонента PageErrorView
interface Props {
    text: string; // Текст ошибки, который будет отображаться
    href?: string; // URL для ссылки кнопки (опционально, по умолчанию "/")
    btnText?: string; // Текст кнопки (опционально, по умолчанию "Вернуться на главную")
}

/**
 * @component PageErrorView
 * @description Компонент для отображения страницы ошибки.
 * Используется для отображения сообщения об ошибке и кнопки для возврата на главную страницу.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const PageErrorView: React.FC<Props> = ({
    text,
    href = "/",
    btnText = "Вернуться на главную",
}: Props): JSX.Element => {
    return (
        <Flex
            gap={10}
            justify="center"
            align="center"
            className="page-error-view flex-column width-height-100"
        >
            <EmptyView text={text} />
            <LinkButton href={href} arrowIcon={"right"} text={btnText} />
        </Flex>
    );
};
export default PageErrorView;
