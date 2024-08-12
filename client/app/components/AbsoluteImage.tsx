interface Props {
    src: string;
    zIndex: number;
    children?: React.ReactNode;
}
export const AbsoluteImage = ({ src, zIndex, children }: Props) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflow: "hidden",
                backgroundImage: `url(${src})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "top",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                position: "absolute",
                borderRadius: 5,
                zIndex: zIndex,
                alignItems: "flex-end",
            }}
        >
            {children}
        </div>
    );
};

export default AbsoluteImage;
