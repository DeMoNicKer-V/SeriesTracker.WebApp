import Card from "antd/es/card/Card";
import { CardTitle } from "./Cardtitle";
import Button from "antd/es/button";

interface Props {
    series: Series["item1"][];
    handleDelete: (id: string) => void;
    handleOpen: (series: Series["item1"]) => void;
}

export const Series = ({ series, handleDelete, handleOpen }: Props) => {
    return (
        <div className="cards">
            {series.map((series: Series["item1"]) => (
                <Card
                    key={series.id}
                    title={
                        <CardTitle
                            title={series.title}
                            lastEpisode={series.lastEpisode}
                        />
                    }
                    bordered={false}
                >
                    <p>{series.description}</p>
                    <div>
                        <Button
                            onClick={() => handleOpen(series)}
                            style={{ flex: 1 }}
                        >
                            Edit
                        </Button>
                        <Button
                            onClick={() => handleDelete(series.id)}
                            style={{ flex: 1 }}
                            danger
                        >
                            Delete
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
};
