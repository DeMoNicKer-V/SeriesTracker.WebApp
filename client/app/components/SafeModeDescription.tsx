import { QuestionCircleOutlined } from "@ant-design/icons";
import { Descriptions, DescriptionsProps, Flex, Tooltip } from "antd";
import React, { useMemo } from "react";
import styles from "./components.module.css";

// Определение интерфейса Props для компонента SafeModeDescription
interface Props {
    censored: boolean; // Состояние безопасного режима (true - включен, false - выключен)
}

/**
 * @component SafeModeDescription
 * @description Компонент для отображения информации о состоянии безопасного режима.
 * Использует Descriptions для отображения состояния и Tooltip с иконкой для предоставления дополнительной информации.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const SafeModeDescription: React.FC<Props> = ({
    censored,
}: Props): JSX.Element => {
    const items: DescriptionsProps["items"] = useMemo(
        () => [
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
        ],
        [censored]
    );
    return <Descriptions items={items}></Descriptions>;
};

export default SafeModeDescription;
