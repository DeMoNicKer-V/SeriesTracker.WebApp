// UserTable.tsx
import { changeUserRole } from "@/app/api/user/editUser";
import { UserItem, UsersList } from "@/app/models/user/UsersList";
import {
    CloseOutlined,
    DeleteOutlined,
    EyeOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import {
    Button,
    Flex,
    Input,
    Radio,
    RadioChangeEvent,
    Space,
    Table,
    TableColumnType,
    TableProps,
} from "antd";
import { FilterDropdownProps } from "antd/es/table/interface";
import styles from "./component.module.css";

// Определение интерфейса Props для компонента UserTable
interface Props {
    usersData?: UsersList; // Данные о пользователях (опционально)
    user?: User; // Информация о текущем пользователе (опционально)
    setPage: (page: number) => void; // Функция для установки номера страницы (обязательно)
    setDeleteUserName: (userName: string) => void; // Функция для установки имени пользователя для удаления (обязательно)
    setOpenDeleteModal: (open: boolean) => void; // Функция для открытия/закрытия модального окна удаления (обязательно)
}

/**
 * @component UserTable
 * @description Компонент для отображения таблицы со списком пользователей.
 * Позволяет искать пользователей по имени, изменять их роль и удалять пользователей.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const UserTable: React.FC<Props> = ({
    usersData,
    user,
    setPage,
    setDeleteUserName,
    setOpenDeleteModal,
}): JSX.Element => {
    //Обработчик события поиска.

    const handleSearch = (confirm: FilterDropdownProps["confirm"]) => {
        confirm(); // Подтверждаем поиск
    };

    //Обработчик события сброса фильтров.

    const handleReset = (
        clearFilters: () => void,
        confirm: FilterDropdownProps["confirm"]
    ) => {
        clearFilters(); // Очищаем фильтры
        confirm(); // Подтверждаем сброс
    };

    /**
     * @function onChange
     * @description Обработчик события изменения роли пользователя.
     * @param {string} userId - ID пользователя.
     * @param {RadioChangeEvent} e - Объект события RadioChangeEvent.
     * @returns {Promise<void>}
     */
    const onChange = async (
        userId: string,
        e: RadioChangeEvent
    ): Promise<void> => {
        await changeUserRole(userId, e.target.value); // Отправляем запрос на изменение роли пользователя
        window.location.reload(); // Перезагружаем страницу
    };

    //Открывает модальное окно подтверждения удаления пользователя.
    const openDeleteModal = (username: string) => {
        setDeleteUserName(username); // Устанавливаем имя пользователя для удаления
        setOpenDeleteModal(true); // Открываем модальное окно
    };

    //Возвращает объект с настройками для фильтрации столбца таблицы.

    const getColumnSearchProps = (): TableColumnType<UserItem> => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            // Компонент для отображения фильтра
            <div
                className={styles["user-table-search"]}
                onKeyDown={(e) => e.stopPropagation()} // Предотвращаем всплытие события keydown
            >
                <Input
                    className={styles["user-table-search-input"]}
                    placeholder={"Введите для поиска"}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    } // Обработчик изменения значения поля ввода
                    onPressEnter={() => handleSearch(confirm)}
                />
                <Flex justify="space-between">
                    <Button
                        onClick={() => handleSearch(confirm)}
                        icon={<SearchOutlined />}
                        size="small"
                    >
                        Поиск
                    </Button>
                    <Button
                        icon={<CloseOutlined />}
                        onClick={() =>
                            clearFilters && handleReset(clearFilters, confirm)
                        }
                        size="small"
                    ></Button>
                </Flex>
            </div>
        ),
        filterIcon: <SearchOutlined />,
        onFilter: (value, record) =>
            // Функция фильтрации
            record.userName
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()), // Приводим к нижнему регистру и проверяем наличие подстроки
    });

    // Определение колонок таблицы
    const userColumn: TableProps<UserItem>["columns"] = [
        {
            fixed: "left",
            title: "Никнейм",
            dataIndex: "userName",
            key: "userName",
            ...getColumnSearchProps(),
        },

        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Роль",
            dataIndex: "roleId",
            key: "roleId",
            showSorterTooltip: false,
            sorter: (a, b) => b.roleId - a.roleId,
            render: (roleId, record) => (
                <Radio.Group
                    key={record.id}
                    optionType="button"
                    onChange={(e) => onChange(record.id, e)}
                    defaultValue={roleId}
                    options={
                        roleId === 1
                            ? [{ value: 1, label: "Админ" }]
                            : [
                                  {
                                      value: 2,
                                      label: "Модер",
                                      disabled: user?.roleId != 1,
                                  },
                                  {
                                      value: 3,
                                      label: "Юзер",
                                      disabled: user?.roleId != 1,
                                  },
                              ]
                    }
                />
            ),
        },
        {
            title: "Дата регистрации",
            dataIndex: "regDate",
            key: "regDate",
            showSorterTooltip: false,
            sorter: (a, b) =>
                new Date(a.regDate).getTime() - new Date(b.regDate).getTime(),
            render: (_, record) =>
                new Date(record.regDate).toLocaleString("ru-Ru", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                }),
        },
        {
            fixed: "right",
            title: "Действия",
            key: "action",
            render: (_, record) => (
                <Space size={"small"}>
                    <Button
                        target="_blank"
                        href={`user/${record.userName}`}
                        size="small"
                        icon={<EyeOutlined />}
                    />
                    {record.id !== user?.id &&
                        record.roleId > Number(user?.roleId) && (
                            <Button
                                danger
                                onClick={() => openDeleteModal(record.userName)}
                                size="small"
                                icon={<DeleteOutlined />}
                            />
                        )}
                </Space>
            ),
        },
    ];

    return (
        <Table
            pagination={{
                defaultPageSize: 10,
                position: ["bottomCenter"],
                total: usersData?.totalCount,
                onChange(page) {
                    setPage(page);
                },
            }}
            rowKey="userName"
            scroll={{ x: "max-content" }}
            columns={userColumn}
            dataSource={usersData?.users}
        />
    );
};

export default UserTable;
