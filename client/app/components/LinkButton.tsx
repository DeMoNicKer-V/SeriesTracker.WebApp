import { Button } from "antd";
import React from "react";
import { LongRightArrow } from "../img/LongRightArrow";
import { LongLeftArrow } from "../img/LongLeftArrow";

interface Props {
    text?: string;
    href: string;
    iconPosition?: "start" | "end";
    arrowIcon?: "left" | "right";
}

const LinkButton = ({
    href,
    text,
    iconPosition = "end",
    arrowIcon = "right",
}: Props) => {
    return (
        <Button
            style={{ fontWeight: 700, width: "100%" }}
            type="link"
            href={href}
            icon={arrowIcon === "left" ? <LongLeftArrow /> : <LongRightArrow />}
            iconPosition={iconPosition}
        >
            {text}
        </Button>
    );
};
export default LinkButton;
