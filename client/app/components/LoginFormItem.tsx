import { Button, Flex, Form, FormListFieldData, Input } from "antd";

interface Props {
    field: FormListFieldData;
    onClick: void;
    onFocus: any;
}

export const LoginFormItem = ({ onFocus }: Props) => {
    return (
        <Form.Item
            style={{ width: "100%" }}
            name="password"
            label="Пароль"
            rules={[
                {
                    required: true,
                    message: "",
                },
            ]}
        >
            <Input.Password onFocus={() => onFocus} />
        </Form.Item>
    );
};
