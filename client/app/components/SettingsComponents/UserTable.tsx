// UserTable.tsx
import { changeUserRole } from "@/app/api/user/editUser";
import { UserItem, UsersList } from "@/app/Models/User/UsersList";
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

interface Props {
    usersData?: UsersList;
    userToken: {
        userName: string;
        userId: string;
        roleId: string;
    };
    setPage: (page: number) => void;
    setDeleteUserName: (userName: string) => void;
    setOpenDeleteModal: (open: boolean) => void;
}

const handleSearch = (confirm: FilterDropdownProps["confirm"]) => {
    confirm();
};

const handleReset = (
    clearFilters: () => void,
    confirm: FilterDropdownProps["confirm"]
) => {
    clearFilters();
    confirm();
};

const UserTable = ({
    usersData,
    userToken,
    setPage,
    setDeleteUserName,
    setOpenDeleteModal,
}: Props) => {
    const onChange = async (userId: string, e: RadioChangeEvent) => {
        await changeUserRole(userId, e.target.value);
        window.location.reload();
    };

    const openDeleteModal = (username: string) => {
        setDeleteUserName(username);
        setOpenDeleteModal(true);
    };

    const getColumnSearchProps = (): TableColumnType<UserItem> => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    placeholder={"Введите для поиска"}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() => handleSearch(confirm)}
                    style={{ marginBottom: 10 }}
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
            record.userName
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
    });

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
                                      disabled: Number(userToken.roleId) != 1,
                                  },
                                  {
                                      value: 3,
                                      label: "Юзер",
                                      disabled: Number(userToken.roleId) != 1,
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
                    {record.id !== userToken.userId &&
                        record.roleId > Number(userToken.roleId) && (
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
