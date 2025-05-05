// constants.ts
export const defaultCategories = [
    { value: 1, label: "Запланировано" },
    { value: 2, label: "Смотрю" },
    { value: 3, label: "Просмотрено" },
    { value: 4, label: "Пересматриваю" },
    { value: 5, label: "Отложено" },
    { value: 6, label: "Брошено" },
];

export const defaultGroups = new Map([
    ["0", 0],
    ["1", 0],
    ["2", 0],
    ["3", 0],
    ["4", 0],
    ["5", 0],
    ["6", 0],
]);

export const statusOptions = [
    { russian: "Онгоинг", id: "ongoing" },
    { russian: "Вышло", id: "released" },
    { russian: "Анонс", id: "anons" },
];

export const kindOptions = [
    { russian: "TV-Сериал", id: "tv" },
    { russian: "П/ф", id: "movie" },
    { russian: "ONA", id: "ona" },
    { russian: "OVA", id: "ova" },
    { russian: "Спешл", id: "special" },
    { russian: "TV-Спешл", id: "tv_special" },
];
