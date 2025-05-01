import { Flex } from "antd";
import { EmptyView } from "./EmptyView";
import LinkButton from "./LinkButton";

interface Props {
    text: string;
    href?: string;
    btnText?: string;
}

const PageErrorView = ({
    text,
    href = "/animes",
    btnText = "Вернуться на главную",
}: Props) => {
    return (
        <Flex
            gap={10}
            justify="center"
            align="center"
            className="flex-column width-height-100"
        >
            <EmptyView text={text} />
            <LinkButton href={href} arrowIcon={"right"} text={btnText} />
        </Flex>
    );
};
export default PageErrorView;
