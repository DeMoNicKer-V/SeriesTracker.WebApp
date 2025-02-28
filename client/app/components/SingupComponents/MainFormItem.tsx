import { Button, Col, Form, Input, Row } from "antd";
import { Rule } from "antd/es/form";

interface Props {
    label: string;
    name: string;
    showButton: boolean;
    buttonDisabled: boolean;
    itemRules: Rule[];
    onInputFocus: () => void;
    onButtonClick: () => void;
}
const MainFormItem = ({
    label,
    name,
    showButton,
    buttonDisabled,
    itemRules,
    onInputFocus,
    onButtonClick,
}: Props) => {
    return (
        <Row gutter={[10, 10]} align={"bottom"} justify={"center"}>
            <Col sm={19} xs={24}>
                <Form.Item
                    help={false}
                    validateFirst
                    validateDebounce={1500}
                    hasFeedback
                    name={name}
                    label={label}
                    rules={itemRules}
                >
                    <Input
                        onFocus={onInputFocus}
                        autoComplete="off"
                        spellCheck={false}
                        autoFocus
                    />
                </Form.Item>
            </Col>
            <Col sm={5} xs={24}>
                {showButton && (
                    <Form.Item shouldUpdate>
                        <Button
                            disabled={buttonDisabled}
                            type="primary"
                            ghost
                            className="width-100"
                            onClick={onButtonClick}
                        >
                            Продолжить
                        </Button>
                    </Form.Item>
                )}
            </Col>
        </Row>
    );
};
export default MainFormItem;
