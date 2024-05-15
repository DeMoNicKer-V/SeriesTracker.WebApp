"use client";
import { Col, Input, Pagination, Row } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
export default function SearchPage() {
    const searchParams = useSearchParams();
    const search = searchParams.get("query");
    return (
        <div className="container">
            <title>Series Tracker - Поиск</title>
            <Row align={"middle"} justify={"center"}>
                <Col span={12}>
                    <Input spellCheck={false} value={String(search)} />
                </Col>
            </Row>
            <Row align={"middle"} justify={"center"}>
                <Col>
                    <Pagination />
                </Col>
            </Row>
            <Row></Row>
        </div>
    );
}
