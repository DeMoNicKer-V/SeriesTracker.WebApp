import { CalendarDateLabel } from "@/app/utils/dateUtils";
import { Divider, Flex, Skeleton, Tabs, TabsProps } from "antd";
import React from "react";

// Определение интерфейса Props для компонента CalendarHeader
interface Props {
    weekDays: CalendarDateLabel[]; // Массив данных о днях недели (обязательно)
    loading: boolean; // Определяет, находится ли компонент в состоянии загрузки (обязательно)
    onChangeDate: (key: string) => void; // Функция, вызываемая при выборе дня недели (обязательно)
}

/**
 * @component CalendarHeader
 * @description Компонент для отображения заголовка календаря с днями недели.
 * Использует Tabs для отображения дней недели и Skeleton для отображения состояния загрузки.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const CalendarHeader: React.FC<Props> = ({
    weekDays,
    loading,
    onChangeDate,
}: Props): JSX.Element => {
    const items: TabsProps["items"] = weekDays.map((day) => ({
        key: day.key,
        label: day.label,
    }));
    return loading ? (
        // Отображаем скелетон, если компонент находится в состоянии загрузки
        <div>
            <Flex gap={10} justify="center" className="width-100">
                {Array.from({ length: 7 }, (_, index) => (
                    <Skeleton.Button key={index} active={true} block />
                ))}
            </Flex>
            <Divider />
        </div>
    ) : (
        <Tabs
            aria-label="week-days"
            onChange={(key) => onChangeDate(key)}
            centered
            items={items}
        />
    );
};

export default CalendarHeader;
