"use client";
import { Anchor, Col, ConfigProvider, Divider, Row, Typography } from "antd";
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
                        Divider: {
                            margin: 0,
                        },
                    },
                }}
            >
                <Row gutter={[15, 0]}>
                    <Col xxl={20} xl={19} lg={24}>
                        <Divider orientation="left">
                            <Title id="part-1" level={3}>
                                1. Общие положения
                            </Title>
                        </Divider>
                        <ul className={styles["second-level"]}>
                            <li id="part-1-1">
                                <Paragraph
                                    strong
                                    className={styles["subtitle"]}
                                >
                                    Принятие правил
                                </Paragraph>
                                <Paragraph type="secondary">
                                    Регистрируясь на сайте, пользователь{" "}
                                    <Text type="warning">подтверждает</Text>{" "}
                                    свое согласие с настоящими правилами.
                                </Paragraph>
                            </li>
                            <li id="part-1-2">
                                <Paragraph
                                    strong
                                    className={styles["subtitle"]}
                                >
                                    Изменение правил
                                </Paragraph>
                                <Paragraph type="secondary">
                                    Администрация сайта{" "}
                                    <Text type="warning">
                                        оставляет за собой право
                                    </Text>{" "}
                                    вносить изменения в настоящие правила в
                                    любое время. Уведомление об изменениях
                                    публикуется на сайте. Пользователи{" "}
                                    <Text type="warning">
                                        <Text type="warning">
                                            <Text type="warning">
                                                обязуются{" "}
                                            </Text>
                                        </Text>
                                    </Text>{" "}
                                    самостоятельно отслеживать изменения в
                                    правилах. Продолжение использования сайта
                                    после внесения изменений означает согласие с
                                    новыми правилами.
                                </Paragraph>
                            </li>
                            <li id="part-1-3">
                                <Paragraph
                                    strong
                                    className={styles["subtitle"]}
                                >
                                    Ответственность
                                </Paragraph>
                                <Paragraph type="secondary">
                                    Каждый пользователь{" "}
                                    <Text type="warning">
                                        несет персональную ответственность{" "}
                                    </Text>{" "}
                                    за свои действия на сайте и за соблюдение
                                    настоящих правил
                                </Paragraph>
                            </li>
                        </ul>

                        <Divider orientation="left">
                            <Title id="part-2" level={3}>
                                2. Регистрация и учетные записи
                            </Title>
                        </Divider>

                        <ul className={styles["second-level"]}>
                            <li id="part-2-1">
                                <Paragraph
                                    strong
                                    className={styles["subtitle"]}
                                >
                                    Возрастное ограничение
                                </Paragraph>
                                <Paragraph type="secondary">
                                    Сайт предназначен для лиц,{" "}
                                    <Text type="danger">достигших 18 лет</Text>.
                                    Регестрируясь на сайте, пользоватль{" "}
                                    <Text type="warning">подтверждает</Text>,
                                    что он достиг указанного возраста.
                                </Paragraph>
                            </li>
                            <li id="part-2-2">
                                <Paragraph
                                    strong
                                    className={styles["subtitle"]}
                                >
                                    Требования к учетным данным
                                </Paragraph>
                                <Paragraph type="secondary">
                                    При создании учетной записи на сайте{" "}
                                    <Text type="danger">запрещено</Text>{" "}
                                    использовать имена пользователей, аватары,
                                    описания профиля или любую другую
                                    информацию, которая содержит:
                                    <ol>
                                        <li>
                                            Изображений насилия, жестокости,
                                            порнографии.
                                        </li>
                                        <li>
                                            Нецензурную лексику, оскорбления,
                                            дискриминацию, угрозы или другие
                                            формы агрессии.
                                        </li>
                                        <li>
                                            Призывы к насилию, травле, ненависти
                                            или дискриминации по любому признаку
                                            (раса, национальность, пол, религия,
                                            сексуальная ориентация, и т.д.).
                                        </li>
                                        <li>Рекламные или спам-сообщения.</li>

                                        <li>
                                            Материалы, нарушающие
                                            законодательство или права третьих
                                            лиц
                                        </li>
                                    </ol>
                                    Администрация сайта{" "}
                                    <Text type="warning">
                                        оставляет за собой право
                                    </Text>{" "}
                                    удалять учетные записи, нарушающие эти
                                    правила,{" "}
                                    <Text type="warning">
                                        без предварительного уведомления.
                                    </Text>
                                </Paragraph>
                            </li>
                            <li id="part-2-3">
                                <Paragraph
                                    strong
                                    className={styles["subtitle"]}
                                >
                                    Безопасность
                                </Paragraph>
                                <Paragraph type="secondary">
                                    Запрещены любые действия, направленные на
                                    нарушение безопасности сайта, включая
                                    попытки взлома, распространение вредоносного
                                    программного обеспечения и использование
                                    уязвимостей. Пользователи{" "}
                                    <Text type="warning">
                                        несут ответственность
                                    </Text>{" "}
                                    за сохранность своих учетных данных и{" "}
                                    <Text type="warning">
                                        <Text type="warning">обязуются </Text>
                                    </Text>{" "}
                                    не передавать их третьим лицам.
                                </Paragraph>
                            </li>
                        </ul>

                        <Divider orientation="left">
                            <Title id="part-3" level={3}>
                                3. Контент и поведение
                            </Title>
                        </Divider>

                        <ul className={styles["second-level"]}>
                            <li id="part-3-1">
                                <Paragraph
                                    strong
                                    className={styles["subtitle"]}
                                >
                                    Запрещенный контент
                                </Paragraph>
                                <Paragraph type="secondary">
                                    На сайте{" "}
                                    <Text type="danger">запрещается</Text>{" "}
                                    публикация:
                                    <ol>
                                        <li>
                                            Материалов, нарушающих авторские
                                            права (без разрешения
                                            правообладателя).
                                        </li>
                                        <li>
                                            Спама, рекламы, ссылок на сторонние
                                            ресурсы (без согласования с
                                            администрацией).
                                        </li>
                                        <li>
                                            Персональной информации других
                                            пользователей (без их согласия).
                                        </li>
                                        <li>
                                            Материалов, оскорбляющих чувства
                                            верующих или нарушающих религиозные
                                            нормы.
                                        </li>
                                        <li>
                                            Материалов, нарушающих законы вашей
                                            страны.
                                        </li>
                                        <li>Любой политический контент.</li>
                                    </ol>
                                </Paragraph>
                            </li>
                            <li id="part-3-2">
                                <Paragraph
                                    strong
                                    className={styles["subtitle"]}
                                >
                                    Поведение
                                </Paragraph>
                                <Paragraph type="secondary">
                                    На сайте{" "}
                                    <Text type="danger">запрещается</Text>{" "}
                                    публикация:
                                    <ol>
                                        <li>
                                            Оскорбление, унижение, запугивание
                                            других пользователей.
                                        </li>
                                        <li>
                                            Травля (буллинг), преследование,
                                            разжигание конфликтов.
                                        </li>
                                        <li>
                                            Использование нецензурной лексики.
                                        </li>
                                        <li>
                                            Размещение материалов сексуального
                                            характера.
                                        </li>
                                        <li>
                                            Выдавать себя за других
                                            пользователей.
                                        </li>
                                        <li>
                                            Сскорблять администраторов и
                                            модераторов, а также препятствовать
                                            их работе.
                                        </li>
                                    </ol>
                                </Paragraph>
                            </li>
                            <li id="part-3-3">
                                <Paragraph
                                    strong
                                    className={styles["subtitle"]}
                                >
                                    Разрешение споров
                                </Paragraph>
                                <Paragraph type="secondary">
                                    В случае возникновения споров между
                                    пользователями или между пользователями и
                                    администрацией сайта, стороны{" "}
                                    <Text type="warning">
                                        <Text type="warning">обязуются </Text>
                                    </Text>
                                    предпринять все возможные меры для их
                                    разрешения путем переговоров. В случае
                                    невозможности разрешения спора путем
                                    переговоров, администрация сайта{" "}
                                    <Text type="warning">имеет право</Text>{" "}
                                    принять окончательное решение.
                                </Paragraph>
                            </li>
                        </ul>

                        <Divider orientation="left">
                            <Title id="part-4" level={3}>
                                4. Ответственность и санкции
                            </Title>
                        </Divider>

                        <ul className={styles["second-level"]}>
                            <li id="part-4-1">
                                <Paragraph
                                    strong
                                    className={styles["subtitle"]}
                                >
                                    Модерация
                                </Paragraph>
                                <Paragraph type="secondary">
                                    Администрация сайта{" "}
                                    <Text type="warning">
                                        оставляет за собой право
                                    </Text>{" "}
                                    удалять, редактировать или перемещать любой
                                    контент, который нарушает данные правила.
                                </Paragraph>
                            </li>
                            <li id="part-4-2">
                                <Paragraph
                                    strong
                                    className={styles["subtitle"]}
                                >
                                    Блокировка
                                </Paragraph>
                                <Paragraph type="secondary">
                                    За нарушение правил администрация сайта{" "}
                                    <Text type="warning">имеет право</Text> :
                                    <ol>
                                        <li>Вынести предупреждение</li>
                                        <li>
                                            Временно заблокировать аккаунт
                                            пользователя.
                                        </li>
                                        <li>
                                            Бессрочно заблокировать аккаунт
                                            пользователя.
                                        </li>
                                        <li>Удалить аккаунт пользователя.</li>
                                    </ol>
                                </Paragraph>
                            </li>
                            <li id="part-4-3">
                                <Paragraph
                                    strong
                                    className={styles["subtitle"]}
                                >
                                    Безвозвратность блокировки
                                </Paragraph>
                                <Paragraph type="secondary">
                                    Администрация сайта{" "}
                                    <Text type="warning">не обязана </Text>
                                    восстанавливать заблокированные или
                                    удаленные аккаунты.
                                </Paragraph>
                            </li>
                            <li id="part-4-4">
                                <Paragraph
                                    strong
                                    className={styles["subtitle"]}
                                >
                                    Претензии
                                </Paragraph>
                                <Paragraph type="secondary">
                                    Администрация сайта{" "}
                                    <Text type="warning">имеет право</Text>{" "}
                                    заблокировать аккаунт пользователя в случае
                                    нарушения настоящих правил, включая, но не
                                    ограничиваясь, публикацией запрещенного
                                    контента, оскорблениями других пользователей
                                    или попытками взлома сайта. Пользователь{" "}
                                    <Text type="warning">имеет право</Text>{" "}
                                    обжаловать блокировку аккаунта, обратившись
                                    к администрации.
                                </Paragraph>
                            </li>
                        </ul>

                        <Divider orientation="left">
                            <Title id="part-5" level={3}>
                                5. Авторские права и контент
                            </Title>
                        </Divider>

                        <ul className={styles["second-level"]}>
                            <li id="part-5-1">
                                <Paragraph
                                    strong
                                    className={styles["subtitle"]}
                                >
                                    Авторский контент
                                </Paragraph>
                                <Paragraph type="secondary">
                                    Все материалы, размещенные на сайте,
                                    являются объектами интеллектуальной
                                    собственности и защищены законом об
                                    авторском праве (если не указано иное).
                                    Копирование, распространение или иное
                                    использование материалов сайта без
                                    разрешения правообладателя запрещено.
                                    Загружая или публикуя контент на сайте,
                                    пользователь гарантирует, что он обладает
                                    необходимыми правами на этот контент.
                                </Paragraph>
                            </li>
                            <li id="part-5-2">
                                <Paragraph
                                    strong
                                    className={styles["subtitle"]}
                                >
                                    Право использования
                                </Paragraph>
                                <Paragraph type="secondary">
                                    Размещая свой контент на сайте, пользователи
                                    сохраняют права на контент, но предоставляют
                                    администрации сайта право на его
                                    использование в целях функционирования
                                    сайта.
                                </Paragraph>
                            </li>
                        </ul>

                        <Divider orientation="left">
                            <Title id="part-6" level={3}>
                                6. Связь с администрацией
                            </Title>
                        </Divider>

                        <ul className={styles["second-level"]}>
                            <li id="part-6-1">
                                <Paragraph
                                    strong
                                    className={styles["subtitle"]}
                                >
                                    Обратаная связь
                                </Paragraph>
                                <Paragraph type="secondary">
                                    Пользователи могут обращаться к
                                    администрации сайта через предусмотренные
                                    каналы обратной связи.
                                </Paragraph>
                            </li>
                            <li id="part-6-2">
                                <Paragraph
                                    strong
                                    className={styles["subtitle"]}
                                >
                                    Помощь
                                </Paragraph>
                                <Paragraph type="secondary">
                                    Если пользователь не уверен, какое правило
                                    он может нарушить, ему следует обратиться к
                                    администрации сайта за разъяснениями.
                                </Paragraph>
                            </li>
                        </ul>

                        <Divider orientation="left">
                            <Title id="part-7" level={3}>
                                7. Прочие положения
                            </Title>
                        </Divider>

                        <ul className={styles["second-level"]}>
                            <li id="part-7-1">
                                <Paragraph
                                    strong
                                    className={styles["subtitle"]}
                                >
                                    Ограничение ответственности
                                </Paragraph>
                                <Paragraph type="secondary">
                                    Администрация сайта{" "}
                                    <Text type="warning">не несет</Text>{" "}
                                    ответственности за любой ущерб, прямой или
                                    косвенный, возникший в результате
                                    использования сайта, включая, но не
                                    ограничиваясь, потерей данных, упущенной
                                    выгодой или перерывом в работе. Пользователи{" "}
                                    <Text type="warning">
                                        несут полную ответственность
                                    </Text>{" "}
                                    за содержание публикуемых ими материалов.
                                    Администрация{" "}
                                    <Text type="warning">не несет</Text>{" "}
                                    ответственности за точность, полноту или
                                    актуальность информации, размещенной на
                                    сайте.
                                </Paragraph>
                            </li>
                            <li id="part-7-2">
                                <Paragraph
                                    strong
                                    className={styles["subtitle"]}
                                >
                                    Сторонние ресурсы
                                </Paragraph>
                                <Paragraph type="secondary">
                                    Сайт может отображать данные, полученные из
                                    сторонних источников, и предоставлять ссылки
                                    на сторонние веб-сайты и ресурсы.
                                    Администрация прилагает разумные усилия для
                                    обеспечения точности и актуальности
                                    отображаемых данных, но{" "}
                                    <Text type="warning">не может</Text>{" "}
                                    гарантировать их полноту или безошибочность.
                                    Администрация{" "}
                                    <Text type="warning">не несет</Text>{" "}
                                    ответственности за любые неточности, ошибки,
                                    упущения или задержки в предоставлении
                                    данных, а также за доступность, безопасность
                                    или содержание сторонних веб-сайтов и
                                    ресурсов. Использование данных и переход по
                                    ссылкам осуществляется пользователем{" "}
                                    <Text type="danger">
                                        на свой страх и риск
                                    </Text>
                                    .
                                </Paragraph>
                            </li>
                        </ul>
                    </Col>
                    <Col xxl={3} xl={4} lg={0}>
                        <Anchor
                            offsetTop={80}
                            affix={false}
                            style={{ position: "fixed" }}
                            items={[
                                {
                                    key: "part-1",
                                    href: "#part-1",
                                    title: "1. Общие положения",
                                    children: [
                                        {
                                            key: "part-1-1",
                                            href: "#part-1-1",
                                            title: "Принятие правил",
                                        },
                                        {
                                            key: "part-1-2",
                                            href: "#part-1-2",
                                            title: "Изменение правил",
                                        },
                                        {
                                            key: "part-1-3",
                                            href: "#part-1-3",
                                            title: "Ответственность",
                                        },
                                    ],
                                },
                                {
                                    key: "part-2",
                                    href: "#part-2",
                                    title: "2. Регистрация и учетные записи",
                                    children: [
                                        {
                                            key: "part-2-1",
                                            href: "#part-2-1",
                                            title: "Возрастное ограничение",
                                        },
                                        {
                                            key: "part-2-2",
                                            href: "#part-2-2",
                                            title: "Требования к учетным данным",
                                        },
                                        {
                                            key: "part-2-3",
                                            href: "#part-2-3",
                                            title: "Безопасность",
                                        },
                                    ],
                                },
                                {
                                    key: "part-3",
                                    href: "#part-3",
                                    title: "3. Контент и поведение",
                                    children: [
                                        {
                                            key: "part-3-1",
                                            href: "#part-3-1",
                                            title: "Запрещенный контент",
                                        },
                                        {
                                            key: "part-3-2",
                                            href: "#part-3-2",
                                            title: "Поведение",
                                        },
                                        {
                                            key: "part-3-3",
                                            href: "#part-3-3",
                                            title: "Разрешение споров",
                                        },
                                    ],
                                },
                                {
                                    key: "part-4",
                                    href: "#part-4",
                                    title: "4. Ответственность и санкции",
                                    children: [
                                        {
                                            key: "part-4-1",
                                            href: "#part-4-1",
                                            title: "Модерация",
                                        },
                                        {
                                            key: "part-4-2",
                                            href: "#part-4-2",
                                            title: "Блокировка",
                                        },
                                        {
                                            key: "part-4-3",
                                            href: "#part-4-3",
                                            title: "Безвозвратность блокировки",
                                        },
                                        {
                                            key: "part-4-4",
                                            href: "#part-4-4",
                                            title: "Претензии",
                                        },
                                    ],
                                },
                                {
                                    key: "part-5",
                                    href: "#part-5",
                                    title: "5. Авторские права и контент",
                                    children: [
                                        {
                                            key: "part-5-1",
                                            href: "#part-5-1",
                                            title: "Авторский контент",
                                        },
                                        {
                                            key: "part-5-2",
                                            href: "#part-5-2",
                                            title: "Право использования",
                                        },
                                    ],
                                },
                                {
                                    key: "part-6",
                                    href: "#part-6",
                                    title: "6. Связь с администрацией",
                                    children: [
                                        {
                                            key: "part-6-1",
                                            href: "#part-6-1",
                                            title: "Обратаная связь",
                                        },
                                        {
                                            key: "part-6-2",
                                            href: "#part-6-2",
                                            title: "Помощь",
                                        },
                                    ],
                                },
                                {
                                    key: "part-7",
                                    href: "#part-7",
                                    title: "7. Прочие положения",
                                    children: [
                                        {
                                            key: "part-7-1",
                                            href: "#part-7-1",
                                            title: "Ограничение ответственности",
                                        },
                                        {
                                            key: "part-7-2",
                                            href: "#part-7-2",
                                            title: "Сторонние ресурсы",
                                        },
                                    ],
                                },
                            ]}
                        />
                    </Col>
                </Row>
            </ConfigProvider>
        </div>
    );
}
