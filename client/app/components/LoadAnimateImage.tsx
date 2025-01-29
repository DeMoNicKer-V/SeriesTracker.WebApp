import React, { useEffect, useState } from "react";
import { Image, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = <LoadingOutlined style={{ fontSize: 32 }} spin />;

interface Props {
    src: string | undefined;
    maxWidth?: number;
    prev?: boolean;
    aspectRatio?: string;
}

const LoadAnimateImage: React.FC<Props> = ({
    src,
    maxWidth = 280,
    prev = false,
    aspectRatio = "",
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        if (!src) {
            setIsLoading(false);
            return;
        }
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
        return (
            <Spin
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: maxWidth,
                    height: "max-content",
                }}
                indicator={antIcon}
            />
        );
    }

    if (isError) {
        return <p>Load Error</p>;
    }

    return (
        <Image
            src={src}
            style={{
                maxWidth: maxWidth,
                aspectRatio: aspectRatio,
            }}
            preview={
                prev
                    ? {
                          mask: "Посмотреть",
                      }
                    : false
            }
        />
    );
};

export default LoadAnimateImage;
