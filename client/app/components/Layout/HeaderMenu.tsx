import {
    Avatar,
    Button,
    Col,
    Divider,
    Dropdown,
    Flex,
    MenuProps,
    Row,
    Space,
    Typography,
} from "antd";
import { Header } from "antd/es/layout/layout";

import {
    BookOutlined,
    LogoutOutlined,
    MailOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SettingOutlined,
    UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { LogOut } from "@/app/api/coockie";
import { useRouter } from "next/navigation";
import { LogoIcon } from "@/app/img/LogoIcon";

import styles from "./component.module.css";
import SearchBar from "../Searchbar/searchbar";
interface Props {
    pathName: string;
    user?: User;
    collapsed: boolean;
    setCollapsed: (value: any) => void;
}

const HeaderMenu = ({ collapsed, user, pathName, setCollapsed }: Props) => {
    const router = useRouter();
    const items: MenuProps["items"] = [
        {
            label: user?.email,
            key: "0",
            style: { cursor: "default" },
            icon: <MailOutlined />,
            disabled: true,
        },
        {
            label: <Divider style={{ margin: 0, padding: 0 }} />,
            style: { cursor: "default" },
            key: "divider",
            disabled: true,
        },
        {
            label: (
                <Link href={`/user/${user?.userName}`} target="_top">
                    Профиль
                </Link>
            ),
            key: "1",
            icon: <UserOutlined />,
        },
        {
            label: (
                <Link href={`/user/${user?.userName}/list`} target="_top">
                    Мои аниме
                </Link>
            ),
            key: "2",
            icon: <BookOutlined />,
        },
        {
            label: (
                <Link href={`/user/${user?.userName}/edit`} target="_top">
                    Настройки
                </Link>
            ),
            key: "3",
            icon: <SettingOutlined />,
        },
        {
            label: (
                <Link href={"/login"} target="_top">
                    Выйти
                </Link>
            ),
            key: "4",
            onClick: async () => {
                await LogOut();
                router;
            },
            icon: <LogoutOutlined />,
        },
    ];

    return (
        <Header
            className={styles["header"]}
            hidden={["/signup", "/login"].includes(pathName)}
        >
            <Row align="middle" justify={"space-between"}>
                <Col>
                    <Flex>
                        <Button
                            type="text"
                            icon={
                                collapsed ? (
                                    <MenuUnfoldOutlined />
                                ) : (
                                    <MenuFoldOutlined />
                                )
                            }
                            onClick={() => setCollapsed(!collapsed)}
                        />
                        <Button
                            style={{ cursor: "pointer" }}
                            disabled={pathName === "/shikimori"}
                            href="/shikimori"
                            type="link"
                        >
                            <LogoIcon
                                width={40}
                                height={40}
                                firstColor="white"
                                secondColor="#44a5a6"
                            />
                        </Button>
                    </Flex>
                </Col>

                <Col xs={0} sm={0} md={0} xl={10}>
                    <SearchBar />
                </Col>

                {user ? (
                    <Col>
                        <Dropdown menu={{ items }}>
                            <Button
                                type="text"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    margin: 0,
                                    padding: 0,
                                }}
                            >
                                <Space
                                    style={{
                                        padding: "0 10px",
                                    }}
                                    size={[20, 20]}
                                >
                                    <Avatar
                                        style={{
                                            borderColor: "#313131",
                                        }}
                                        size={40}
                                        shape="circle"
                                        src={user?.avatar}
                                    ></Avatar>
                                    <Typography.Title level={5}>
                                        {user?.userName}
                                    </Typography.Title>
                                </Space>
                            </Button>
                        </Dropdown>
                    </Col>
                ) : (
                    <Col>
                        <Space size={[10, 10]}>
                            <Button
                                href={"/login"}
                                target="_top"
                                type="link"
                                size="small"
                            >
                                Войти
                            </Button>
                            <Button
                                target="_top"
                                href={"/signup"}
                                type="primary"
                                ghost
                                size="small"
                            >
                                Регистрация
                            </Button>
                        </Space>
                    </Col>
                )}
            </Row>
        </Header>
    );
};
export default HeaderMenu;
