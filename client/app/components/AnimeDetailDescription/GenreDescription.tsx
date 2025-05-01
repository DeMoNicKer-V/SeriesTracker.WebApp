import { Space, Tag } from "antd";

import styles from "./component.module.css";
interface Props {
    genresList: [];
    size?: [number, number];
}

const GenreDescription = ({ genresList, size = [0, 0] }: Props) => {
    return (
        <Space
            className={styles["genre-list"]}
            align={"center"}
            size={size}
            wrap
        >
            {genresList.map((item: Genre, index) => (
                <Tag
                    key={`tag-${index}`}
                    className="tag"
                    style={{
                        backgroundColor: "transparent",
                    }}
                >
                    {item.russian}
                </Tag>
            ))}
        </Space>
    );
};
export default GenreDescription;
