import { UserOutlined } from "@ant-design/icons";
import {
    ConfigProvider,
    Flex,
    Image,
    message,
    Upload,
    UploadFile,
    UploadProps,
} from "antd";
import ImgCrop from "antd-img-crop";
import { useCallback, useState } from "react";
import styles from "./components.module.css";
// Определение интерфейса Props для компонента AvatarPicker
interface Props {
    onChange: (value: string) => void; // Callback-функция, вызываемая при изменении выбранного аватара (принимает DataURL изображения)
    preloadFile?: string; // URL предварительно загруженного файла (опционально)
}

/**
 * @component AvatarPicker
 * @description Компонент для выбора и загрузки аватара.
 * Позволяет пользователю загрузить изображение, которое будет использоваться в качестве аватара.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const AvatarPicker: React.FC<Props> = ({
    onChange,
    preloadFile,
}: Props): JSX.Element => {
    const [fileList, setFileList] = useState<UploadFile[]>(
        // Состояние fileList (массив загруженных файлов)
        preloadFile
            ? [
                  // Если preloadFile существует, создаем объект файла для отображения
                  {
                      uid: "-1", // Уникальный ID файла
                      name: "image.png", // Имя файла (отображается в списке)
                      status: "done", // Статус загрузки (done - загружено)
                      url: preloadFile, // URL изображения
                      thumbUrl: preloadFile, // URL миниатюры (используется для отображения превью)
                  },
              ]
            : []
    );

    const [previewOpen, setPreviewOpen] = useState(false); // Состояние для модального окна превью
    const [previewImage, setPreviewImage] = useState(""); // URL изображения для превью

    /**
     * @function checkFileType
     * @description Проверяет, является ли файл изображением в формате JPG или PNG.
     * @param {File} file - Объект File.
     * @returns {boolean} - True, если файл является JPG или PNG, иначе false.
     */
    const checkFileType = (file: File): boolean => {
        return file.type === "image/jpeg" || file.type === "image/png";
    };

    /**
     * @function checkFileSize
     * @description Проверяет, не превышает ли размер файла 256KB.
     * @param {File} file - Объект File.
     * @returns {boolean} - True, если размер файла не превышает 256KB, иначе false.
     */
    const checkFileSize = (file: File): boolean => {
        return Number(file.size) / 1024 / 1024 < 0.25;
    };

    /**
     * @function handleUpload
     * @description Загружает файл и возвращает DataURL изображения.
     * @param {File} file - Объект File.
     * @param {(url: string) => void} callback - Callback-функция, вызываемая с DataURL изображения.
     * @returns {Promise<void>}
     */
    const handleUpload = async (
        file: File,
        callback: (url: string) => void
    ): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            //  Заменяем resolve на reject
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const url = reader.result as string;
                callback(url);
                resolve();
            };
            reader.onerror = (error) => {
                console.error("Ошибка при чтении файла:", error); // Логируем ошибку
                message.error("Ошибка при чтении файла. Попробуйте еще раз."); //  Показываем сообщение об ошибке пользователю
                reject(error); // Вызываем reject
            };
        });
    };

    /**
     * @function onUploadChange
     * @description Обработчик события onChange для Upload-компонента.
     * Проверяет тип и размер файла, загружает файл и вызывает callback-функцию onChange с DataURL изображения.
     * @param {UploadProps["onChange"]} options - Объект с параметрами события onChange.
     * @returns {Promise<void>}
     */
    const onUploadChange: UploadProps["onChange"] = async ({
        fileList: newFileList,
        file,
    }) => {
        if (newFileList.length > 0 && file && file.originFileObj) {
            // Проверяем, что есть загруженный файл и originFileObj существует
            const isJpgOrPng = checkFileType(file.originFileObj); // Проверяем тип файла
            if (!isJpgOrPng) {
                message.error("Только JPG/PNG файлы!");
                return;
            }

            const isLt2M = checkFileSize(file.originFileObj); // Проверяем размер файла
            if (!isLt2M) {
                message.error("Размер файла не должен превышать 256КБ!");
                return;
            }

            await handleUpload(file.originFileObj as File, (url) => {
                // Загружаем файл
                onChange(url); // Вызываем callback-функцию с DataURL изображения
            }).catch(() => {
                // Обрабатываем ошибку, если она произошла в handleUpload
            });
        } else {
            onChange(""); // Если нет загруженных файлов, вызываем callback-функцию с пустой строкой
        }
        setFileList(newFileList); // Обновляем состояние fileList
    };

    /**
     * @function handlePreview
     * @description Обработчик события onPreview для Upload-компонента.
     * Открывает модальное окно с превью изображения.
     * @param {UploadFile} file - Объект UploadFile.
     * @returns {Promise<void>}
     */
    const handlePreview = useCallback(async (file: UploadFile) => {
        // Используем useCallback для мемоизации функции
        if (!file.url && !file.preview) {
            // Если нет URL и preview, получаем DataURL
            file.preview = await getBase64(file.originFileObj as File);
        }
        setPreviewImage(file.url || (file.preview as string)); // Устанавливаем URL изображения для превью
        setPreviewOpen(true); // Открываем модальное окно
    }, []);

    /**
     * @function getBase64
     * @description Получает DataURL из файла.
     * @param {File} file - Объект File.
     * @returns {Promise<string>} - Promise с DataURL изображения.
     */
    const getBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

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
                        accept=".png, .jpg, .jpeg"
                    >
                        {fileList.length < 1 && (
                            <Flex className="flex-column" justify="center">
                                <UserOutlined
                                    className={styles["avatar-picker-icon"]}
                                />
                            </Flex>
                        )}
                    </Upload>
                </ImgCrop>
                {previewImage && (
                    // Отображаем компонент Image для предпросмотра изображения
                    <Image
                        wrapperClassName={styles["avatar-picker-image"]}
                        preview={{
                            // Настройки предпросмотра
                            visible: previewOpen, // Видимость модального окна
                            onVisibleChange: (visible) =>
                                setPreviewOpen(visible), // Обработчик изменения видимости
                            afterOpenChange: (visible) =>
                                !visible && setPreviewImage(""), // Сбрасываем previewImage после закрытия
                        }}
                        src={previewImage} // URL изображения для предпросмотра
                    />
                )}
            </Flex>
        </ConfigProvider>
    );
};

export default AvatarPicker;
