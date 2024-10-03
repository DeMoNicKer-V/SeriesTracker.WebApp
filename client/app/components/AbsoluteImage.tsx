import { Flex } from "antd";

interface Props {
    src: string;
    zIndex: number;
    children?: React.ReactNode;
}
export const AbsoluteImage = ({ src, zIndex, children }: Props) => {
    return (
        <Flex
            align={"flex-end"}
            justify={"space-between"}
            style={{
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
            }}
        >
            {children}
        </Flex>
    );
};

export default AbsoluteImage;
