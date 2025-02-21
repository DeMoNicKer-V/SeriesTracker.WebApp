import {
    Flex,
    GetProp,
    message,
    Upload,
    UploadFile,
    UploadProps,
    Image,
    Form,
    ConfigProvider,
} from "antd";
import ImgCrop from "antd-img-crop";
import { Dispatch, SetStateAction, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
interface Props {
    onChange: (value: any) => void;
    preloadFile?: string;
}
const AvatarPicker = ({ onChange, preloadFile }: Props) => {
    const [fileList, setFileList] = useState<any[]>(
        preloadFile
            ? [
                  {
                      uid: "-1",
                      name: "image.png",
                      status: "done",
                      url: preloadFile,
                  },
              ]
            : []
    );
    const onUploadChange: UploadProps["onChange"] = ({
        fileList: newFileList,
    }) => {
        if (newFileList.length > 0) {
            const file = newFileList[0]; // Get the file object
            if (!file.originFileObj) {
                console.warn("originFileObj is undefined for file:", file);
                message.error("Ошибка загрузки файла. Попробуйте еще раз.");
                return;
            }

            const isJpgOrPng =
                file.type === "image/jpeg" || file.type === "image/png";
            if (!isJpgOrPng) {
                message.error("Только JPG/PNG файлы!");
                return;
            }
            const isLt2M = Number(file.size) / 1024 / 1024 < 0.25;
            if (!isLt2M) {
                message.error("Размер файла не должен превышать 256КБ!");
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
            reader.onloadend = () => {
                onChange(file.thumbUrl);
            };
        } else {
            onChange("");
        }
        setFileList(newFileList);
    };

    type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
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
        <ConfigProvider
            theme={{
                components: {
                    Modal: {
                        headerBg: "#123535",
                        footerBg: "#123535",
                        contentBg: "#123535",
                    },
                    Button: {
                        colorBgContainer: "transparent",
                        defaultShadow: "none",
                    },
                    Tooltip: {
                        colorBgSpotlight: "#123535",
                    },
                },
            }}
        >
            <Flex>
                <ImgCrop
                    maxZoom={2}
                    showReset
                    resetText="Сбросить"
                    modalOk="Выбрать"
                    modalCancel="Отмена"
                    fillColor={"transparent"}
                    modalTitle="Выбор изображения профиля"
                >
                    <Upload
                        className="avatar-picker"
                        listType="picture-card"
                        maxCount={1}
                        fileList={fileList}
                        onChange={onUploadChange}
                        onPreview={handlePreview}
                    >
                        {fileList.length < 1 && (
                            <Flex
                                style={{
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                            >
                                <UserOutlined
                                    style={{
                                        fontSize: 30,
                                    }}
                                />
                            </Flex>
                        )}
                    </Upload>
                </ImgCrop>
                {previewImage && (
                    <Image
                        wrapperStyle={{
                            display: "none",
                        }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) =>
                                setPreviewOpen(visible),
                            afterOpenChange: (visible) =>
                                !visible && setPreviewImage(""),
                        }}
                        src={previewImage}
                    />
                )}
            </Flex>
        </ConfigProvider>
    );
};

export default AvatarPicker;
