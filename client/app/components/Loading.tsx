import React from "react";
import { Spin } from "antd";
import { useLoading } from "./LoadingContext";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Loading: React.FC = () => {
    const { loading } = useLoading();

    if (!loading) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.8)",
                zIndex: 1000,
            }}
        >
            <Spin indicator={antIcon} />
        </div>
    );
};

export default Loading;
