"use client";
import React, { useRef, useState } from "react";
import type { CascaderProps, FormListFieldData, InputRef } from "antd";
import {
    UserOutlined,
    PlusOutlined,
    MinusCircleOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import {
    AutoComplete,
    Button,
    Cascader,
    Checkbox,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Row,
    Image,
    Select,
    Avatar,
    Flex,
    Alert,
    Tag,
} from "antd";
import { Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";

const { Option } = Select;

interface DataNodeType {
    value: string;
    label: string;
    children?: DataNodeType[];
}

const residences: CascaderProps<DataNodeType>["options"] = [
    {
        value: "zhejiang",
        label: "Zhejiang",
        children: [
            {
                value: "hangzhou",
                label: "Hangzhou",
                children: [
                    {
                        value: "xihu",
                        label: "West Lake",
                    },
                ],
            },
        ],
    },
    {
        value: "jiangsu",
        label: "Jiangsu",
        children: [
            {
                value: "nanjing",
                label: "Nanjing",
                children: [
                    {
                        value: "zhonghuamen",
                        label: "Zhong Hua Men",
                    },
                ],
            },
        ],
    },
];

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};

const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
    },
};
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const App: React.FC = () => {
    const config = {
        rules: [
            {
                type: "object" as const,
                required: true,
                message: "",
            },
        ],
    };
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log("Received values of form: ", values);
    };

    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        </Form.Item>
    );

    const suffixSelector = (
        <Form.Item name="suffix" noStyle>
            <Select style={{ width: 70 }}>
                <Option value="USD">$</Option>
                <Option value="CNY">¥</Option>
            </Select>
        </Form.Item>
    );

    const [autoCompleteResult, setAutoCompleteResult] = useState<string[]>([]);

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        console.log(newFileList);
    };

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const [isActive, setIsActive] = useState({});

    const handleFocus = (name: any) => {
        setIsActive({ [name]: true });
    };

    const handleBlur = (name: any) => {
        setIsActive({ [name]: false });
    };
    const MyObject = (field: FormListFieldData) => {
        return (
            <Flex gap={7} align="end">
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
                    hasFeedback
                >
                    <Input.Password
                        onFocus={() => handleFocus(`input${field.key}`)}
                    />
                </Form.Item>
                {isActive[`input${field.key}`] ? (
                    <Button className="dynamic-delete-button">
                        Продолжить
                    </Button>
                ) : null}
            </Flex>
        );
    };
    return (
        <Flex
            style={{
                flexDirection: "column",
                flex: "auto",
            }}
        >
            <Flex
                style={{
                    flex: "auto",
                    paddingTop: "128px",
                    backgroundColor: "#0c162d",
                    justifyContent: "center",
                    border: "solid 1px #202637",
                }}
            >
                <Form
                    style={{ maxWidth: 660, width: "100%" }}
                    layout="vertical"
                    form={form}
                    onFinish={onFinish}
                >
                    <Form.List
                        name="names"
                        rules={[
                            {
                                validator: async (_, names) => {
                                    if (!names || names.length < 2) {
                                        return Promise.reject(
                                            new Error("At least 2 passengers")
                                        );
                                    }
                                },
                            },
                        ]}
                    >
                        {(fields, { add, remove, move }, { errors }) => (
                            <>
                                <Flex gap={7} align="end">
                                    <Form.Item
                                        style={{ width: "100%" }}
                                        name="email"
                                        label="Эл. почта"
                                        rules={[
                                            {
                                                type: "email",
                                                message: "",
                                            },
                                            {
                                                required: true,
                                                message: "",
                                            },
                                        ]}
                                    >
                                        <Input
                                            onFocus={() =>
                                                handleFocus("inputEmail")
                                            }
                                        />
                                    </Form.Item>
                                    {isActive.inputEmail ? (
                                        <Button
                                            className="dynamic-delete-button"
                                            onClick={() =>
                                                fields.length === 0
                                                    ? add()
                                                    : null
                                            }
                                        >
                                            Продолжить
                                        </Button>
                                    ) : null}
                                </Flex>
                                {fields.map((field, index) => (
                                    <Flex gap={7} align="end">
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
                                            hasFeedback
                                        >
                                            <Input.Password
                                                onFocus={() =>
                                                    handleFocus(
                                                        `input${field.key}`
                                                    )
                                                }
                                            />
                                        </Form.Item>
                                        {isActive[`input${field.key}`] ? (
                                            <Button
                                                onClick={() =>
                                                    fields.length ===
                                                        field.key + 1 &&
                                                    fields.length < 3
                                                        ? add()
                                                        : null
                                                }
                                                className="dynamic-delete-button"
                                            >
                                                Продолжить
                                            </Button>
                                        ) : null}
                                    </Flex>
                                ))}
                            </>
                        )}
                    </Form.List>
                </Form>
            </Flex>
            <Flex>Text</Flex>
        </Flex>
    );
};

export default App;
