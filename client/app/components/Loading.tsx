import { Spin } from "antd";

// Определение интерфейса Props для компонента Loading
interface Props {
    loading?: boolean; // Флаг, указывающий, нужно ли отображать индикатор загрузки (опционально, по умолчанию false)
}

/**
 * @component Loading
 * @description Компонент для отображения индикатора загрузки (спиннера).
 * Используется для визуализации процесса загрузки данных или выполнения операций.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element | null}
 */
const Loading: React.FC<Props> = ({
    loading = false,
}: Props): JSX.Element | null => {
    // Если loading === false, то не отображаем ничего (возвращаем null)
    if (!loading) return <></>;

    return (
        <Spin
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
            }}
            size="large"
        />
    );
};

export default Loading;
