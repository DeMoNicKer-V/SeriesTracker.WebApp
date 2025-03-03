import { Flex } from "antd";
import React from "react";
import LinkButton from "./LinkButton";
import { EmptyView } from "./EmptyView";

interface Props {
    text: string;
}

const PageErrorView = ({ text }: Props) => {
    return (
        <Flex
            gap={10}
            justify="center"
            align="center"
            className="flex-column absolute-center"
        >
            <EmptyView text={text} />
            <LinkButton
                href="/shikimori"
                arrowIcon={"right"}
                text={"Вернуться на главную"}
            />
        </Flex>
    );
};
export default PageErrorView;
