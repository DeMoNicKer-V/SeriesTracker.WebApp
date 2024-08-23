"use client";
import React, { useState } from "react";
import type { CascaderProps } from "antd";
import {
    UserOutlined,
    PlusOutlined,
    MinusCircleOutlined,
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
                        {(fields, { add, remove }, { errors }) => (
                            <>
                                <Form.Item label="Name">
                                    <Input />
                                </Form.Item>
                                {fields.map((field, index) => (
                                    <Form.Item
                                        {...(index === 0
                                            ? formItemLayout
                                            : formItemLayoutWithOutLabel)}
                                        label={index === 0 ? "Passengers" : ""}
                                        required={false}
                                        key={field.key}
                                    >
                                        <Form.Item
                                            {...field}
                                            validateTrigger={[
                                                "onChange",
                                                "onBlur",
                                            ]}
                                            rules={[
                                                {
                                                    required: true,
                                                    whitespace: true,
                                                    message:
                                                        "Please input passenger's name or delete this field.",
                                                },
                                            ]}
                                            noStyle
                                        >
                                            <Input
                                                placeholder="passenger name"
                                                style={{ width: "60%" }}
                                            />
                                        </Form.Item>
                                        {fields.length > 1 ? (
                                            <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                onClick={() =>
                                                    remove(field.name)
                                                }
                                            />
                                        ) : null}
                                    </Form.Item>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        style={{ width: "60%" }}
                                        icon={<PlusOutlined />}
                                    >
                                        Add field
                                    </Button>
                                    <Button
                                        type="dashed"
                                        onClick={() => {
                                            add("The head item", 0);
                                        }}
                                        style={{
                                            width: "60%",
                                            marginTop: "20px",
                                        }}
                                        icon={<PlusOutlined />}
                                    >
                                        Add field at head
                                    </Button>
                                    <Form.ErrorList errors={errors} />
                                </Form.Item>
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
