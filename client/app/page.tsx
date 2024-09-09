// pages/index.js (Next.js 12 и ниже)
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function IndexPage() {
    const router = useRouter();

    useEffect(() => {
        router.push("/shikimori"); // Замените 123 на нужный ID
    }, []);

    return null; // Можно вернуть пустой компонент
}
