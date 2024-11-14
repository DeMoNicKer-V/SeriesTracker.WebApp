"use client";
import { useState } from "react";
import { Animes } from "../components/Animes";
import { Col, FloatButton, Row, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
export default function MainPage() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="container">
            <title>Series Tracker - Аниме</title>
            <Row justify={"center"}>
                <Col span={23}>
                    <Typography.Title style={{ margin: 0 }} level={3}>
                        Аниме
                    </Typography.Title>
                    <Animes isDrawerOpen={isOpen} onDrawerClose={toggleOpen} />
                </Col>
            </Row>

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
