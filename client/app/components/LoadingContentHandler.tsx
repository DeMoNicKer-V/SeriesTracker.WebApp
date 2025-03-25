import React from "react";
import Loading from "./Loading";

interface Props {
    condition: boolean | null;
    defaultNode: React.ReactNode;
    onErrorNode?: React.ReactNode;
}

const LoadingContentHandler: React.FC<Props> = ({
    condition,
    defaultNode,
    onErrorNode,
}) => {
    if (condition === null) {
        return <Loading loading />;
    }

    return condition === false ? defaultNode : onErrorNode || null;
};

export default LoadingContentHandler;
