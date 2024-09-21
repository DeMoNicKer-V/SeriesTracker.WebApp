import { Checkbox, Col, Form, GetProp, Row } from "antd";
import { Dispatch, SetStateAction } from "react";
interface DataType {
    id: any;
    russian: string;
}

interface Props {
    dataSource: DataType[];
    key: string;
    value: [];
    targetValue: Dispatch<SetStateAction<[] | any>>;
}

function FilterItem({ dataSource, key, value, targetValue }: Props) {
    return (
        <Form.Item name={key}>
            <Checkbox.Group
                value={value}
                onChange={(checkedValues) =>
                    targetValue(checkedValues.toString())
                }
            >
                <Row gutter={[0, 16]}>
                    {dataSource.map((option) => (
                        <Col span={24} key={`${key}${option.id}`}>
                            <Checkbox value={option.id}>
                                {option.russian}
                            </Checkbox>
                        </Col>
                    ))}
                </Row>
            </Checkbox.Group>
        </Form.Item>
    );
}

export default FilterItem;
