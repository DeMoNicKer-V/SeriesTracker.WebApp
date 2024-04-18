import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export const AZList = ({}) => {
    const lettersList = [
        "0-9",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
    ];

    return (
        <div>
            <div
                className="d-flex align-center mb-1"
                style={{
                    display: "inline-flex",
                    padding: "0 12px",
                }}
            >
                <div className="text-subtitle-2 text-uppercase font-weight-bold primary--text">
                    A-Z List
                </div>
                <div className="vertical-divider mx-4">|</div>
                <div className="text-caption">
                    Searching anime order by alphabet name A to Z.
                </div>
            </div>
            <div>
                <Link
                    key={"all"}
                    style={{ padding: "0 12px" }}
                    href={"/series"}
                >
                    <span>Всё</span>
                </Link>
                {lettersList.map((message) => (
                    <Link
                        key={message}
                        style={{ padding: "0 12px" }}
                        href={{
                            pathname: "/series",
                            query: {
                                query: message,
                            },
                        }}
                    >
                        <span>{message}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AZList;
