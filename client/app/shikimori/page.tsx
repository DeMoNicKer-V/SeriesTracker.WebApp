"use client";
import { Animes } from "../components/Animes";
import { Col, Row, Typography } from "antd";
export default function MainPage() {
    return (
        <div className="container">
            <title>Series Tracker - Аниме</title>
            <Row justify={"center"}>
                <Col span={23}>
                    <Typography.Title style={{ margin: 0 }} level={3}>
                        Аниме
                    </Typography.Title>
                    <Animes />
                </Col>
            </Row>
        </div>
    );
}
