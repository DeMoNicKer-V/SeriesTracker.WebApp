import { useState, useEffect } from "react";

interface ImageDimensions {
    width: number | null;
}

function useImageDimensions(url: string | null): ImageDimensions {
    const [dimensions, setDimensions] = useState<ImageDimensions>({
        width: null,
    });

    useEffect(() => {
        if (!url) {
            return;
        }

        setDimensions((prev) => ({ ...prev }));

        const img = new Image();

        img.onload = () => {
            setDimensions({
                width: img.width,
            });
        };

        img.src = url;
    }, [url]);

    return dimensions;
}

export default useImageDimensions;
