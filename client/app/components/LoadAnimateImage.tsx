import { Image, Skeleton } from "antd"; // Импорт компонентов Image и Skeleton из Ant Design
import React, { useEffect, useState } from "react"; // Обязательный импорт React, useState и useEffect
import noFoundImage from ".//../img/img-error.jpg"; // Импорт изображения "не найдено"

// Определение интерфейса Props для компонента LoadAnimateImage
interface Props {
    src: string | undefined; // URL изображения (может быть undefined, если изображение отсутствует)
    maxWidth?: number; // Максимальная ширина изображения (опционально, по умолчанию 280px)
    preview?: boolean; // Флаг, указывающий, нужно ли отображать превью изображения (опционально, по умолчанию false)
    alt: string; // Альтернативный текст для изображения (обязательный атрибут для доступности)
    aspectRatio?: string; // Соотношение сторон изображения (опционально, по умолчанию "auto")
}

/**
 * @component LoadAnimateImage
 * @description Компонент для отображения изображения с анимацией загрузки и обработкой ошибок.
 * Показывает Skeleton (анимацию загрузки) до тех пор, пока изображение не загрузится.
 * Если изображение не загружается, отображает изображение "не найдено".
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const LoadAnimateImage: React.FC<Props> = ({
    src,
    maxWidth = 280,
    preview = false,
    alt,
    aspectRatio = "auto",
}: Props): JSX.Element => {
    const [isLoading, setIsLoading] = useState<boolean>(true); // Состояние загрузки изображения (true - загружается, false - загружено или ошибка)
    const [isError, setIsError] = useState<boolean>(false); // Состояние ошибки загрузки изображения (true - ошибка, false - нет ошибки)

    useEffect(() => {
        let img: HTMLImageElement; // Объявляем переменную img вне условия, чтобы она была доступна в return

        const loadImage = () => {
            if (!src) {
                setIsLoading(false);
                return;
            }
            img = new window.Image(); // Создаем новый объект Image

            img.onload = () => {
                setIsLoading(false); // Устанавливаем isLoading в false
            };

            img.onerror = () => {
                setIsLoading(false); // Устанавливаем isLoading в false
                setIsError(true); // Устанавливаем isError в true
            };

            img.src = src; // Устанавливаем src для начала загрузки изображения
        };

        loadImage(); // Вызываем функцию loadImage

        return () => {
            // Функция будет вызвана при unmount компонента
            if (img) {
                // Проверяем, был ли создан объект img
                img.onload = null;
                img.onerror = null;
            }
        };
    }, [src]);

    // Отображаем Skeleton, пока изображение загружается
    if (isLoading) {
        return <Skeleton.Image active />;
    }

    // Если произошла ошибка загрузки, отображаем изображение "не найдено"
    if (isError) {
        return (
            <Image
                src={noFoundImage.src}
                preview={false}
                style={{
                    maxWidth: maxWidth,
                    aspectRatio: aspectRatio,
                }}
                alt="Изображение не найдено"
            />
        );
    }

    // Если изображение успешно загружено, отображаем его
    return (
        <Image
            src={src}
            style={{
                maxWidth: maxWidth,
                aspectRatio: aspectRatio,
                objectFit: "cover",
            }}
            preview={
                preview
                    ? {
                          mask: "Посмотреть",
                      }
                    : false
            }
            alt={alt}
        />
    );
};

export default LoadAnimateImage;
