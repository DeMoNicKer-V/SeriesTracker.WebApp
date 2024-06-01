interface Props {
    src: () => string;
}
export const AbsoluteImage = ({ src }: Props) => {
    return (
        <div
            style={{
                backgroundImage: `url(${src})`,
                backgroundPosition: "top",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                height: "100%",
                left: "0",
                position: "absolute",
                top: "0",
                width: "100%",
                zIndex: "-1",
            }}
        ></div>
    );
};

export default AbsoluteImage;
