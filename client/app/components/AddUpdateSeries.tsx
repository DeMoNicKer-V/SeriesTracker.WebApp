import { SetStateAction, useEffect, useState } from "react";
import { SeriesReqruest } from "../services/series";
import {
    Button,
    Checkbox,
    ConfigProvider,
    DatePicker,
    Divider,
    Form,
    GetProp,
    Input,
    InputNumber,
    Modal,
    Rate,
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
    const [watchedEpisode, setWatchedEpisode] = useState<number>(0);
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
        console.log(values.releaseDate);
        console.log(values.title);
        setTitle(values.title);
        setDescription(values.description);
        setIsShown(values.description === "");
        setImageUrl(values.imagePath);
        setWatchedEpisode(values.watchedEpisode);
        setlastEpisode(values.lastEpisode);
        setReleaseDate(values.releaseDate);
    }, [values]);

    const handleOnOk = async () => {
        const seriesRequest = {
            title,
            description,
            imagePath,
            lastEpisode,
            watchedEpisode,
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
        setDescription("");
        setIsShown((current) => !current);
    };

    const onReset = () => {
        setTitle("");
        setDescription("");
        setIsShown(true);
        setImageUrl("");
        setWatchedEpisode(0);
        setlastEpisode(0);
        setReleaseDate("");
    };
    var dayjs = require("dayjs");
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
            destroyOnClose={true}
            open={isModalOpen}
            onCancel={() => {
                handleCancel();
                onReset();
            }}
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
                layout="inline"
            >
                <Space
                    style={{
                        display: "flex",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                >
                    <Dragger
                        style={{
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
                                    Нажмите или перетяните изображение для
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
                            >
                                <img
                                    src={imagePath}
                                    alt="poster"
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        )}
                    </Dragger>
                </Space>
                <Form.Item
                    style={{
                        display: "flex",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                >
                    <Rate count={10} allowHalf defaultValue={0} />
                </Form.Item>
                <Space
                    style={{
                        display: "flex",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                >
                    <Form.Item>
                        <TextArea
                            autoSize={{ minRows: 1, maxRows: 2 }}
                            maxLength={70}
                            value={title}
                            onChange={(e: {
                                target: { value: SetStateAction<string> };
                            }) => setTitle(e.target.value)}
                            style={{ width: "300px", textAlign: "center" }}
                            placeholder="Название"
                        />
                    </Form.Item>
                    <Checkbox />
                </Space>

                <Divider
                    style={{ marginTop: "-10px", marginBottom: "-10px" }}
                />

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
                        >
                            <TextArea
                                value={description}
                                onChange={(e: {
                                    target: { value: SetStateAction<string> };
                                }) => setDescription(e.target.value)}
                                placeholder="Описание"
                                style={{ textAlign: "center", width: 400 }}
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
                    direction="horizontal"
                    style={{ width: "100%", justifyContent: "center" }}
                >
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: "Введите кол-во эпизодов!",
                            },
                        ]}
                    >
                        <InputNumber
                            value={watchedEpisode}
                            onChange={(e: any) => setWatchedEpisode(Number(e))}
                            controls={false}
                            style={{ width: "120px" }}
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
                    <Form.Item>
                        <Button type="text">#end</Button>
                    </Form.Item>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: "Введите кол-во эпизодов!",
                            },
                        ]}
                    >
                        <InputNumber
                            value={lastEpisode}
                            onChange={(e: any) => setlastEpisode(Number(e))}
                            controls={false}
                            style={{ width: "120px" }}
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
                        rules={[
                            {
                                required: true,
                                message: "Пожалуйста, укажите дату выхода!",
                            },
                        ]}
                    >
                        <DatePicker
                            allowClear={false}
                            value={
                                releaseDate === ""
                                    ? dayjs()
                                    : dayjs(releaseDate)
                            }
                            style={{ width: 200 }}
                            placeholder="Дата выхода"
                            onChange={(date) => {
                                setReleaseDate(date.toDate().toString());
                            }}
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
