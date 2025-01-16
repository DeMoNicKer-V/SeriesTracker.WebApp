import { Divider, Flex, Space, Typography } from "antd";
import TextIcon from "./TextIcon";
interface DataType {
    icon: JSX.Element;
    text: string;
    divider?: boolean;
}

interface Props {
    items: DataType[];
}

const AnimeDetailDescription2 = ({ items }: Props) => {
    return (
        <Space
        align={"center"}
        size={[0, 0]}
        wrap
    >
        {genres.map(
            (genre: string) => (
                <Tag
                    className="tag"
                    style={{
                        cursor: "default",
                        backgroundColor:
                            "transparent",
                    }}
                >
                    {genre}
                </Tag>
            )
        )}
    </Space>
    <Space
        align={"center"}
        size={[8, 8]}
        wrap
    >
        <TextIcon
            strong
            icon={
                <InfoCircleOutlined />
            }
            text={animes.kind}
        />

        <Divider
            className={
                styles["separator"]
            }
            type="vertical"
        />
        <TextIcon
            strong
            icon={<TeamOutlined />}
            text={animes.rating}
        />
        <Divider
            className={
                styles["separator"]
            }
            type="vertical"
        />
        <TextIcon
            strong
            icon={<FireOutlined />}
            text={animes.status}
        />
        <Divider
            className={
                styles["separator"]
            }
            type="vertical"
        />
        <TextIcon
            strong
            text={new Date(
                animes.startDate
            ).toLocaleString(
                "ru-Ru",
                {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                }
            )}
            icon={
                <CalendarOutlined />
            }
        />
        <Divider
            className={
                styles["separator"]
            }
            type="vertical"
        />
        <TextIcon
            strong
            text={`${animes.episodes} эп.`}
            icon={
                <YoutubeOutlined />
            }
        />

        <Divider
            className={
                styles["separator"]
            }
            type="vertical"
        />
        <TextIcon
            strong
            text={`${animes.duration} мин.`}
            icon={
                <ClockCircleOutlined />
            }
        />

        <Divider
            className={
                styles["separator"]
            }
            type="vertical"
        />

        <TextIcon
            strong
            text={`${animes.score} из 10`}
            icon={<StarOutlined />}
        />
    </Space>
    );
};
export default AnimeDetailDescription2;
