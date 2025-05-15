/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, //  Включаем строгий режим
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
};

export default nextConfig;
