"use client";
import React, { useEffect, useState } from "react";
import {
    Button,
    ColorPicker,
    Flex,
    Popconfirm,
    Space,
    Table,
    Tag,
    Tooltip,
} from "antd";
import type { TableProps } from "antd";
import { getCategoryList, updateCategoryById } from "../services/category";
import { LongLeftArrow } from "../img/LongLeftArrow";
import { QuestionCircleOutlined } from "@ant-design/icons";

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

    const returnColor = async (record: Category, prevColor: string) => {
        if (!prevColor) {
            return;
        }
        const tempColor = prevColor;
        record.color = tempColor;
        record.prevColor = record.color;
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
                <Flex
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <ColorPicker
                        defaultValue={record.color}
                        onChangeComplete={async (color) => {
                            await updateCategory(record, color.toHexString());
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
                            title={`Категория: ${record.title}`}
                            description="Вы уверены, что хотите вернуть предыдущий цвет?"
                            onConfirm={() => {
                                returnColor(record, record.prevColor);
                            }}
                            okText="Да"
                            cancelText="Нет"
                        >
                            <Button
                                /*disabled={!record.prevColor}*/
                                style={{ height: 22 }}
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
        <div className="container">
            <title>Series Tracker - Настройки</title>
            <Table columns={columns} dataSource={categories} />
            <Button>Добавить</Button>
        </div>
    );
}
