import React, { useEffect, useState } from "react";
import { Image, Skeleton, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import noFoundImage from ".//../img/img-error.jpg";
const antIcon = <LoadingOutlined style={{ fontSize: 32 }} spin />;

interface Props {
    src: string | undefined;
    maxWidth?: number;
    prev?: boolean;
    aspectRatio?: string;
}

const LoadAnimateImage = ({
    src,
    maxWidth = 280,
    prev = false,
    aspectRatio = "",
}: Props) => {
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
        return <Skeleton.Image active />;
    }

    if (isError) {
        return (
            <Image
                src={noFoundImage.src}
                preview={false}
                style={{
                    maxWidth: maxWidth,
                    aspectRatio: aspectRatio,
                }}
            />
        );
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
