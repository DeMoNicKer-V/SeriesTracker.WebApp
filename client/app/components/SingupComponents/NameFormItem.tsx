import { Form, Input } from "antd";

interface Props {
    label: string;
    name: string;
}

const NameFormItem = ({ label, name }: Props) => {
    return (
        <Form.Item
            validateFirst
            rules={[
                {
                    min: 3,
                    message: "Длина слишком короткая",
                },
                {
                    max: 15,
                    message: "Длина не может превышать 15 символов",
                },
                {
                    pattern: new RegExp("^[a-zA-Zа-яА-Я]+$"),
                    message: `${label} не может включать в себя спец. символы и пробел`,
                },
            ]}
            name={name}
        >
            <Input
                maxLength={15}
                spellCheck={"false"}
                autoComplete="off"
                variant="filled"
                placeholder={label}
            ></Input>
        </Form.Item>
    );
};

export default NameFormItem;
