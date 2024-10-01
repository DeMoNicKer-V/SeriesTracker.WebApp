import React, { useState, useEffect, useRef } from "react";
import { Menu, Form, FormInstance, MenuProps } from "antd";

interface Props {
    value: string;
}
import {
    StarOutlined,
    FontColorsOutlined,
    TeamOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
type MenuItem = Required<MenuProps>["items"][number];
// Создаем custom компонент
export const SortMenu = ({ value }) => {
    const [selectedKeys, setSelectedKeys] = useState(["ranked"]);

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
    // Обработчик события onSelect
    const handleSelect: MenuProps["onSelect"] = (e) => {
        value = e.key;
    };

    return (
        <Menu
            items={sortMenuItems}
            onSelect={handleSelect}
            selectedKeys={[value]}
            mode="vertical"
        />
    );
};
