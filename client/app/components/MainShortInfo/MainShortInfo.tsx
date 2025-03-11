import styles from "./component.module.css";
import { Flex, Typography } from "antd";

interface Props {
    title?: string;
    subTitle?: string;
    strongSubTitle?: boolean;
    description?: string;
    descriptionColor?: string;
    showDescription?: boolean;
    descriptionPrefix?: string;
    children?: React.ReactNode;
}

const { Text, Title, Paragraph } = Typography;
const MainShortInfo = ({
    title,
    subTitle,
    strongSubTitle = false,
    description,
    descriptionColor = "",
    showDescription = false,
    descriptionPrefix = "Описание:",
    children,
}: Props) => {
    return (
        <Flex className="flex-column">
            <Title
                className={`${styles.trimText} ${styles.title}`}
                level={5}
                style={{ marginBottom: 0 }}
            >
                {title}
            </Title>
            <Text
                className={`${styles.trimText} ${styles.subTitle}`}
                strong={strongSubTitle}
                italic
                type="secondary"
            >
                {subTitle}
            </Text>
            {showDescription && (
                <Paragraph
                    style={{ color: descriptionColor }}
                    className={`${styles.trimText} ${styles.description}`}
                >
                    <Text strong type="secondary">
                        {descriptionPrefix}{" "}
                    </Text>
                    {!description ? "отсутствует" : description}
                </Paragraph>
            )}
            {children}
        </Flex>
    );
};

export default MainShortInfo;
