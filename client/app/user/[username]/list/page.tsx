"use client";
import { getUserCategoriesCount } from "@/app/api/user/getUser";
import UserAnimesList from "@/app/components/Animes/UserAnimesList";
import ConditionalContent from "@/app/components/ConditionalContent";
import PageErrorView from "@/app/components/PageErrorVIew";
import { defaultGroups } from "@/app/constants/constants";
import {
    BookOutlined,
    CheckOutlined,
    CloseOutlined,
    EyeOutlined,
    FieldTimeOutlined,
    NumberOutlined,
    SyncOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    Breadcrumb,
    Col,
    ConfigProvider,
    Flex,
    Menu,
    MenuProps,
    Row,
} from "antd";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

type MenuItem = Required<MenuProps>["items"][number];

//  Основной компонент UserListPage (страница пользовательского списка аниме)
export default function UserListPage({
    params,
}: {
    params: { username: string };
}) {
    //  Получаем экземпляр роутера
    const router = useRouter();

    //  Получаем текущий путь
    const path = usePathname();

    //  Получаем параметры запроса из URL
    const search = useSearchParams();

    //  Состояние для отображения информации о том, пуст ли список аниме
    const [empty, setEmpty] = useState<boolean | null>(null);

    //  Состояние для хранения значения параметра mylist из URL
    const [mylist, setMylist] = useState<string | any>(
        search.get("mylist") ? search.get("mylist") : "0" //  Используем значение из URL или "0" по умолчанию
    );

    //  Состояние для хранения цветов категорий (id категории : цвет)
    const [colors, setColors] = useState<Map<string, string>>(
        new Map([["0", ""]])
    );

    //  Асинхронная функция для получения количества категорий пользователя
    const getUsersGroups = async (username: string) => {
        //  Получаем список категорий пользователя
        const groups = await getUserCategoriesCount(username);

        //  Если список категорий не пустой, устанавливаем empty в false
        if (groups && groups[0].seriesCount > 0) {
            setEmpty(false);
        } else {
            //  Иначе устанавливаем empty в true и возвращаем пустую карту
            setEmpty(true);
            return new Map();
        }

        //  Создаем карту (Map) для хранения цветов категорий
        const groupColors = new Map<string, string>(
            groups.map((item) => [item.id, item.color]) //  Преобразуем массив в карту (id категории : цвет)
        );
        setColors(groupColors); //  Обновляем состояние с цветами категорий

        //  Создаем карту (Map) для хранения количества аниме в каждой категории
        const seriesGroup = new Map<string, number>(
            groups.map((item) => [item.id, item.seriesCount]) //  Преобразуем массив в карту (id категории : количество)
        );
        return seriesGroup; //  Возвращаем карту с количеством аниме
    };

    //  Используем useSWR для получения данных о категориях пользователя
    const {
        data: groups = defaultGroups,
        error, //  Возможные ошибки при запросе
    } = useSWR<Map<string, number>>(params.username, getUsersGroups, {
        //  Отключаем автоматическую перепроверку при фокусе
        revalidateOnFocus: false,
        //  Отключаем автоматическую перепроверку при переподключении к сети
        revalidateOnReconnect: false,
        //  Устанавливаем количество попыток перезагрузки в случае ошибки на 0
        errorRetryCount: 0,
    });

    //  Массив элементов для меню сортировки
    const sortMenuItems: MenuItem[] = [
        {
            label: `Всё (${groups.get("0") ?? 0})`, //  Метка пункта меню (количество аниме)
            key: "0", //  Ключ пункта меню
            icon: <NumberOutlined />, //  Иконка пункта меню
        },
        {
            label: `Запланировано (${groups.get("1") ?? 0})`,
            key: "1",
            icon: <BookOutlined />,
            disabled: !groups.get("1"), //  Отключаем пункт меню, если нет аниме в категории
        },
        {
            label: `Смотрю (${groups.get("2") ?? 0})`,
            key: "2",
            icon: <EyeOutlined />,
            disabled: !groups.get("2"),
        },
        {
            label: `Просмотрено (${groups.get("3") ?? 0})`,
            key: "3",
            icon: <CheckOutlined />,
            disabled: !groups.get("3"),
        },
        {
            label: `Пересматриваю (${groups.get("4") ?? 0})`,
            key: "4",
            icon: <SyncOutlined />,
            disabled: !groups.get("4"),
        },
        {
            label: `Отложено (${groups.get("5") ?? 0})`,
            key: "5",
            icon: <FieldTimeOutlined />,
            disabled: !groups.get("5"),
        },
        {
            label: `Брошено (${groups.get("6") ?? 0})`,
            key: "6",
            icon: <CloseOutlined />,
            disabled: !groups.get("6"),
        },
    ];

    //  Эффект для обновления URL при изменении mylist (выбранной категории)
    useEffect(() => {
        router.push(`${path}?mylist=${mylist}`); //  Обновляем URL
    }, [mylist, path, router]);

    //  Функция для обработки выбора пункта меню сортировки
    const switchGroup: MenuProps["onSelect"] = (e) => {
        setMylist(e.key);
    };

    if (error) {
        return <PageErrorView text="Такого пользователя не существует" />;
    }

    return (
        <ConditionalContent
            condition={empty}
            onErrorNode={
                <PageErrorView
                    text="Пользователь еще ничего не добавил"
                    href="./"
                    btnText="Вернуться назад"
                />
            }
        >
            <div className="container">
                <title>{`${params.username} / Список аниме`}</title>
                <ConfigProvider
                    theme={{
                        components: {
                            Menu: {
                                itemBg: "transparent",
                                darkItemBg: "transparent",
                                itemSelectedColor: `${colors?.get(
                                    mylist
                                )} !important`,
                            },
                        },
                    }}
                >
                    <Breadcrumb
                        separator=""
                        items={[
                            {
                                title: (
                                    <Link href={"./"}>
                                        <Flex justify="center" gap={5}>
                                            <UserOutlined /> {params.username}
                                        </Flex>
                                    </Link>
                                ),
                            },

                            {
                                type: "separator",
                            },
                            {
                                title: "Список аниме",
                            },
                        ]}
                    />
                    <Row gutter={[15, 15]} align={"middle"} justify={"center"}>
                        <Col span={22}>
                            <Menu
                                style={{
                                    justifyContent: "center",
                                    backgroundColor: "transparent",
                                }}
                                onSelect={switchGroup}
                                selectedKeys={[mylist]}
                                items={sortMenuItems}
                                mode="horizontal"
                            />
                        </Col>

                        <Col span={24}>
                            <UserAnimesList
                                color={colors.get(mylist)}
                                myList={mylist}
                                userName={params.username}
                            />
                        </Col>
                    </Row>
                </ConfigProvider>
            </div>
        </ConditionalContent>
    );
}
