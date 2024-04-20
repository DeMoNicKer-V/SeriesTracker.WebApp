import { SetStateAction, useEffect, useState } from "react";
import { SeriesReqruest } from "../services/series";
import {
    Button,
    ConfigProvider,
    DatePicker,
    Form,
    GetProp,
    Input,
    InputNumber,
    Modal,
    Slider,
    Space,
    Tooltip,
    Upload,
    UploadProps,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import locale from "antd/locale/ru_RU";
import { LockOutlined, UserOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { Image } from "antd";
import Dragger from "antd/es/upload/Dragger";

const CorrectImage = Image as any;
dayjs.locale("ru");

interface Props {
    mode: Mode;
    values: Series["item1"];
    isModalOpen: boolean;
    handleCancel: () => void;
    handleCreate: (request: SeriesReqruest) => void;
    handleUpdate: (id: string, request: SeriesReqruest) => void;
}

export enum Mode {
    Create,
    Edit,
}
export const CreateUpdateSeries = ({
    mode,
    values,
    isModalOpen,
    handleCancel,
    handleCreate,
    handleUpdate,
}: Props) => {
    const [title, setTitle] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [currentEpisode, setcurrentEpisode] = useState<number>(0);
    const [lastEpisode, setlastEpisode] = useState<number>(0);
    const [releaseDate, setReleaseDate] = useState<string>("");

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

    const getBase64 = (img: FileType, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener("load", () =>
            callback(reader.result as string)
        );
        reader.readAsDataURL(img);
    };

    const handleChange: UploadProps["onChange"] = (info) => {
        if (info.file.status === "uploading") {
            setLoading(true);
            return;
        }
        if (info.file.status === "done") {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as FileType, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };
    useEffect(() => {
        setTitle(values.title);
        setDescription(values.description);
        setlastEpisode(values.lastEpisode);
    }, [values]);

    const handleOnOk = async () => {
        const seriesRequest = {
            title,
            description,
            lastEpisode,
            currentEpisode,
            releaseDate,
        };
        mode == Mode.Create
            ? handleCreate(seriesRequest)
            : handleUpdate(values.id, seriesRequest);
    };
    const [form] = Form.useForm();
    const [clientReady, setClientReady] = useState<boolean>(false);
    const [isShown, setIsShown] = useState(true);
    const handleClick = () => {
        setIsShown((current) => !current);
    };
    // To disable submit button at the beginning.
    useEffect(() => {
        setClientReady(true);
    }, []);

    const onFinish = (values: any) => {
        console.log("Finish:", values);
    };

    const normFile = (e: any) => {
        console.log("Upload event:", e);

        if (Array.isArray(e)) {
            return e;
        }

        //change "return e && e.fileList" for
        return e && e.fileList.slice(-1);
    };

    const onReset = () => {
        setImageUrl("");
        setIsShown(true);
        form.resetFields();
    };
    return (
        <Modal
            style={{
                display: "flex",
            }}
            title={
                <p
                    style={{
                        display: "grid",
                        gap: "20px",
                        fontSize: 20,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {mode == Mode.Create
                        ? "Добавление сериала"
                        : "Редактирование сериал"}
                </p>
            }
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                style={{
                    display: "grid",
                    gap: "20px",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                form={form}
                name="horizontal_login"
                layout="inline"
                onFinish={onFinish}
            >
                <Form.Item
                    style={{
                        display: "flex",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                >
                    <Dragger
                        style={{ width: 220 }}
                        onChange={handleChange}
                        showUploadList={false}
                    >
                        {!imageUrl && (
                            <div>
                                <p className="ant-upload-drag-icon">
                                    <LockOutlined />
                                </p>
                                <p
                                    style={{ fontSize: 15 }}
                                    className="ant-upload-text"
                                >
                                    Кликните или перетяните изображение для
                                    добавления
                                </p>
                                <p
                                    style={{ fontSize: 12 }}
                                    className="ant-upload-hint"
                                >
                                    Поддерживаются только jpg/png файлы.
                                </p>
                            </div>
                        )}
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt="avatar"
                                style={{ width: "100%" }}
                            />
                        )}
                    </Dragger>
                </Form.Item>

                <Form.Item
                    style={{
                        display: "flex",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                    name="title"
                >
                    <Input style={{ width: "400px" }} placeholder="Название" />
                </Form.Item>

                <Form.List name="users">
                    {(
                        fields: { [x: string]: any; key: any; name: any }[],
                        { add, remove }: any
                    ) => (
                        <>
                            {fields.map(({ name }) => (
                                <Form.Item
                                    style={{
                                        display: "flex",
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                    }}
                                    name="description"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Введите описание",
                                        },
                                    ]}
                                >
                                    <TextArea
                                        placeholder="Описание"
                                        style={{
                                            width: 400,
                                        }}
                                    />
                                    <Button
                                        type="link"
                                        danger
                                        style={{
                                            display: "flex",
                                            marginLeft: "auto",
                                            marginRight: "auto",
                                        }}
                                        onClick={() => {
                                            remove(name), handleClick();
                                        }}
                                    >
                                        Удалить описание
                                    </Button>
                                </Form.Item>
                            ))}
                            {isShown && (
                                <Form.Item>
                                    <Button
                                        type="link"
                                        onClick={() => {
                                            add(), handleClick();
                                        }}
                                        block
                                        icon={<PlusOutlined />}
                                    >
                                        Добавить описание
                                    </Button>
                                </Form.Item>
                            )}
                        </>
                    )}
                </Form.List>
                <Space
                    style={{
                        display: "flex",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                >
                    <Form.Item
                        name="currentEpisode"
                        rules={[
                            {
                                required: true,
                                message: "Введите кол-во эпизодов!",
                            },
                        ]}
                    >
                        <InputNumber
                            controls={false}
                            style={{ width: "150px" }}
                            addonBefore={
                                <Tooltip
                                    placement="bottom"
                                    title={"Сколько эпизодов просмотрено"}
                                >
                                    <p style={{ fontSize: 13 }}>#start</p>
                                </Tooltip>
                            }
                            min={0}
                            changeOnWheel
                        />
                    </Form.Item>
                    <Form.Item
                        name="lastEpisode"
                        rules={[
                            {
                                required: true,
                                message: "Введите кол-во эпизодов!",
                            },
                        ]}
                    >
                        <InputNumber
                            controls={false}
                            style={{ width: "150px" }}
                            addonBefore={
                                <Tooltip
                                    placement="bottom"
                                    title={"Сколько всего эпизодов"}
                                >
                                    <p style={{ fontSize: 13 }}>#final</p>
                                </Tooltip>
                            }
                            min={1}
                            changeOnWheel
                        />
                    </Form.Item>
                </Space>
                <Form.Item
                    style={{
                        display: "flex",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                    name="releaseDate"
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, укажите дату выхода!",
                        },
                    ]}
                >
                    <ConfigProvider locale={locale}>
                        <DatePicker
                            style={{ width: 200 }}
                            placeholder="Дата выхода"
                            format="D MMMM YYYY"
                            onChange={(date) => setReleaseDate(date.toString())}
                        />
                    </ConfigProvider>
                </Form.Item>
                <Form.Item
                    style={{
                        display: "flex",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                >
                    <Space>
                        <Button type="primary" htmlType="submit">
                            {mode == Mode.Create ? "Добавить" : "Изменить"}
                        </Button>
                        <Button htmlType="button" onClick={onReset}>
                            Очистить
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};
