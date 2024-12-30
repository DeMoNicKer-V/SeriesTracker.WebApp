"use client";
import { ConfigProvider, Descriptions, Divider, Typography } from "antd";
import styles from "./page.module.css";

const { Title, Paragraph, Text } = Typography;

export default function AboutPage() {
    return (
        <div className="container">
            <ConfigProvider
                theme={{
                    components: {
                        Typography: {
                            fontSize: 15,

                            colorTextHeading: "#44a5a6",
                        },
                    },
                }}
            >
                <Divider orientation="left">
                    <Title level={3}>Общие положения</Title>
                </Divider>
                <ul className={styles["second-level"]}>
                    <li>
                        <Paragraph strong className={styles["subtitle"]}>
                            Принятие правил
                        </Paragraph>
                        <Paragraph type="secondary">
                            Регистрируясь на сайте, пользователь подтверждает
                            свое согласие с настоящими правилами.
                        </Paragraph>
                    </li>
                    <li>
                        <Paragraph strong className={styles["subtitle"]}>
                            Изменение правил
                        </Paragraph>
                        <Paragraph type="secondary">
                            Администрация сайта оставляет за собой право
                            изменять правила. Уведомление об изменениях
                            публикуется на сайте. Продолжение использования
                            сайта после внесения изменений означает согласие с
                            новыми правилами.
                        </Paragraph>
                    </li>
                    <li>
                        <Paragraph strong className={styles["subtitle"]}>
                            Ответственность
                        </Paragraph>
                        <Paragraph type="secondary">
                            Каждый пользователь несет персональную
                            ответственность за свои действия на сайте и за
                            соблюдение настоящих правил
                        </Paragraph>
                    </li>
                </ul>

                <Divider orientation="left">
                    <Title level={3}>Регистрация и учетные записи</Title>
                </Divider>

                <ul className={styles["second-level"]}>
                    <li>
                        <Paragraph strong className={styles["subtitle"]}>
                            Возрастное ограничение
                        </Paragraph>
                        <Paragraph type="secondary">
                            Сайт предназначен для лиц, достигших 18 лет.
                            Регестрируясь на сайте, пользоватль подтверждает,
                            что он достиг указанного возраста.
                        </Paragraph>
                    </li>
                    <li>
                        <Paragraph strong className={styles["subtitle"]}>
                            Недопустимые никнеймы
                        </Paragraph>
                        <Paragraph type="secondary">
                            Запрещается использование никнеймов, содержащих
                            нецензурную лексику, оскорбления, угрозы,
                            дискриминацию по любому признаку.
                        </Paragraph>
                    </li>
                    <li>
                        <Paragraph strong className={styles["subtitle"]}>
                            Имя и фамилия
                        </Paragraph>
                        <Paragraph type="secondary">
                            Указание имен и фамилий является необязательным, но
                            если они указаны, то они должны соответствовать
                            правилам, описанным в пункте{" "}
                            <Text code>Недопустимые никнеймы</Text>.
                        </Paragraph>
                    </li>
                    <li>
                        <Paragraph strong className={styles["subtitle"]}>
                            Аватары
                        </Paragraph>
                        <Paragraph type="secondary">
                            Аватары должны соответствовать нормам морали и не
                            содержать:
                            <ol>
                                <li>
                                    Изображений насилия, жестокости,
                                    порнографии.
                                </li>
                                <li>
                                    Материалов, разжигающих ненависть, расовую
                                    или религиозную нетерпимость.
                                </li>
                                <li>
                                    Изображений оскорбляющих других
                                    пользователей.
                                </li>
                            </ol>
                        </Paragraph>
                    </li>
                    <li>
                        <Paragraph strong className={styles["subtitle"]}>
                            Безопасность
                        </Paragraph>
                        <Paragraph type="secondary">
                            Пользователь несет ответственность за безопасность
                            своего аккаунта. Запрещается передавать данные для
                            входа в систему третьим лицам.
                        </Paragraph>
                    </li>
                </ul>

                <Divider orientation="left">
                    <Title level={3}>Контент и поведение</Title>
                </Divider>

                <ul className={styles["second-level"]}>
                    <li>
                        <Paragraph strong className={styles["subtitle"]}>
                            Запрещенный контент
                        </Paragraph>
                        <Paragraph type="secondary">
                            На сайте запрещается публикация:
                            <ol>
                                <li>
                                    Материалов, нарушающих авторские права (без
                                    разрешения правообладателя).
                                </li>
                                <li>
                                    Спама, рекламы, ссылок на сторонние ресурсы
                                    (без согласования с администрацией).
                                </li>
                                <li>
                                    Персональной информации других пользователей
                                    (без их согласия).
                                </li>
                                <li>
                                    Материалов, оскорбляющих чувства верующих
                                    или нарушающих религиозные нормы.
                                </li>
                                <li>
                                    Материалов, нарушающих законы вашей страны.
                                </li>
                                <li>Любой политический контент.</li>
                            </ol>
                        </Paragraph>
                    </li>
                    <li>
                        <Paragraph strong className={styles["subtitle"]}>
                            Поведение
                        </Paragraph>
                        <Paragraph type="secondary">
                            <ol>
                                <li>
                                    Запрещается оскорбление, унижение,
                                    запугивание других пользователей.
                                </li>
                                <li>
                                    Запрещается травля (буллинг), преследование,
                                    разжигание конфликтов.
                                </li>
                                <li>
                                    Запрещается использование нецензурной
                                    лексики.
                                </li>
                                <li>
                                    Запрещается размещение материалов
                                    сексуального характера.
                                </li>
                                <li>
                                    Запрещается выдавать себя за других
                                    пользователей.
                                </li>
                                <li>
                                    Запрещено оскорблять администраторов и
                                    модераторов, а также препятствовать их
                                    работе.
                                </li>
                            </ol>
                        </Paragraph>
                    </li>
                    <li>
                        <Paragraph strong className={styles["subtitle"]}>
                            Имя и фамилия
                        </Paragraph>
                        <Paragraph type="secondary">
                            Указание имен и фамилий является необязательным, но
                            если они указаны, то они должны соответствовать
                            правилам, описанным в пункте{" "}
                            <Text code>Недопустимые никнеймы</Text>.
                        </Paragraph>
                    </li>
                    <li>
                        <Paragraph strong className={styles["subtitle"]}>
                            Аватары
                        </Paragraph>
                        <Paragraph type="secondary">
                            Аватары должны соответствовать нормам морали и не
                            содержать:
                            <ol>
                                <li>
                                    Изображений насилия, жестокости,
                                    порнографии.
                                </li>
                                <li>
                                    Материалов, разжигающих ненависть, расовую
                                    или религиозную нетерпимость.
                                </li>
                                <li>
                                    Изображений оскорбляющих других
                                    пользователей.
                                </li>
                            </ol>
                        </Paragraph>
                    </li>
                    <li>
                        <Paragraph strong className={styles["subtitle"]}>
                            Безопасность
                        </Paragraph>
                        <Paragraph type="secondary">
                            Пользователь несет ответственность за безопасность
                            своего аккаунта. Запрещается передавать данные для
                            входа в систему третьим лицам.
                        </Paragraph>
                    </li>
                </ul>

                <Divider orientation="left">
                    <Title level={3}>Ответственность и санкции</Title>
                </Divider>

                <ul className={styles["second-level"]}>
                    <li>
                        <Paragraph strong className={styles["subtitle"]}>
                            Модерация
                        </Paragraph>
                        <Paragraph type="secondary">
                            Администрация сайта оставляет за собой право
                            удалять, редактировать или перемещать любой контент,
                            который нарушает данные правила.
                        </Paragraph>
                    </li>
                    <li>
                        <Paragraph strong className={styles["subtitle"]}>
                            Блокировка
                        </Paragraph>
                        <Paragraph type="secondary">
                            За нарушение правил администрация сайта имеет право:
                            <ol>
                                <li>Вынести предупреждение</li>
                                <li>
                                    Временно заблокировать аккаунт пользователя.
                                </li>
                                <li>
                                    Бессрочно заблокировать аккаунт
                                    пользователя.
                                </li>
                                <li>Удалить аккаунт пользователя.</li>
                            </ol>
                        </Paragraph>
                    </li>
                    <li>
                        <Paragraph strong className={styles["subtitle"]}>
                            Безвозвратность блокировки
                        </Paragraph>
                        <Paragraph type="secondary">
                            Администрация сайта не обязана восстанавливать
                            заблокированные или удаленные аккаунты.
                        </Paragraph>
                    </li>
                    <li>
                        <Paragraph strong className={styles["subtitle"]}>
                            Претензии
                        </Paragraph>
                        <Paragraph type="secondary">
                            Администрация сайта оставляет за собой право
                            отказать в предоставлении услуг пользователям, если
                            они нарушают правила.
                        </Paragraph>
                    </li>
                </ul>

                <Divider orientation="left">
                    <Title level={3}>Авторские права и контент</Title>
                </Divider>

                <ul className={styles["second-level"]}>
                    <li>
                        <Paragraph strong className={styles["subtitle"]}>
                            {" "}
                            Авторский контент
                        </Paragraph>
                        <Paragraph type="secondary">
                            Загружая или публикуя контент на сайте, пользователь
                            гарантирует, что он обладает необходимыми правами на
                            этот контент.
                        </Paragraph>
                    </li>
                    <li>
                        <Paragraph strong className={styles["subtitle"]}>
                            Право использования
                        </Paragraph>
                        <Paragraph type="secondary">
                            Размещая свой контент на сайте, пользователь
                            предоставляет администрации сайта право использовать
                            этот контент для целей работы сайта.
                        </Paragraph>
                    </li>
                </ul>

                <Divider orientation="left">
                    <Title level={3}> Прочие положения</Title>
                </Divider>

                <ul className={styles["second-level"]}>
                    <li>
                        <Paragraph strong className={styles["subtitle"]}>
                            Обратаная связь
                        </Paragraph>
                        <Paragraph type="secondary">
                            Пользователи могут обращаться к администрации сайта
                            через предусмотренные каналы обратной связи.
                        </Paragraph>
                    </li>
                    <li>
                        <Paragraph strong className={styles["subtitle"]}>
                            Помощь
                        </Paragraph>
                        <Paragraph type="secondary">
                            Если пользователь не уверен, какое правило он может
                            нарушить, ему следует обратиться к администрации
                            сайта за разъяснениями.
                        </Paragraph>
                    </li>
                </ul>
            </ConfigProvider>
        </div>
    );
}
