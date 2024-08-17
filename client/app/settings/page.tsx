"use client";
import React, { useEffect, useState } from "react";
import { Button, ColorPicker, Space, Table, Tag, Tooltip } from "antd";
import type { TableProps } from "antd";
import { getCategoryList, updateCategoryById } from "../services/category";

export default function SettingsPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const getCategories = async () => {
        const category = await getCategoryList();
        setCategories(category);
    };

    const updateCategory = async (record: Category, color: string) => {
        if (!color) {
            return;
        }
        record.color = color;
        await updateCategoryById(record.id, record);
        await getCategories();
    };

    useEffect(() => {
        getCategories();
    }, []);

    const columns: TableProps<Category>["columns"] = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Название",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Цвет",
            dataIndex: "color",
            key: "color",
            render: (_, record) => (
                <ColorPicker
                    defaultValue={record.color}
                    onChangeComplete={async (color) => {
                        await updateCategory(record, color.toHexString());
                    }}
                >
                    <Tooltip title={"нажмите, чтобы изменить"}>
                        <Tag
                            style={{ cursor: "pointer" }}
                            /* onClick={() =>
                                navigator.clipboard.writeText(record.color)
                            }*/
                            color={record.color}
                        >
                            {record.color.toUpperCase()}
                        </Tag>
                    </Tooltip>
                </ColorPicker>
            ),
        },
    ];

    return (
        <div className="container">
            <title>Series Tracker - Настройки</title>
            <Table columns={columns} dataSource={categories} />
            <Button>Добавить</Button>
        </div>
    );
}
