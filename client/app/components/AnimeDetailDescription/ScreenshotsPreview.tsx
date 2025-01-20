import { Divider, Flex, Space, Image } from "antd";
import TextIcon from "../TextIcon";
import React from "react";

interface Props {
    gap?: number;
    screenshots: Screenshot[];
    maxWidth?: number;
}

const ScreenshotsPreview = ({
    screenshots,
    gap = 10,
    maxWidth = 280,
}: Props) => {
    return (
        <Image.PreviewGroup>
            <Flex justify="center" wrap align="center" gap={gap}>
                {screenshots.map((animes: Screenshot) => (
                    <Image
                        style={{
                            maxWidth: maxWidth,
                        }}
                        preview={{
                            mask: "Посмотреть",
                        }}
                        src={animes.originalUrl}
                    ></Image>
                ))}
            </Flex>
        </Image.PreviewGroup>
    );
};
export default ScreenshotsPreview;
