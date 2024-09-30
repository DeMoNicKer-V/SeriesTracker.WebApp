import { Menu, MenuProps } from "antd";
import { useState } from "react";
import {
    UndoOutlined,
    SearchOutlined,
    QuestionCircleOutlined,
    StarOutlined,
    FontColorsOutlined,
    TeamOutlined,
    CalendarOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
} from "@ant-design/icons";
type MenuItem = Required<MenuProps>["items"][number];
const CustomIconCheckbox = ({ onValuesChange, name, defaultSelectedKeys }) => {
    const [selectedKeys, setSelectedKeys] =
        useState<string[]>(defaultSelectedKeys);

    const sortMenuItems: MenuItem[] = [
        {
            style: { marginLeft: "auto" },
            label: "По рейтингу",
            key: "ranked",
            icon: <StarOutlined />,
        },
        {
            label: "По популярности",
            key: "popularity",
            icon: <TeamOutlined />,
        },
        {
            label: "По алфавиту",
            key: "name",
            icon: <FontColorsOutlined />,
        },
        {
            label: "По дате выхода",
            key: "aired_on",
            icon: <CalendarOutlined />,
        },
    ];
    const handleSelect = (e: any) => {
        setSelectedKeys([e.key]);
        onValuesChange({ [name]: [e.key] }); // Отправка изменений в Form
    };

    return (
        <Menu
            onSelect={handleSelect}
            selectedKeys={selectedKeys}
            mode="vertical"
            items={sortMenuItems}
        ></Menu>
    );
};
export default CustomIconCheckbox;
