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
    *   Visual Studio - Основной инструмент для работы с кодом.
    *   C# - Язык разработки.
    *   ASP.NET Core -  Платформа для создания веб-API.
    *   PostgreSQL -  Реляционная база данных для хранения данных.
    *   EntityFramework Core - ORM для взаимодействия с БД.
    *   JWT -  Для аутентификации и авторизации.
    *   Shikimori API - Внешний API для получения данных.
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
    *   Visual Studio Code - Основной инструмент для работы с кодом.
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

### Здесь представлены скриншоты того, как приложение выглядит на устройствах с различным размером экрана.

* Desktop версия

<details>
    <summary>Нажмите, чтобы посмотреть скриншоты</summary>

<table>
    <tr>
        <td width="50%"><b><p align="center">Страница входа</p></b><img src="screenshots/full/login_full.png"</td>
        <td width="50%"><b><p align="center">Страница регистрации</p></b><img src="screenshots/full/register_full.png"</td>
    </tr>
    <tr>
        <td width="50%"><b><p align="center">Главная страница приложения</p></b><img src="screenshots/full/mainpage_full.png"</td>
        <td width="50%"><b><p align="center">Окно для параметризированного поиска</p></b><img src="screenshots/full/filter_full.png"</td>
    </tr>
    <tr>
        <td width="50%"><b><p align="center">Страница календаря</p></b><img src="screenshots/full/calendar_full.png"</td>
        <td width="50%"><b><p align="center">Страница профиля пользователя</p></b><img src="screenshots/full/userpage_full.png"</td>
    </tr>
    <tr>
        <td width="50%"><b><p align="center">Страница пользовательского списка</p></b><img src="screenshots/full/userseries_full.png"</td>
        <td width="50%"><b><p align="center">Страница редактирования профиля пользователя</p></b><img src="screenshots/full/edituser_full.png"</td>
    </tr>
    <tr>
        <td width="50%"><b><p align="center">Экран детальной информации об аниме</p></b><img src="screenshots/full/detail_full.png"></td>
        <td width="50%"><b><p align="center">Страница с правилами</p></b><img src="screenshots/full/rules_full.png"></td>
    </tr>
    <tr>
        <td width="50%"><b><p align="center">Страница настроек (категории)</p></b><img src="screenshots/full/categories_full.png"</td>
        <td width="50%"><b><p align="center">Страница настроек (пользователи)</p></b><img src="screenshots/full/users_full.png"</td>
    </tr>
</table>

</details>

* Мобильная версия
<details>
    <summary>Нажмите, чтобы посмотреть скриншоты</summary>
    
<table>
    <tr>
        <td width="50%"><b><p align="center">Страница входа</p></b><img src="screenshots/mobile/login_mobile.png"</td>
        <td width="50%"><b><p align="center">Страница регистрации</p></b><img src="screenshots/mobile/register_mobile.png"</td>
    </tr>
    <tr>
        <td width="50%"><b><p align="center">Главная страница приложения</p></b><img src="screenshots/mobile/mainpage_mobile.png"</td>
        <td width="50%"><b><p align="center">Окно для параметризированного поиска</p></b><img src="screenshots/mobile/filter_mobile.png"</td>
    </tr>
    <tr>
        <td width="50%"><b><p align="center">Страница календаря</p></b><img src="screenshots/mobile/calendar_mobile.png"</td>
        <td width="50%"><b><p align="center">Страница профиля пользователя</p></b><img src="screenshots/mobile/userpage_mobile.png"</td>
    </tr>
    <tr>
        <td width="50%"><b><p align="center">Страница пользовательского списка</p></b><img src="screenshots/mobile/userseries_mobile.png"</td>
        <td width="50%"><b><p align="center">Страница редактирования профиля пользователя</p></b><img src="screenshots/mobile/edituser_mobile.png"</td>
    </tr>
    <tr>
        <td width="50%"><b><p align="center">Экран детальной информации об аниме</p></b><img src="screenshots/mobile/detail_mobile.png"></td>
        <td width="50%"><b><p align="center">Страница с правилами</p></b><img src="screenshots/mobile/rules_mobile.png"></td>
    </tr>
</table>

</details>

## Демонстрация
[Посмотреть небольшую видео-демонстрацию приложения](https://drive.google.com/file/d/1HMkyuQreIwc_jnymMmDFiqK_y2c9OFMQ/view?usp=drive_link/preview)

## Лицензия

Series Tracker.WebApp распространяется на условиях лицензии Apache (версия 2.0). Подробности в [Лицензия](LICENSE.txt).
