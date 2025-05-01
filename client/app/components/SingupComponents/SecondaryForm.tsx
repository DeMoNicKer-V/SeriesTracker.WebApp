import { InfoCircleOutlined } from "@ant-design/icons";
import {
    Button,
    DatePicker,
    Divider,
    Flex,
    Form,
    FormInstance,
    Space,
    Typography,
} from "antd";
import { Dispatch, SetStateAction, useState } from "react";

import locale from "antd/es/date-picker/locale/ru_RU";
import AvatarPicker from "../../components/AvatarPicker";
import NameFormItem from "../../components/SingupComponents/NameFormItem";
import { LongLeftArrow } from "../../img/LongLeftArrow";
import { LongRightArrow } from "../../img/LongRightArrow";

import dayjs from "dayjs";
import "dayjs/locale/ru";
dayjs.locale("ru");

const { Text, Title } = Typography;

interface Props {
    form: FormInstance<any>;
    setCurrent: Dispatch<SetStateAction<number>>;
    handleNext: () => void;
}
const SecondaryForm = ({ form, handleNext, setCurrent }: Props) => {
    const [avatar, setAvatar] = useState<string>("");

    return (
        <Form
            layout="vertical"
            form={form}
            name="registration-form-secondary"
            className="width-100"
        >
            <Flex className="flex-column">
                <Space
                    className="wrap-title"
                    style={{ justifyContent: "center" }}
                    wrap
                    size={[10, 10]}
                >
                    <Form.Item noStyle valuePropName="fileList" name={"avatar"}>
                        <AvatarPicker
                            preloadFile={avatar}
                            onChange={setAvatar}
                        />
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
                            new Date().setFullYear(
                                new Date().getFullYear() - 18
                            )
                        )}
                        className="width-100"
                        placeholder="Укажите дату рождения"
                    ></DatePicker>
                </Form.Item>

                <Flex gap={10} justify="space-between">
                    <Button
                        style={{
                            opacity: 0.75,
                            fontSize: 12,
                        }}
                        icon={<LongLeftArrow />}
                        onClick={() => setCurrent(0)}
                        type="link"
                    >
                        Назад
                    </Button>

                    <Button
                        type="link"
                        style={{
                            opacity: 0.75,
                            fontSize: 12,
                        }}
                        iconPosition="end"
                        onClick={handleNext}
                        icon={<LongRightArrow />}
                    >
                        Перейти к завершению
                    </Button>
                </Flex>
                <Divider dashed>
                    <Text type="secondary" italic>
                        <InfoCircleOutlined /> можно пропустить и заполнить
                        позже
                    </Text>
                </Divider>
            </Flex>
        </Form>
    );
};

export default SecondaryForm;
