"use client";
import { getSeriesById } from "@/app/services/series";
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
        <div>
            <Head>
                <title>A Doggo</title>
            </Head>

            <main>
                {/* // -> Render the id on the screen  */}
                <h1>This is Doggo: {series.title}.</h1>
                <p style={{ color: "#0070f3" }}>
                    <Link href="/series">Back Home</Link>
                </p>
            </main>
        </div>
    );
}
