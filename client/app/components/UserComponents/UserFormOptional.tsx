import { DatePicker, Divider, Flex, Form, Space, Typography } from "antd";
import locale from "antd/es/date-picker/locale/ru_RU";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import React, { useState } from "react";
import AvatarPicker from "../../components/AvatarPicker";
import NameFormItem from "../../components/SingupComponents/NameFormItem";
import styles from "./component.module.css";
dayjs.locale("ru");

const { Text, Title } = Typography;

// Определение интерфейса Props для компонента UserFormOptional
interface Props {
    previewFile?: string; // URL предварительно загруженного файла аватара (опционально, по умолчанию "")
}

/**
 * @component UserFormOptional
 * @description Компонент для отображения необязательных полей формы профиля пользователя.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const UserFormOptional: React.FC<Props> = ({
    previewFile = "",
}: Props): JSX.Element => {
    const [avatar, setAvatar] = useState<string>(previewFile); // Состояние для хранения URL аватара

    return (
        <Flex className="flex-column">
            <Space
                className={styles["user-edit-form-head"]}
                style={{ justifyContent: "center" }}
                wrap
                size={[10, 10]}
            >
                <Form.Item noStyle valuePropName="fileList" name={"avatar"}>
                    <AvatarPicker preloadFile={avatar} onChange={setAvatar} />
                </Form.Item>
                <Flex className={styles["avatar-text"]}>
                    <Title level={5}>{"Выберите ваш аватар"}</Title>

                    <Text
                        type="secondary"
                        className={styles["user-edit-form-head-warning"]}
                    >
                        {
                            "только файлы формата JPG/PNG, размером не превышающие 256 КБ"
                        }
                    </Text>
                </Flex>
            </Space>

            <Divider>Как вас зовут?</Divider>

            <Space
                classNames={{ item: styles["user-edit-form-head"] }}
                wrap
                size={[10, 10]}
            >
                <NameFormItem name={"name"} label={"Имя"} />
                <NameFormItem name={"surName"} label={"Фамилия"} />
            </Space>

            <Form.Item
                layout="horizontal"
                label={<Divider>Дата рождения</Divider>}
                name={"dateBirth"}
                className="width-100"
                getValueProps={(value) => ({
                    value: value && dayjs(value),
                })}
                normalize={(value) =>
                    value && `${dayjs(value).format("YYYY-MM-DD")}`
                }
            >
                <DatePicker
                    variant="borderless"
                    locale={locale}
                    format={"D MMMM, YYYY"}
                    maxDate={dayjs(
                        new Date().setFullYear(new Date().getFullYear() - 18)
                    )}
                    className="width-100"
                    placeholder="Укажите дату рождения"
                ></DatePicker>
            </Form.Item>
        </Flex>
    );
};

export default UserFormOptional;
