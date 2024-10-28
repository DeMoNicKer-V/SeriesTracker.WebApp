"use client";
import { useState } from "react";
import { Animes } from "../components/Animes";
import { FloatButton, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
export default function MainPage() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="container">
            <title>Series Tracker - Аниме</title>
            <Typography.Title style={{ margin: 0 }} level={3}>
                Аниме
            </Typography.Title>
            <Animes isDrawerOpen={isOpen} onDrawerClose={toggleOpen} />

            <FloatButton.Group style={{ right: 0, margin: 10, bottom: 32 }}>
                <FloatButton
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={toggleOpen}
                />
                <FloatButton.BackTop />
            </FloatButton.Group>
        </div>
    );
}
