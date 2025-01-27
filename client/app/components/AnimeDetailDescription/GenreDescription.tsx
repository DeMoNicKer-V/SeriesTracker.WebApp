import { Space, Tag } from "antd";
import React from "react";

import styles from "./component.module.css";
interface Props {
    genresString: string;
    size?: [number, number];
}

const GenreDescription = ({ genresString, size = [0, 0] }: Props) => {
    const genresList = genresString.split(",");
    return (
        <Space
            className={styles["genre-list"]}
            align={"center"}
            size={size}
            wrap
        >
            {genresList.map((item: string, index) => (
                <Tag
                    key={`tag-${index}`}
                    className="tag"
                    style={{
                        backgroundColor: "transparent",
                    }}
                >
                    {item}
                </Tag>
            ))}
        </Space>
    );
};
export default GenreDescription;
