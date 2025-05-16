<h1 align="center">
    <img src="/client/app/img/logo.ico" width="200px" height="200px" alt="icon" />
    <br />
    <b>Series Tracker.WebApp | Full Stack application for tracking animes</b>
</h1>

<p align="center">
    <a href="#зачем">Зачем?</a>
    •
    <a href="#технологии">Технологии</a>
    •
    <a href="#функциональность">Функциональность</a>
    •
    <a href="#скриншоты">Скриншоты</a>
    •
    <a href="#демонстрация">Демонстрация</a>
    •
    <a href="#лицензия">Лицензия</a>
</p>

## Зачем?

<p>
После работы над .NET MAUI приложениями для мобильных устройств, я решил попробовать себя в Full Stack разработке. </br>
Этот проект – результат того, что у меня получилось. Он построен с использованием Next.js (React) и ASP.NET Core. 
В целом этот проект стал для меня отличной возможностью изучить React, улучшить навыки работы с .Net, а также получить опыт разработки full stack приложений в целом. 
</p>

## Технологии

Этот проект построен с использованием следующих технологий:

*   **Backend:**
    *   C# - Язык разработки.
    *   ASP.NET Core -  Платформа для создания веб-API.
    *   PostgreSQL -  Реляционная база данных для хранения данных.
    *   EntityFramework Core - ORM для взаимодействия с БД.
    *   JWT -  Для аутентификации и авторизации.
    *   Shikimori API - Внешний API для работы с данными аниме.
    *   Automapper -  Для преобразования данных.
*   **Архитектура:**
    *   Реализована архитектура, основанная на паттерне Репозиторий-Сервис-Контроллер, для разделения ответственности и улучшения масштабируемости:
        *   `.Api`:  Контроллеры API.
        *   `.Application`: Сервисы (бизнес-логика).
        *   `.Core`: Общие модели и интерфейсы.
        *   `.DataAccess`: Репозитории для работы с данными.
        *   `.Infrastructure`: Вспомогательные сервисы и интеграции.
*   **Тестирование:**  Применяются юнит-тесты и интеграционные тесты для обеспечения качества кода.
*   **Frontend:**
    *   Next.js - Фреймворк для создания пользовательского интерфейса.
    *   TypeScript -  Язык разработки.
    *   CSS -  Для оформления.
    *   Ant Design -  Библиотека UI-компонентов.
    *   Day.js - Библиотека для работы с датами.
    *   SWR - Библиотека для эффективной загрузки данных.
 
## Функциональность

### Общее

*   Современный и интуитивно понятный интерфейс.
*   Адаптивный дизайн для различных устройств.

### Каталог аниме

*   Получение списка аниме из Shikimori API.
*   Расширенная фильтрация списка по различным параметрам.
*   Сортировка списка по популярности, рейтингу и другим критериям.
*   Безопасный поиск.
*   Функция поиска случайного аниме.
*   Календарь выхода аниме на ближайшие 7 дней с фильтрацией по дням недели.

### Личный список аниме

*   Добавление аниме в личный список.
*   Установка параметров для каждого аниме в списке:
    *   Категория просмотра.
    *   Количество просмотренных эпизодов.
    *   Пометка как “избранное”.
*   Удаление аниме из личного списка.
*   Фильтрация личного списка по категориям и избранному.

### Профиль пользователя

*   Просмотр информации о пользователе.
*   Отображение статистики личного списка аниме:
    *   Последние добавленные/измененные аниме.
    *   Общая статистика.
*   Просмотр полного личного списка аниме.
*   Редактирование информации об аккаунте.
*   Удаление аккаунта.
*   Полная очистка личного списка аниме.

## Управление пользователями и контентом (для модераторов и администраторов)

### Модераторы:

*   Просмотр списка пользователей.
*   Просмотр списка категорий.
*   Удаление обычных пользователей.

### Администраторы:

*   Тоже, что и модератор.
*   Удаление любых пользователей (кроме администраторов).
*   Изменение ролей пользователей (на модератора).
*   Изменение цвета категорий аниме.

## Авторизация и аутентификация

