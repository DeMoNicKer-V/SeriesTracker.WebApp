// CategoryTable.tsx
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
    Button,
    ColorPicker,
    Flex,
    notification,
    Popconfirm,
    Space,
    Table,
    TableProps,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import { editCategoryColor } from "../../api/category/editCategory";
import { LongLeftArrow } from "../../img/LongLeftArrow";
import { Category } from "../../models/Category";

// Определение интерфейса Props для компонента CategoryTable
interface Props {
    categories: Category[]; // Массив категорий (обязательно)
}

const { Paragraph, Text } = Typography;

/**
 * @component CategoryTable
 * @description Компонент для отображения таблицы с категориями.
 * Позволяет изменять цвет каждой категории.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const CategoryTable: React.FC<Props> = ({ categories }: Props): JSX.Element => {
    const [api, contextHolder] = notification.useNotification(); // Хук для управления уведомлениями

    // Показывает уведомление с запросом подтверждения изменения цвета категории.
    const showUpdateColorNotify = async (
        record: Category,
        color: string
    ): Promise<void> => {
        await openNotification(record, color); // Открываем уведомление
    };
    // Обработчик подтверждения изменения цвета категории
    const onConfirm = async (id: number, color: string): Promise<void> => {
        try {
            await editCategoryColor(id, color); // Отправляем запрос на изменение цвета категории
            api.success({
                message: "Цвет категории успешно обновлен!",
            });
        } catch (error) {
            console.error("Ошибка при обновлении цвета категории:", error);
            api.error({
                message: "Не удалось обновить цвет категории.",
            });
        } finally {
            api.destroy(); // Закрываем уведомление
            window.location.reload();
        }
    };

    // Обновляет цвет категории и перезагружает страницу.
    const updateCategoryColor = async (
        id: number,
        color: string
    ): Promise<void> => {
        try {
            await editCategoryColor(id, color); // Отправляем запрос на изменение цвета категории
            window.location.reload();
        } catch (error) {
            console.error("Ошибка при обновлении цвета категории:", error);
            api.error({
                message: "Не удалось обновить цвет категории.",
            });
        }
    };

    // Открывает уведомление с запросом подтверждения изменения цвета категории.
    const openNotification = async (
        record: Category,
        newColor: string
    ): Promise<void> => {
        const key = `open-confirm-notify`; // Ключ уведомления
        const btn = (
            // Кнопки для уведомления
            <Space>
                {/* Кнопка "Нет" */}
                <Button
                    type="link"
                    size="small"
                    onClick={() => api.destroy(key)}
                >
                    Нет
                </Button>
                {/* Кнопка "Да" */}
                <Button
                    type="primary"
                    size="small"
                    onClick={() => onConfirm(record.id, newColor)}
                >
                    Да
                </Button>
            </Space>
        );

        api.open({
            // Открываем уведомление
            message: (
                // Сообщение уведомления
                <Paragraph>
                    <QuestionCircleOutlined /> {`Изменить цвет категории `}
                    <Text strong italic>
                        {record.name}
                    </Text>
                    ?
                </Paragraph>
            ),
            description: (
                // Описание уведомления
                <Flex gap={10} justify="center" align="center">
                    {/* Новый цвет */}
                    <Tag style={{ margin: 0 }} color={newColor}>
                        {newColor.toUpperCase()}
                    </Tag>
                    <LongLeftArrow />
                    {/* Старый цвет */}
                    <Tag style={{ margin: 0 }} color={record.color}>
                        {record.color.toUpperCase()}
                    </Tag>
                </Flex>
            ),
            btn, // Кнопки
            key, // Ключ
            pauseOnHover: true, // Пауза при наведении
            duration: 0, // Не закрывать автоматически
        });
    };

    // Определение колонок таблицы
    const categoryColumns: TableProps<Category>["columns"] = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            sorter: (a, b) => b.id - a.id,
            showSorterTooltip: false,
        },
        {
            fixed: "left",
            title: "Название",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Цвет",
            dataIndex: "color",
            key: "color",
            render: (_, record) => (
                <Flex justify={"space-between"}>
                    {contextHolder}
                    <ColorPicker
                        disabledAlpha
                        destroyTooltipOnHide
                        defaultValue={record.color}
                        onChangeComplete={(color) => {
                            showUpdateColorNotify(record, color.toHexString());
                        }}
                    >
                        <Tooltip title={"Нажмите, чтобы изменить"}>
                            <Tag
                                style={{ cursor: "pointer" }}
                                color={record.color}
                            >
                                {record.color.toUpperCase()}
                            </Tag>
                        </Tooltip>
                    </ColorPicker>
                    <Tooltip title={"Вернуть пред. цвет"}>
                        <Popconfirm
                            icon={<QuestionCircleOutlined />}
                            title={`${record.name}`}
                            description="Вернуть предыдущий цвет для категории?"
                            onConfirm={() => {
                                updateCategoryColor(
                                    record.id,
                                    record.prevColor
                                );
                            }}
                            okText="Да"
                            cancelText="Нет"
                        >
                            <Button
                                disabled={!record.prevColor}
                                type="text"
                                size="small"
                                icon={<LongLeftArrow />}
                            ></Button>
                        </Popconfirm>
                    </Tooltip>
                </Flex>
            ),
        },
        {
            title: "Пред. цвет",
            dataIndex: "prevColor",
            key: "prevColor",

            render: (_, record) => (
                <Tag style={{ cursor: "pointer" }} color={record.prevColor}>
                    {record.prevColor
                        ? record.prevColor.toUpperCase()
                        : "Отсутствует"}
                </Tag>
            ),
        },
        {
            title: "Дата изменения",
            dataIndex: "date",
            key: "date",
            showSorterTooltip: false,
            sorter: (a, b) =>
                new Date(a.date).getTime() - new Date(b.date).getTime(),
            render: (_, record) =>
                new Date(record.date).toLocaleString("ru-Ru", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                }),
        },
    ];

    return (
        <Table
            rowKey="name"
            scroll={{ x: "max-content" }}
            pagination={false}
            columns={categoryColumns}
            dataSource={categories}
        />
    );
};

export default CategoryTable;
