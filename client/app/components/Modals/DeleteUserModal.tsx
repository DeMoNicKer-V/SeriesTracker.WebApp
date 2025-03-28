import { Flex, Input, Modal, Typography } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
interface Props {
    title: string;
    open: boolean;
    onCancel: () => void;
    onOk: () => void;
}

const { Text, Title, Paragraph } = Typography;
const DelteUserModal = ({ title, open, onCancel, onOk }: Props) => {
    const [deleteStr, setDeleteStr] = useState<string>("");
    return (
        <Modal
            centered
            onOk={onOk}
            onCancel={() => {
                onCancel();
                setDeleteStr("");
            }}
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
                    <Title level={5}>{title}</Title>
                </Flex>
            }
            footer={(_, { OkBtn, CancelBtn }) => (
                <>
                    <CancelBtn />
                    <OkBtn />
                </>
            )}
        >
            <Flex className="flex-column" gap={10}>
                <Paragraph>
                    Будьте внимательны, это необратимое действие! <br />
                    Для того, чтобы удалить аккаунт, введите в поле ниже - (
                    <Text type="danger" code strong>
                        УДАЛИТЬ
                    </Text>
                    ) .
                </Paragraph>

                <Input
                    onChange={(e) => setDeleteStr(e.target.value)}
                    value={deleteStr}
                    spellCheck={false}
                    status="error"
                    size="small"
                    style={{
                        textAlign: "center",
                        fontSize: 16,
                        fontWeight: 500,
                    }}
                />
            </Flex>
        </Modal>
    );
};

export default DelteUserModal;
