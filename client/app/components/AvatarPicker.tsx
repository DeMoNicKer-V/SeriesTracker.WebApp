import {
    Flex,
    GetProp,
    message,
    Upload,
    UploadFile,
    UploadProps,
    Image,
    Form,
} from "antd";
import ImgCrop from "antd-img-crop";
import { Dispatch, SetStateAction, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
interface Props {
    onChange: (value: any) => void;
}
const AvatarPicker = ({ onChange }: Props) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const onUploadChange: UploadProps["onChange"] = ({
        fileList: newFileList,
    }) => {
        if (newFileList.length) {
            const isJpgOrPng =
                newFileList[0].type === "image/jpeg" ||
                newFileList[0].type === "image/png";
            if (!isJpgOrPng) {
                message.error("Только JPG/PNG файлы!");
                return;
            }
            const isLt2M = Number(newFileList[0].size) / 1024 / 1024 < 0.5;
            if (!isLt2M) {
                message.error("Размер файла не должен превышать 512КБ!");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(newFileList[0].thumbUrl);
            };
            reader.readAsDataURL(newFileList[0].originFileObj);
        } else onChange("");
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
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) =>
                            !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                />
            )}
        </Flex>
    );
};

export default AvatarPicker;
