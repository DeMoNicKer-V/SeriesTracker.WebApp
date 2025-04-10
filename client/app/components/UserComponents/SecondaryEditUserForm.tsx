import React, { Dispatch, SetStateAction, useState } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import {
    Button,
    DatePicker,
    Flex,
    Form,
    Space,
    Typography,
    Divider,
    FormInstance,
} from "antd";

import locale from "antd/es/date-picker/locale/ru_RU";
import AvatarPicker from "../../components/AvatarPicker";
import { LongLeftArrow } from "../../img/LongLeftArrow";
import { LongRightArrow } from "../../img/LongRightArrow";
import NameFormItem from "../../components/SingupComponents/NameFormItem";

import dayjs from "dayjs";
import "dayjs/locale/ru";
dayjs.locale("ru");

const { Text, Title } = Typography;

interface Props {
    previewFile?: string;
}
const SecondaryEditUserForm = ({ previewFile = "" }: Props) => {
    const [avatar, setAvatar] = useState<string>(previewFile);

    return (
        <Flex className="flex-column">
            <Space
                className="wrap-title"
                style={{ justifyContent: "center" }}
                wrap
                size={[10, 10]}
            >
                <Form.Item noStyle valuePropName="fileList" name={"avatar"}>
                    <AvatarPicker preloadFile={avatar} onChange={setAvatar} />
                </Form.Item>
                <Flex className="flex-column">
                    <Title level={5}>{"Выберите ваш аватар"}</Title>

                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {
                            "только файлы формата JPG/PNG, размером не превышающие 256 КБ"
                        }
                    </Text>
                </Flex>
            </Space>

            <Divider>Как вас зовут?</Divider>

            <Space styles={{ item: { flex: "auto" } }} wrap size={[10, 10]}>
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

export default SecondaryEditUserForm;
