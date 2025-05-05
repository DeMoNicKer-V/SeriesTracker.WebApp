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
import locale from "antd/es/date-picker/locale/ru_RU";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { Dispatch, SetStateAction, useState } from "react";
import AvatarPicker from "../../components/AvatarPicker";
import NameFormItem from "../../components/SingupComponents/NameFormItem";
import { LongLeftArrow } from "../../img/LongLeftArrow";
import { LongRightArrow } from "../../img/LongRightArrow";
import styles from "./component.module.css";
dayjs.locale("ru");

const { Text, Title } = Typography;
// Определение интерфейса для значений формы
interface FormValues {
    name?: string;
    surName?: string;
    avatar?: string;
    dateBirth?: string;
}

// Определение интерфейса для пропсов компонента
interface Props {
    form: FormInstance<FormValues>; // Экземпляр Form из Ant Design (обязательно)
    setCurrent: Dispatch<SetStateAction<number>>; // Функция для установки текущего шага (обязательно)
    handleNext: () => void; // Функция для перехода к следующему шагу (обязательно)
}

/**
 * @component OptinalRegistrationForm
 * @description Вторая форма регистрации (необязательная).
 * Предоставляет поля для ввода имени, фамилии, выбора аватара и даты рождения.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const OptinalRegistrationForm: React.FC<Props> = ({
    form,
    handleNext,
    setCurrent,
}): JSX.Element => {
    const [avatar, setAvatar] = useState<string>(""); // Состояние для хранения URL аватара

    return (
        <Form
            layout="vertical"
            form={form}
            name="registration-form-optinal"
            className="width-100"
        >
            <Flex className="flex-column">
                <Space
                    className={styles["registration-form-optional-head"]}
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

                        <Text
                            type="secondary"
                            className={styles["registration-form-warning"]}
                        >
                            {
                                "только файлы формата JPG/PNG, размером не превышающие 256 КБ"
                            }
                        </Text>
                    </Flex>
                </Space>

                <Divider>Как вас зовут?</Divider>

                <Space
                    classNames={{ item: styles["registration-form-items"] }}
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
                        className={styles["nav-button"]}
                        icon={<LongLeftArrow />}
                        onClick={() => setCurrent(0)}
                        type="link"
                    >
                        Назад
                    </Button>

                    <Button
                        className={styles["nav-button"]}
                        type="link"
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

export default OptinalRegistrationForm;