*   Регистрация новых пользователей.
*   Вход в существующие аккаунты.
*   Разграничение доступа на основе ролей (пользователь, модератор, администратор).

## Хранение данных

*   Все данные хранятся на сервере PostgreSQL.

## Скриншоты

### Desktop версия
<details>
    <summary>Нажмите, чтобы посмотреть скриншоты</summary>

| <!-- --> | <!-- --> |
|:-:|:-:|
| **Страница входа** | **Страница регистрации** |
|  [![Login](screenshots/full/login_full.png)](screenshots/full/login_full.png) | [![Register](screenshots/full/register_full.png)](screenshots/full/register_full.png)  |
| **Главная страница приложения** | **Окно для параметризированного поиска** |
|  [![Main Page](screenshots/full/mainpage_full.png)](screenshots/full/mainpage_full.png) |  [![Filter](screenshots/full/filter_full.png)](screenshots/full/filter_full.png)
| **Страница календаря** | **Страница профиля пользователя** |
| [![Calendar](screenshots/full/calendar_full.png)](screenshots/full/calendar_full.png) |  [![User Page](screenshots/full/userpage_full.png)](screenshots/full/userpage_full.png) |
| **Страница пользовательского списка** | **Страница редактирования профиля пользователя.** |
|  [![User Series](screenshots/full/userseries_full.png)](screenshots/full/userseries_full.png) | [![Edit User](screenshots/full/edituser_full.png)](screenshots/full/edituser_full.png) |
| **Страница настроек (категории)** | **Страница настроек (пользователи)** |
|  [![Categories](screenshots/full/categories_full.png)](screenshots/full/categories_full.png) | [![Users](screenshots/full/users_full.png)](screenshots/full/users_full.png)
| **Экран детальной информации об аниме** | **Страница с правилами** |
|  [![Detail](screenshots/full/detail_full.png)](screenshots/full/detail_full.png) |  [![Rules](screenshots/full/rules_full.png)](screenshots/full/rules_full.png) |

</details>

### Мобильная версия

<details>
    <summary>Нажмите, чтобы посмотреть скриншоты</summary>
    
| <!-- --> | <!-- --> |
|:-:|:-:|
| **Страница входа** | **Страница регистрации** |
|  [![Login](screenshots/mobile/login_mobile.png)](screenshots/mobile/login_mobile.png) | [![Register](screenshots/mobile/register_mobile.png)](screenshots/mobile/register_mobile.png)  |
| **Главная страница приложения** | **Окно для параметризированного поиска** |
|  [![Main Page](screenshots/mobile/mainpage_mobile.png)](screenshots/mobile/mainpage_mobile.png) |  [![Filter](screenshots/mobile/filter_mobile.png)](screenshots/mobile/filter_mobile.png)
| **Страница календаря** | **Страница профиля пользователя** |
| [![Calendar](screenshots/mobile/calendar_mobile.png)](screenshots/mobile/calendar_mobile.png) |  [![User Page](screenshots/mobile/userpage_mobile.png)](screenshots/mobile/userpage_mobile.png) |
| **Страница пользовательского списка** | **Страница редактирования профиля пользователя.** |
|  [![User Series](screenshots/mobile/userseries_mobile.png)](screenshots/mobile/userseries_mobile.png) | [![Edit User](screenshots/mobile/edituser_mobile.png)](screenshots/mobile/edituser_mobile.png) |
| **Страница настроек (категории)** | **Страница настроек (пользователи)** |
|  [![Categories](screenshots/mobile/categories_mobile.png)](screenshots/mobile/categories_mobile.png) | [![Users](screenshots/mobile/users_mobile.png)](screenshots/mobile/users_mobile.png)
| **Экран детальной информации об аниме** | **Страница с правилами** |
|  [![Detail](screenshots/mobile/detail_mobile.png)](screenshots/mobile/detail_mobile.png) |  [![Rules](screenshots/mobile/rules_mobile.png)](screenshots/mobile/rules_mobile.png) |

</details>

## Лицензия

Series Tracker.WebApp распространяется на условиях лицензии Apache (версия 2.0). Подробности в [Лицензия](LICENSE.txt).
