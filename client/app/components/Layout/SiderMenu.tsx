import { FloatButton, Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import { useEffect, useMemo, useState } from "react";
import Icon, {
    BookOutlined,
    LogoutOutlined,
    MailOutlined,
    InfoCircleOutlined,
    MenuUnfoldOutlined,
    SettingOutlined,
    UserOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import styles from "./component.module.css";
import Link from "next/link";
import { getRandomAnime } from "@/app/services/shikimori";
import { useRouter } from "next/navigation";
import { ShikimoriLogo } from "@/app/img/ShikimoriLogo";
import { RandomIcon } from "@/app/img/RandomIcon";
import { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

interface Props {
    pathName: string;
    collapsed: boolean;
    user?: User;
    setLoading: (value: boolean) => void;
    setCollapsed: (value: boolean) => void;
}
const SiderMenu = ({
    collapsed,
    user,
    setLoading,
    setCollapsed,
    pathName,
}: Props) => {
    const [currentKey, setCurrentKey] = useState<string>("shikimori");
    const router = useRouter();
    const ShikimoriMenuIcon = (props: Partial<CustomIconComponentProps>) => (
        <Icon component={ShikimoriLogo} {...props} />
    );
    const RandomMenuIcon = (props: Partial<CustomIconComponentProps>) => (
        <Icon component={RandomIcon} {...props} />
    );
    const getRandomAnimeId = async () => {
        const id = await getRandomAnime();
        router.push(`/shikimori/${id}`);
    };
    type MenuItem = Required<MenuProps>["items"][number];
    const siderMenuItems: MenuItem[] = useMemo(() => {
        const baseItems: (MenuItem | false)[] = [
            {
                key: "shikimori",
                icon: <ShikimoriMenuIcon />,
                label: <Link href={"/shikimori"}>Главная</Link>,
            },
            {
                key: "calendar",
                icon: <CalendarOutlined />,
                label: <Link href={"/calendar"}>Календарь выхода</Link>,
            },
            {
                onClick: async () => getRandomAnimeId(),
                key: "random",
                icon: <RandomMenuIcon />,
                label: "Случайное аниме",
            },
            user && user.roleId < 3
                ? {
                      key: "settings",
                      icon: <SettingOutlined />,
                      label: <Link href={"/settings"}>Настройки</Link>,
                  }
                : false,
        ];
        return baseItems.filter(Boolean) as MenuItem[];
    }, [user]);

    useEffect(() => {
        setCurrentKey(pathName?.split("/")[1]);
        setLoading(false);
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
                className="sider-menu"
                onSelect={({ key }) => {
                    setLoading(true);
                    setCurrentKey(key);
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
