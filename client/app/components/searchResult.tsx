import Card from "antd/es/card/Card";
import { CardTitle } from "./Cardtitle";
import Button from "antd/es/button";

interface Props {
    series: Series["item1"][];
}

export const SearchResult = ({ series }: Props) => {
    if (series === undefined) return;
    return (
        <div>
            {series.map((series: Series["item1"]) => (
                <p>{series.description}</p>
            ))}
        </div>
    );
};

export default SearchResult;
