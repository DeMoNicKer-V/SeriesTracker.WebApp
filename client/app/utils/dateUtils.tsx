// utils/dateUtils.ts
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Flex, Typography } from "antd";
import dayjs from "dayjs"; // Импортируем библиотеку dayjs (для работы с датами)
import "dayjs/locale/ru"; // Импортируем русскую локаль для dayjs
dayjs.locale("ru"); // Устанавливаем русскую локаль

// Интерфейс для объекта, представляющего метку даты в календаре
export interface CalendarDateLabel {
    key: string; // Уникальный ключ для метки
    label: React.ReactNode; // Элемент React для отображения метки
}

const { Text, Title } = Typography;

// Функция для получения массива объектов с датами (для отображения заголовков в календаре)
export const getDatesArray = (): CalendarDateLabel[] => {
    const datesArray: CalendarDateLabel[] = []; // Инициализируем массив для хранения меток дат
    const currentDate = new Date(); // Получаем текущую дату

    for (let i = 0; i < 7; i++) {
        // Перебираем 7 дней (начиная с текущей даты)
        const newDate = new Date(currentDate); // Создаем копию текущей даты
        newDate.setDate(currentDate.getDate() + i); // Устанавливаем дату на i дней вперед
        datesArray.push({
            // Добавляем объект в массив
            key: i.toString(), // Уникальный ключ для метки (преобразуем i в строку)
            label: (
                <Flex
                    className="flex-column"
                    style={{
                        textAlign: "center",
                        padding: 4,
                    }}
                >
                    <Title level={5}>
                        {/* Отображаем название дня недели (заглавная буква) */}
                        {capitalizeFirstLetter(dayjs(newDate).format("dddd"))}
                    </Title>
                    <Text italic type="secondary">
                        {/* Отображаем дату (день и месяц) */}
                        {dayjs(newDate).format("D MMMM")}
                    </Text>
                </Flex>
            ),
        });
    }

    return datesArray; // Возвращаем массив объектов с датами
};

// Функция для преобразования первой буквы строки в заглавную
export function capitalizeFirstLetter(str: string): string {
    if (!str) return ""; // Если строка пустая, возвращаем пустую строку
    return str[0].toUpperCase() + str.slice(1); // Преобразуем первую букву в заглавную и объединяем с остальной частью строки
}

// Функция для сравнения двух дат и отображения соответствующей иконки
export function dateComparer(date1: Date, date2: Date): JSX.Element {
    if (date1.getTime() > date2.getTime()) {
        // Если первая дата больше второй, возвращаем иконку CheckCircleOutlined (зеленого цвета)
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
    } else {
        // В противном случае возвращаем иконку ClockCircleOutlined (желтого цвета)
        return <ClockCircleOutlined style={{ color: "#faad14" }} />;
    }
}
