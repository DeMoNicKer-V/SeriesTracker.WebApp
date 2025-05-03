import { Screenshot } from "@/app/models/anime/Screenshot";
import { ConfigProvider, Image, List } from "antd";
import { ListGridType } from "antd/es/list";
import { EmptyView } from "../EmptyView";
import LinkButton from "../LinkButton";
import LoadAnimateImage from "../LoadAnimateImage";
import styles from "./component.module.css";

interface Props {
    grid?: ListGridType;
    screenshots: Screenshot[];
    maxWidth?: number;
    id?: number;
}
const customizeRenderEmpty = () => (
    <EmptyView text={"Других кадров не найдено"} />
);
const ScreenshotsPreview = ({
    screenshots,
    grid = {
        gutter: 15,
        xs: 1,
        sm: 2,
        md: 2,
        lg: 4,
        xl: 4,
        xxl: 4,
    },
    maxWidth = 280,
    id = 0,
}: Props) => {
    return (
        <ConfigProvider renderEmpty={customizeRenderEmpty}>
            <Image.PreviewGroup>
                <List
                    className={styles["my-centered-list"]}
                    grid={grid}
                    dataSource={screenshots}
                    renderItem={(item: Screenshot) => (
                        <List.Item className={styles["my-centered-item"]}>
                            <LoadAnimateImage
                                src={item.originalUrl}
                                maxWidth={maxWidth}
                                aspectRatio="12/7"
                                preview={true}
                                alt={`screen-${item.id}`}
                            />
                        </List.Item>
                    )}
                />
            </Image.PreviewGroup>
            {id > 0 && (
                <LinkButton
                    href={`${id}/screen`}
                    text={"Посмотреть больше кадров"}
                />
            )}
        </ConfigProvider>
    );
};
export default ScreenshotsPreview;
