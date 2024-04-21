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
    Space,
    Tooltip,
    UploadProps,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import locale from "antd/locale/ru_RU";
import { LockOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import Dragger from "antd/es/upload/Dragger";

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
    const [description, setDescription] = useState<string>("");
    const [imagePath, setImageUrl] = useState<string>("");
    const [currentEpisode, setcurrentEpisode] = useState<number>(0);
    const [lastEpisode, setlastEpisode] = useState<number>(0);
    const [releaseDate, setReleaseDate] = useState<string>("");

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
            return;
        }
        if (info.file.status === "done") {
            getBase64(info.file.originFileObj as FileType, (url) => {
                setImageUrl(url);
            });
        }
    };
    useEffect(() => {
        setTitle(values.title);
        setDescription(values.description);
        setImageUrl(values.imageUrl);
        setcurrentEpisode(values.currentEpisode);
        setlastEpisode(values.lastEpisode);
        setReleaseDate(values.releaseDate);
    }, [values]);

    const handleOnOk = async () => {
        const seriesRequest = {
            title,
            description,
            imagePath,
            lastEpisode,
            currentEpisode,
            releaseDate,
        };
        console.log(seriesRequest);
        mode == Mode.Create
            ? handleCreate(seriesRequest)
            : handleUpdate(values.id, seriesRequest);
        onReset();
    };

    const [isShown, setIsShown] = useState(true);
    const handleClick = () => {
        setIsShown((current) => !current);
    };

    const onReset = () => {
        setImageUrl("");
        setIsShown(true);
        form.resetFields();
    };

    const [form] = Form.useForm<SeriesReqruest>();
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
                onFinish={(e: any) => handleOnOk()}
                style={{
                    display: "grid",
                    gap: "20px",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                form={form}
                layout="inline"
            >
                <Dragger
                    style={{
                        display: "flex",
                        marginLeft: "auto",
                        marginRight: "auto",
                        width: 220,
                    }}
                    onChange={handleChange}
                    showUploadList={false}
                >
                    {!imagePath && (
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
                    {imagePath && (
                        <Form.Item
                            style={{
                                display: "flex",
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                            name={"imagePath"}
                        >
                            <img
                                src={imagePath}
                                alt="poster"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    )}
                </Dragger>

                <Form.Item
                    style={{
                        display: "flex",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                    name={"title"}
                >
                    <Input
                        onChange={(e: {
                            target: { value: SetStateAction<string> };
                        }) => setTitle(e.target.value)}
                        style={{ width: "400px" }}
                        placeholder="Название"
                    />
                </Form.Item>

                {!isShown && (
                    <Space
                        style={{
                            display: "grid",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        <Form.Item
                            style={{
                                display: "flex",
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                            name="description"
                        >
                            <TextArea
                                onChange={(e: {
                                    target: { value: SetStateAction<string> };
                                }) => setDescription(e.target.value)}
                                placeholder="Описание"
                                style={{
                                    width: 400,
                                }}
                            />
                        </Form.Item>
                        <Button
                            type="link"
                            danger
                            style={{
                                display: "flex",
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                            onClick={() => {
                                handleClick();
                            }}
                        >
                            Удалить описание
                        </Button>
                    </Space>
                )}
                {isShown && (
                    <Form.Item>
                        <Button
                            type="link"
                            onClick={() => {
                                handleClick();
                            }}
                            block
                            icon={<PlusOutlined />}
                        >
                            Добавить описание
                        </Button>
                    </Form.Item>
                )}
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
                            onChange={(e: any) => setcurrentEpisode(Number(e))}
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
                            onChange={(e: any) => setlastEpisode(Number(e))}
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
                <ConfigProvider locale={locale}>
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
                        <DatePicker
                            style={{ width: 200 }}
                            placeholder="Дата выхода"
                            onChange={(date) => setReleaseDate(date.toString())}
                            format="D MMMM YYYY"
                        />
                    </Form.Item>
                </ConfigProvider>
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
