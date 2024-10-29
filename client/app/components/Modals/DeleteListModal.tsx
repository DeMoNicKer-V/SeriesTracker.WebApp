import { Modal } from "antd";

interface Props {
    open: boolean;
}
const DeleteListModal = ({ open }: Props) => {
    return <Modal open={open} title="Удалить все данные?"></Modal>;
};
export default DeleteListModal;
