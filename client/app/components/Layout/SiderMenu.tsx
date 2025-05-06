import { getRandomAnimeId } from "@/app/api/animes/getAnime";
import { RandomIcon } from "@/app/img/RandomIcon";
import { ShikimoriLogo } from "@/app/img/ShikimoriLogo";
import Icon, {
    CalendarOutlined,
    InfoCircleOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";
import { FloatButton, Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "../UserContext";
import styles from "./component.module.css";

// Определение интерфейса Props для компонента SiderMenu
interface Props {
    pathName: string; // Текущий путь (обязательно)
    collapsed: boolean; // Состояние свернутого меню (обязательно)
    setCollapsed: (value: boolean) => void; // Функция для изменения состояния свернутого меню (обязательно)
}

// Определение типа для элемента меню
type MenuItem = Required<MenuProps>["items"][number];

/**
 * @component ShikimoriMenuIcon
 * @description Компонент для отображения иконки Shikimori.
 * @param {Partial<CustomIconComponentProps>} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const ShikimoriMenuIcon = (
    props: Partial<CustomIconComponentProps>
): JSX.Element => <Icon component={ShikimoriLogo} {...props} />;

/**
 * @component RandomMenuIcon
 * @description Компонент для отображения иконки случайного аниме.
 * @param {Partial<CustomIconComponentProps>} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const RandomMenuIcon = (
    props: Partial<CustomIconComponentProps>
): JSX.Element => <Icon component={RandomIcon} {...props} />;

/**
 * @component SiderMenu
 * @description Компонент для отображения бокового меню сайта.
 * Включает в себя ссылки на основные разделы сайта, кнопку для получения случайного аниме и кнопку для перехода в админ-панель (для администраторов).
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const SiderMenu: React.FC<Props> = ({
    collapsed,
    setCollapsed,
    pathName,
}): JSX.Element => {
    // Получаем информацию о пользователе из хука useUser
    const { user } = useUser();

    // Состояние для хранения ключа текущего выбранного пункта меню
    const [currentKey, setCurrentKey] = useState<string>("animes");

    // Получаем экземпляр useRouter
    const router = useRouter();

    // Выполняет поиск случайного аниме и перенаправляет пользователя на страницу с его детальной информацией.
    const searchRandomAnime = async () => {
        try {
            const id = await getRandomAnimeId(); // Получаем случайный ID аниме
            router.push(`/animes/${id}`); // Перенаправляем пользователя на страницу с детальной информацией
        } catch (error) {
            console.error("Ошибка при получении случайного аниме:", error);
        }
    };

    // Массив элементов меню для боковой панели.
    const siderMenuItems: MenuItem[] = useMemo(() => {
        const baseItems: (MenuItem | false)[] = [
            {
                key: "animes",
                icon: <ShikimoriMenuIcon />,
                label: <Link href={"/animes"}>Главная</Link>,
            },
            {
                key: "calendar",
                icon: <CalendarOutlined />,
                label: <Link href={"/calendar"}>Календарь выхода</Link>,
            },
            {
                onClick: async () => searchRandomAnime(),
                key: "random",
                icon: <RandomMenuIcon />,
                label: "Случайное аниме",
            },
            user && user.roleId < 3
                ? {
                      key: "settings",
                      icon: <SettingOutlined />,
                      label: <Link href={"/settings"}>Админ-панель</Link>,
                  }
                : false,
        ];
        return baseItems.filter(Boolean) as MenuItem[]; // Фильтруем элементы, чтобы убрать false
    }, [user]);

    useEffect(() => {
        // Обновляем ключ текущего выбранного пункта меню при изменении pathName
        setCurrentKey(pathName?.replace("/", ""));
    }, [pathName]);

    return (
        <Sider
            width={235}
            breakpoint="xl"
            trigger={null}
            collapsible
            collapsed={collapsed}
            onBreakpoint={() => setCollapsed(true)}
            className={[styles.sider, collapsed ? styles.collapsed : ""].join(
                " "
            )}
            hidden={["/signup", "/login"].includes(pathName)}
        >
            <Menu
                className={styles["sider-menu"]}
                onSelect={({ key }) => {
                    setCurrentKey(key);
                    setCollapsed(true);
                }}
                selectedKeys={[currentKey]}
                mode="inline"
                items={siderMenuItems}
            />
            <FloatButton
                href="/about"
                tooltip={"Правила сайта"}
                className={
                    collapsed
                        ? styles["sider-menu-about-collapsed"]
                        : styles["sider-menu-about"]
                }
                icon={<InfoCircleOutlined />}
            />
        </Sider>
    );
};

export default SiderMenu;
