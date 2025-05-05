import { QuestionCircleOutlined } from "@ant-design/icons";
import { Descriptions, DescriptionsProps, Flex, Tooltip } from "antd";
import styles from "./components.module.css";
// Определение интерфейса Props для компонента AnimeParamsMenu
interface Props {
    censored: boolean;
}
const SafeModeDescription: React.FC<Props> = ({
    censored,
}: Props): JSX.Element => {
    // Определение элементов для Descriptions (отображение состояния "безопасного режима")
    const items: DescriptionsProps["items"] = [
        {
            label: "Состояние",
            children: (
                <Flex gap={5}>
                    {censored ? "Включен" : "Выключен"}
                    <Tooltip
                        trigger={"hover"}
                        title={
                            censored
                                ? "Рекомендуется в большинстве случаев"
                                : "Если вы ищете что-то определенное"
                        }
                    >
                        <QuestionCircleOutlined
                            className={styles["safe-mode-icon"]}
                        />
                    </Tooltip>
                </Flex>
            ),
        },
    ];

    return <Descriptions items={items}></Descriptions>;
};

export default SafeModeDescription;
