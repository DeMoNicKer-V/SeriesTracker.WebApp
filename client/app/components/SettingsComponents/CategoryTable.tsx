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

interface Props {
    categories: Category[];
}

const { Paragraph, Text } = Typography;

const CategoryTable = ({ categories }: Props) => {
    const [api, contextHolder] = notification.useNotification();

    const showUpdateColorNotify = async (record: Category, color: string) => {
        await openNotification(record, color);
    };

    const onConfirm = async (id: number, color: string) => {
        await editCategoryColor(id, color);
        api.destroy();
        window.location.reload();
    };

    const updateCategoryColor = async (id: number, color: string) => {
        await editCategoryColor(id, color);
        window.location.reload();
    };

    const openNotification = async (record: Category, newColor: string) => {
        const key = `open-confirm-notify`;
        const btn = (
            <Space>
                <Button type="link" size="small" onClick={() => api.destroy()}>
                    Нет
                </Button>
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
            message: (
                <Paragraph>
                    <QuestionCircleOutlined /> {"Изменить цвет категории"}{" "}
                    <Text strong italic>
                        {record.name}
                    </Text>
                    ?
                </Paragraph>
            ),
            description: (
                <Flex gap={10} justify="center" align="center">
                    <Tag style={{ margin: 0 }} color={newColor}>
                        {newColor.toUpperCase()}
                    </Tag>
                    <LongLeftArrow />
                    <Tag style={{ margin: 0 }} color={record.color}>
                        {record.color.toUpperCase()}
                    </Tag>
                </Flex>
            ),
            btn,
            key,
            pauseOnHover: true,
            duration: 0,
        });
    };

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
