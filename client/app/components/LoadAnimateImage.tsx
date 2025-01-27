import React, { useState, useEffect } from "react";
import { Image, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

interface Props {
    src: string;
}
const LoadAnimateImage = ({ src }: Props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const img = new window.Image();
        img.onload = () => {
            setIsLoading(false);
        };
        img.onerror = () => {
            setIsLoading(false);
            setIsError(true);
        };
        img.src = src;
    }, [src]);

    if (isLoading) {
        return <Spin indicator={antIcon} />;
    }

    if (isError) {
        return <p>Ошибка загрузки изображения</p>;
    }

    return <Image src={src} />;
};

export default LoadAnimateImage;
