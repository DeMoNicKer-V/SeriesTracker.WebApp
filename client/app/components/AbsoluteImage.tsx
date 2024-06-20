interface Props {
    src: string;
}
export const AbsoluteImage = ({ src }: Props) => {
    return (
        <div
            style={{
                overflow: "hidden",
                backgroundImage: `url(${src})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                position: "absolute",
                borderRadius: 5,
            }}
        ></div>
    );
};

export default AbsoluteImage;
