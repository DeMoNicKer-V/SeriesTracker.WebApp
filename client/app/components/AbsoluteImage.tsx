interface Props {
    src: string;
    zIndex: number;
}
export const AbsoluteImage = ({ src, zIndex }: Props) => {
    return (
        <div
            style={{
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
            }}
        ></div>
    );
};

export default AbsoluteImage;
