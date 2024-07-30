"use client";
import BreadcrumbLayout from "../components/BreadcrumbLayout";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
