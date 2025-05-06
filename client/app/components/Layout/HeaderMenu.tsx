import { LogoIcon } from "@/app/img/LogoIcon";
import { MenuOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Row } from "antd";
import { Header } from "antd/es/layout/layout";
import SearchBar from "../Searchbar/Searchbar";
import UserProfile from "../UserComponents/UserProfile";
import { useUser } from "../UserContext";
import styles from "./component.module.css";

// Определение интерфейса Props для компонента HeaderMenu
interface Props {
    pathName: string; // Текущий путь (обязательно)
    collapsed: boolean; // Состояние свернутого меню (обязательно)
    setCollapsed: (value: boolean) => void; // Функция для изменения состояния свернутого меню (обязательно)
}

/**
 * @component HeaderMenu
 * @description Компонент для отображения шапки сайта.
 * Включает в себя кнопку для сворачивания/разворачивания меню, логотип, поисковую строку и профиль пользователя.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const HeaderMenu: React.FC<Props> = ({
    collapsed,
    pathName,
    setCollapsed,
}): JSX.Element => {
    const { user } = useUser(); // Получаем информацию о пользователе из хука useUser

    return (
        <Header
            className={styles["header"]}
            hidden={["/signup", "/login"].includes(pathName)}
        >
            <Row align="middle" justify={"space-between"}>
                <Col>
                    <Flex>
                        <Button
                            size="large"
                            type="text"
                            icon={<MenuOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                        />
                        <Button
                            className={styles["nav-header-btn"]}
                            disabled={pathName === "/animes"}
                            href="/animes"
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

                <Col>
                    <UserProfile user={user} />
                </Col>
            </Row>
        </Header>
    );
};

export default HeaderMenu;
