import Icon, {
    CalendarOutlined,
    InfoCircleOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { FloatButton, Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./component.module.css";

import { getRandomAnimeId } from "@/app/api/animes/getAnime";
import { RandomIcon } from "@/app/img/RandomIcon";
import { ShikimoriLogo } from "@/app/img/ShikimoriLogo";
import { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";
import { useRouter } from "next/navigation";
import { useUser } from "../UserContext";

interface Props {
    pathName: string;
    collapsed: boolean;

    setCollapsed: (value: boolean) => void;
}
const SiderMenu = ({ collapsed, setCollapsed, pathName }: Props) => {
    const { user } = useUser();
    const [currentKey, setCurrentKey] = useState<string>("animes");
    const router = useRouter();

    const ShikimoriMenuIcon = (props: Partial<CustomIconComponentProps>) => (
        <Icon component={ShikimoriLogo} {...props} />
    );
    const RandomMenuIcon = (props: Partial<CustomIconComponentProps>) => (
        <Icon component={RandomIcon} {...props} />
    );
    const viewRandomAnime = async () => {
        const id = await getRandomAnimeId();
        router.push(`/animes/${id}`);
    };

    type MenuItem = Required<MenuProps>["items"][number];
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
                onClick: async () => viewRandomAnime(),
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
        return baseItems.filter(Boolean) as MenuItem[];
    }, [user]);

    useEffect(() => {
        setCurrentKey(pathName?.replace("/", ""));
        //     setCurrentKey(pathName?.split("/")[1]);
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
                style={{
                    background: "transparent",
                }}
                mode="inline"
                items={siderMenuItems}
            />
            <FloatButton
                href="/about"
                tooltip={"Правила сайта"}
                style={
                    collapsed
                        ? { right: "25%", bottom: 20 }
                        : { right: "3%", bottom: 20 }
                }
                icon={<InfoCircleOutlined />}
            />
        </Sider>
    );
};

export default SiderMenu;
