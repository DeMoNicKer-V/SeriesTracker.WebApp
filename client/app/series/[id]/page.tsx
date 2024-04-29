"use client";
import { getSeriesById } from "@/app/services/series";
import { Col, Row } from "antd";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Doggo({ params }: { params: { id: string } }) {
    const [series, setSeries] = useState<Series["item1"][] | any>([]);
    const getSeries = async (id: string) => {
        const series = await getSeriesById(id);
        setSeries(series);
    };
    useEffect(() => {
        getSeries(params.id);
    }, []);
    return (
        <div className="container">
            <p style={{ color: "#0070f3" }}>
                <Link href="/series">Back Home</Link>
            </p>

            <div
                style={{
                    backgroundImage: `url(${series.imagePath})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center center",
                    height: "100%",
                    width: "100%",
                    left: 0,
                    top: 0,
                    position: "absolute",
                }}
            />
        </div>
    );
}
