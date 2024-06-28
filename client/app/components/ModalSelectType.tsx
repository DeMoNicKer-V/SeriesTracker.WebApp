import { Button, Flex, Modal } from "antd";

interface Props {
    isModalOpen: boolean;
}
export const ModalSelectType = ({ isModalOpen }: Props) => {
    return (
        <Modal
            style={{
                display: "flex",
            }}
            open={isModalOpen}
            destroyOnClose={true}
            footer={null}
        >
            <Flex>
                <Button size="large">Shikimori</Button>
                <Button size="large">Свой тайтл</Button>
            </Flex>
        </Modal>
    );
};
