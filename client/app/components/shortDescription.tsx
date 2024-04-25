import { Button, Card, Col, Flex, Row, Typography } from "antd";

interface Props {
    series: Series["item1"];
    isOpen: boolean;
}

const cardStyle: React.CSSProperties = {
    width: "100%",
};

const imgStyle: React.CSSProperties = {
    display: "block",
    width: 133,
};

export const ShortDescription = ({ series, isOpen }: Props) => {
    return (
        <table style={{ backgroundColor: "#784F11" }} className="iksweb">
            <tbody>
                <tr>
                    <td rowSpan={4}>
                        <img src={series.imagePath} width={133} />
                    </td>
                    <td>
                        <div className="textTitle">{series.title}</div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div className="text">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Aliquam consectetur venenatis blandit.
                            Praesent vehicula, libero non pretium vulputate,
                            lacus arcu facilisis lectus, sed feugiat tellus
                            nulla eu dolor. Nulla porta bibendum lectus quis
                            euismod. Aliquam volutpat ultricies porttitor. Cras
                            risus nisi, accumsan vel cursus ut, sollicitudin
                            vitae dolor. Fusce scelerisque eleifend lectus in
                            bibendum. Suspendisse lacinia egestas felis a
                            volutpat.
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div>{series.releaseDate}</div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <Button>Anime Info</Button>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};
export default ShortDescription;
