import { Flex } from "antd";

interface Props {
    src: string;
    zIndex: number;
    children?: React.ReactNode;
    filter?: string;
}
export const AbsoluteImage = ({
    src,
    zIndex,
    children,
    filter = "",
}: Props) => {
    return (
        <div
            style={{
                pointerEvents: "none",
                flexDirection: "column",
                backgroundImage: `url(${src})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "top",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                position: "absolute",
                borderRadius: 10,
                zIndex: zIndex,
                filter: filter,
                justifyContent: "flex-end",
                display: "flex",
            }}
        >
            {children}
        </div>
    );
};

export default AbsoluteImage;
