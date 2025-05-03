import { DoubleLeftOutlined } from "@ant-design/icons";
import { Button, Flex, Space, Tag } from "antd";
import React from "react";
import { LongLeftArrow } from "../img/LongLeftArrow";
import { LongRightArrow } from "../img/LongRightArrow";

// Определение интерфейса Props для компонента PageNavigator
interface Props {
    page: number; // Текущая страница (число)
    onFirstButtonCLick: () => void; // Функция-обработчик клика на кнопку "В начало"
    onPrevButtonCLick: () => void; // Функция-обработчик клика на кнопку "Назад"
    onNextButtonCLick: () => void; // Функция-обработчик клика на кнопку "Вперед"
    nextButtonDisable: boolean; // Флаг, определяющий, должна ли быть кнопка "Вперед" заблокирована
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
    onFirstButtonCLick,
    onPrevButtonCLick,
    onNextButtonCLick,
    nextButtonDisable,
}: Props): JSX.Element => {
    return (
        <Flex className="page-navigator" gap={20} justify="space-between">
            <Space>
                <Tag>{page}</Tag>
                <Button
                    aria-label="Перейти в начало"
                    size="small"
                    disabled={page === 1}
                    className="navigation-btn"
                    icon={<DoubleLeftOutlined />}
                    style={{ marginRight: "auto" }}
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
                    disabled={nextButtonDisable}
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
    );
};

export default PageNavigator;
