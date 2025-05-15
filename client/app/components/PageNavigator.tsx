import { DoubleLeftOutlined } from "@ant-design/icons";
import { Button, Flex, Skeleton, Space, Tag } from "antd";
import React from "react";
import { LongLeftArrow } from "../img/LongLeftArrow";
import { LongRightArrow } from "../img/LongRightArrow";

// Определение интерфейса Props для компонента PageNavigator
interface Props {
    page: number; // Текущая страница (число)
    isLoading?: boolean; // Состояние загрузки (опционально)
    hidden?: boolean; // Флаг, определяющий, должен ли элемент быть скрыт (опционально)
    onFirstButtonCLick: () => void; // Функция-обработчик клика на кнопку "В начало"
    onPrevButtonCLick: () => void; // Функция-обработчик клика на кнопку "Назад"
    onNextButtonCLick: () => void; // Функция-обработчик клика на кнопку "Вперед"
}

/**
 * @component PageNavigator
 * @description Компонент для навигации по страницам с кнопками "В начало", "Назад" и "Вперед".
 * Используется для постраничной навигации в списках данных.
 *  * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const PageNavigator: React.FC<Props> = ({
    page,
    isLoading = false,
    hidden = false,
    onFirstButtonCLick,
    onPrevButtonCLick,
    onNextButtonCLick,
}: Props): JSX.Element | null => {
    if (isLoading) {
        return <Skeleton active className="width-100" paragraph={false} />;
    }

    if (hidden) {
        return null;
    }

    return (
        <Skeleton
            active
            className="width-100"
            paragraph={false}
            loading={isLoading}
        >
            <Flex className="page-navigator" gap={20} justify="space-between">
                <Space>
                    <Tag>{page}</Tag>
                    <Button
                        aria-label="Перейти в начало"
                        size="small"
                        disabled={page === 1}
                        className="navigation-btn"
                        icon={<DoubleLeftOutlined />}
                        type="primary"
                        ghost
                        onClick={onFirstButtonCLick}
                    >
                        {"В начало"}
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
                        {"Назад"}
                    </Button>
                    <Button
                        size="small"
                        className="navigation-btn"
                        iconPosition="end"
                        icon={<LongRightArrow />}
                        type="primary"
                        ghost
                        onClick={onNextButtonCLick}
                    >
                        {"Вперед"}
                    </Button>
                </Space.Compact>
            </Flex>
        </Skeleton>
    );
};

export default PageNavigator;
