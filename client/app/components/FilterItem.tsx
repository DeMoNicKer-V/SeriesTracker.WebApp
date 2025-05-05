import { Checkbox, Col, Form, Row } from "antd";
import React from "react"; // Обязательный импорт React
// Определение интерфейса DataType для элемента данных (жанр, тема, аудитория)
interface DataType {
    id: number | any; // Уникальный идентификатор элемента
    russian: string; // Название элемента на русском языке
}

// Определение интерфейса Props для компонента FilterItem
interface Props {
    dataSource?: Genre[]; // Массив данных для отображения в виде чекбоксов
    index: string; // Уникальный индекс для группы чекбоксов
    censored?: boolean; // Флаг, указывающий, нужно ли скрывать элементы, предназначенные для взрослой аудитории (опционально)
}

/**
 * @component FilterItem
 * @description Компонент для отображения группы чекбоксов для фильтрации данных.
 * Используется для выбора жанров, тем или целевой аудитории.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const FilterItem: React.FC<Props> = ({
    dataSource = [],
    index,
    censored,
}: Props): JSX.Element => {
    // Фильтрация dataSource в зависимости от значения censored
    const filteredDataSource =
        censored === true
            ? dataSource.filter((item) => ![12, 539].includes(Number(item.id)))
            : dataSource;
    return (
        <Form.Item name={index}>
            <Checkbox.Group>
                <Row gutter={[0, 16]}>
                    {filteredDataSource.map((option) => (
                        <Col span={24} key={`${index}${option.id}`}>
                            <Checkbox
                                id={`checkbox-${option.id}`}
                                value={option.id}
                            >
                                {option.russian}
                            </Checkbox>
                        </Col>
                    ))}
                </Row>
            </Checkbox.Group>
        </Form.Item>
    );
};

export default FilterItem;
