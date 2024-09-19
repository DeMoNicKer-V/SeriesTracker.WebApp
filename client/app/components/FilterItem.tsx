import { Checkbox, CheckboxProps, Col, Form, GetProp, List, Row } from "antd";
interface DataType {
    id: any;
    russian: string;
}

interface Props {
    dataSource: DataType[];
    key: string;

    onChange: GetProp<typeof Checkbox.Group, "onChange">;
}

function FilterItem({ dataSource, key, onChange }: Props) {
    return (
        <Form.Item name={key}>
            <Checkbox.Group onChange={onChange}>
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
