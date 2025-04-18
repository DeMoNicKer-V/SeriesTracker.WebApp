import { Button, Col, Flex, Row } from "antd";
import { Header } from "antd/es/layout/layout";

import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { LogoIcon } from "@/app/img/LogoIcon";

import styles from "./component.module.css";
import SearchBar from "../Searchbar/Searchbar";
import UserProfile from "../UserComponents/UserProfile";
interface Props {
    pathName: string;
    user?: User;
    collapsed: boolean;
    setCollapsed: (value: any) => void;
}

const HeaderMenu = ({ collapsed, user, pathName, setCollapsed }: Props) => {
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

                <Col>
                    <UserProfile user={user} />
                </Col>
            </Row>
        </Header>
    );
};
export default HeaderMenu;
