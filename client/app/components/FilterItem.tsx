import { Checkbox, Col, Form, GetProp, Row } from "antd";
import { Dispatch, SetStateAction } from "react";
interface DataType {
    id: any;
    russian: string;
}

interface Props {
    dataSource: DataType[];
    index: string;
    value: [] | any;
    targetValue: Dispatch<SetStateAction<[] | any>>;
}

function FilterItem({ dataSource, index, value, targetValue }: Props) {
    return (
        <Checkbox.Group
            value={value}
            onChange={(checkedValues) => targetValue(checkedValues)}
        >
            <Row gutter={[0, 16]}>
                {dataSource.map((option) => (
                    <Col span={24} key={`${index}${option.id}`}>
                        <Checkbox value={option.id}>{option.russian}</Checkbox>
                    </Col>
                ))}
            </Row>
        </Checkbox.Group>
    );
}

export default FilterItem;
