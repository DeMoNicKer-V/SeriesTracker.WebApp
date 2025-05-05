import { deleteSelfUser } from "@/app/api/user/deleteUser";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Flex, Input, Modal, Typography } from "antd";
import { useState } from "react";
import styles from "./component.module.css";

interface Props {
    open: boolean;
    userName: string;
    onCancel: () => void;
}

const { Text, Title, Paragraph } = Typography;

const DeleteSelfModal = ({ open, userName, onCancel }: Props) => {
    const [deleteStr, setDeleteStr] = useState<string>("");
    //  Асинхронная функция для удаления своего аккаунта
    const deleteSelf = async () => {
        onCancel();
        await deleteSelfUser(userName);
    };
    return (
        <Modal
            onOk={deleteSelf}
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
                <Flex gap={10}>
                    <QuestionCircleOutlined />
                    <Title level={5}>Удалить Ваш Аккаунт?</Title>
                </Flex>
            }
            footer={(_, { OkBtn, CancelBtn }) => (
                <>
                    <Flex gap={10}>
                        <CancelBtn />
                        <OkBtn />
                    </Flex>
                </>
            )}
        >
            <Flex className="flex-column" gap={10}>
                <Paragraph>
                    Будьте внимательны, это необратимое действие! <br />
                    <br />
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

export default DeleteSelfModal;
