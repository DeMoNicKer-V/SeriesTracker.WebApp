import { Spin } from "antd";

interface Props {
    loading?: boolean;
}
const Loading = ({ loading = false }: Props) => {
    if (!loading) return null;

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
