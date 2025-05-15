import { QuestionCircleOutlined } from "@ant-design/icons";
import { Flex, Input, Modal, Typography } from "antd";
import React, { useState } from "react";
import styles from "./component.module.css";

// Определение интерфейса Props для компонента DeleteModal
interface Props {
    open: boolean; // Определяет, открыто ли модальное окно (обязательно)
    title: string; // Функция для закрытия модального окна (обязательно)
    onConfirm: () => Promise<void>; // Функция, вызываемая при подтверждении (удалении) (обязательно)
    onCancel: () => void; // Заголовок модального окна (обязательно)
}

const { Text, Title, Paragraph } = Typography;

/**
 * @component DeleteModal
 * @description Компонент для отображения модального окна подтверждения удаления.
 * Может использоваться для удаления аккаунта пользователя, списка аниме или любых других данных.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const DeleteModal: React.FC<Props> = ({
    open,
    onCancel,
    onConfirm,
    title,
}: Props): JSX.Element => {
    // Состояние для хранения введенного текста
    const [deleteStr, setDeleteStr] = useState<string>("");

    return (
        <Modal
            onOk={onConfirm}
            centered
            onCancel={onCancel}
            closeIcon={false}
            open={open}
            cancelText="Нет"
            okText="Удалить"
            okButtonProps={{
                danger: true,
                disabled: deleteStr !== "УДАЛИТЬ",
            }}
            title={
                <Flex align="center" gap={10}>
                    <QuestionCircleOutlined />
                    <Title className="zero-margin" level={5}>
                        {title}
                    </Title>
                </Flex>
            }
            footer={(_, { OkBtn, CancelBtn }) => (
                <>
                    <Flex justify="end" gap={10}>
                        <CancelBtn />
                        <OkBtn />
                    </Flex>
                </>
            )}
        >
            <Flex className="flex-column" gap={10}>
                <Paragraph>
                    Будьте внимательны, это необратимое действие! <br />
                    Чтобы подтвердить удаление, введите в поле ниже - (
                    <Text type="danger" code strong>
                        УДАЛИТЬ
                    </Text>
                    ).
                </Paragraph>

                <Input
                    onChange={(e) => setDeleteStr(e.target.value)}
                    value={deleteStr}
                    spellCheck={false}
                    status="error"
                    size="small"
                    className={styles["delete-popover-input"]}
                />
            </Flex>
        </Modal>
    );
};

export default DeleteModal;
