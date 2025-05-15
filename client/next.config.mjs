/** @type {import('next').NextConfig} */
const nextConfig = {
    // ... другие настройки
    async redirects() {
        return [
            {
                source: "/", //  Исходный путь (корень сайта)
                destination: "/animes", //  Куда перенаправляем
                permanent: false, //  Укажите true для постоянного перенаправления (код 301)
            },
        ];
    },
    reactStrictMode: true, //  Включаем строгий режим
    output: "export", // Обязательно для статической экспортируемости
    distDir: "wwwroot", // Укажите выходную директорию.  Это папка, которую будет обслуживать ваш C# backend.  Например, 'wwwroot', 'public', и т.д.
    assetPrefix: "", // Важно для корректной работы при экспорте
    images: {
        unoptimized: true, // Важно при output: 'export'
    },
};

export default nextConfig;
