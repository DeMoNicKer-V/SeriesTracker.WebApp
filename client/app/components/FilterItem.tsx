import { Checkbox, Col, Form, GetProp, Row } from "antd";
import { Dispatch, SetStateAction } from "react";
interface DataType {
    id: any;
    russian: string;
}

interface Props {
    dataSource: DataType[];
    index: string;
}

function FilterItem({ dataSource, index }: Props) {
    return (
        <Form.Item name={index}>
            <Checkbox.Group>
                <Row gutter={[0, 16]}>
                    {dataSource.map((option) => (
                        <Col span={24} key={`${index}${option.id}`}>
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
