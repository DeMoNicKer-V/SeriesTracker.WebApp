"use client";
import React, { useEffect, useState } from "react";
import { Button, Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { getCategoryList } from "../services/category";

export default function SettingsPage() {
    interface DataType {
        key: string;
        id: number;
        title: string;
    }
    const [categories, setCategories] = useState<Category[]>([]);
    const getCategories = async () => {
        const category = await getCategoryList();
        setCategories(category);
    };
    useEffect(() => {
        getCategories();
    }, []);

    const columns: TableProps<Category>["columns"] = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
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
