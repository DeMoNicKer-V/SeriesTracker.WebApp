import { Button, Flex, Space, Tag } from "antd";
import { LongLeftArrow } from "../img/LongLeftArrow";
import { LongRightArrow } from "../img/LongRightArrow";

import { DoubleLeftOutlined } from "@ant-design/icons";

interface Props {
    page: number;
    onFirstButtonCLick: () => void;
    onPrevButtonCLick: () => void;
    onNextButtonCLick: () => void;
    nextButtonDisable: boolean;
}

const PageNavigator = ({
    page,
    onFirstButtonCLick,
    onPrevButtonCLick,
    onNextButtonCLick,
    nextButtonDisable,
}: Props) => {
    return (
        <Flex className="page-navigator" gap={20} justify="space-between">
            <Space>
                <Tag>{page}</Tag>
                <Button
                    size="small"
                    disabled={page === 1}
                    className="navigation-btn"
                    icon={<DoubleLeftOutlined />}
                    style={{ marginRight: "auto" }}
                    type="primary"
                    ghost
                    onClick={onFirstButtonCLick}
                >
                    В начало
                </Button>
            </Space>
            <Space.Compact>
                <Button
                    size="small"
                    disabled={page === 1}
                    className="navigation-btn"
                    icon={<LongLeftArrow />}
                    type="primary"
                    ghost
                    onClick={onPrevButtonCLick}
                >
                    Назад
                </Button>
                <Button
                    disabled={nextButtonDisable}
                    size="small"
                    className="navigation-btn"
                    iconPosition="end"
                    icon={<LongRightArrow />}
                    type="primary"
                    ghost
                    onClick={onNextButtonCLick}
                >
                    Вперед
                </Button>
            </Space.Compact>
        </Flex>
    );
};
export default PageNavigator;
