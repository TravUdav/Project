-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Май 02 2024 г., 21:01
-- Версия сервера: 8.0.30
-- Версия PHP: 8.0.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `kinowiki`
--

-- --------------------------------------------------------

--
-- Структура таблицы `feedback`
--

CREATE TABLE `feedback` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `feedback`
--

INSERT INTO `feedback` (`id`, `name`, `email`, `message`) VALUES
(2, '123', '123@mail.ru', '123'),
(3, '123', '123@mail.ru', '123'),
(4, '123', '123@mail.ru', '123'),
(5, '1234', '123@mail.ru', '1234'),
(6, '11', '123@mail.ru', '12'),
(7, '123', '123@mail.ru', '123');

-- --------------------------------------------------------

--
-- Структура таблицы `films`
--

CREATE TABLE `films` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `poster` varchar(255) NOT NULL,
  `release` int NOT NULL,
  `genre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `annotation` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `films`
--

INSERT INTO `films` (`id`, `name`, `poster`, `release`, `genre`, `annotation`) VALUES
(1, 'Залечь на дно в Брюгге', 'poster1.jpg', 2008, 'Криминал/Комедия', 'После того, как наемные убийцы Рэй и Кен запороли в Лондоне важное задание, их злобный шеф Гарри приказывает им отправиться в Брюгге и не высовываться. Оказавшись в старинном бельгийском городке, Рэй от нечего делать флиртует с местной красоткой, пока Кен наслаждается жизнью и неожиданным отпуском.'),
(2, 'Умница Уилл Хантинг', 'poster2.jpg', 1997, 'Триллер/Романтика', 'Уилл Хантинг - 20-летний вундеркинд из Бостона, который то и дело ввязывается в неприятные истории. И когда полиция арестовывает его за очередную драку, профессор математики берет его под свою опеку, но при одном условии: Уилл должен пройти курс психотерапии.'),
(3, 'А в душе я танцую', 'poster3.jpg', 2004, 'Комедия/Драма', '24-летний Майкл Конннолли, больной церебральным параличом, находится на лечении в доме для инвалидов в Дублине. Жизнь молодого человека полностью меняется, когда в клинике появляется новый пациент Рори О\'Ши, прикованный к инвалидной коляске из-за атрофии мышц.'),
(4, 'Искупление', 'poster4.jpg', 2008, 'Романтика/Военный', '13-летняя Брайони обладает превосходным воображением и пишет пьесы. Она знает, что сын прислуги Робби влюблен в ее старшую сестру Сесилию и та отвечает ему взаимностью. Но когда ее кузина Лола становится жертвой насильника, Брайони уверенно показывает на Робби — ее воображение дорисовывает картину насилия.');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `login` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `birth` date NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `admin` tinyint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `name`, `login`, `password`, `birth`, `avatar`, `admin`) VALUES
(1, 'User', 'user@mail.ru', '202cb962ac59075b964b07152d234b70', '2020-12-12', 'avatar_user@mail.ru.jpg\r\n', 1),
(3, 'Max', 'user1@mail.ru', '202cb962ac59075b964b07152d234b70', '1212-12-12', '', 0),
(4, 'Pax', 'user2@mail.ru', '202cb962ac59075b964b07152d234b70', '1212-12-12', '', 0),
(21, '123', 'user5@mail.ru', '202cb962ac59075b964b07152d234b70', '1212-02-12', '', 0),
(22, '132', 'user3@mail.ru', '202cb962ac59075b964b07152d234b70', '2112-12-12', '', 0),
(23, '123', 'user9@mail.ru', '202cb962ac59075b964b07152d234b70', '1212-12-12', '', 0),
(24, 'Pax', 'user4@mail.ru', '202cb962ac59075b964b07152d234b70', '1212-12-12', '', 0),
(25, '123', 'user8@mail.ru', '202cb962ac59075b964b07152d234b70', '1212-12-12', '', 0),
(26, '123', 'user24@mail.ru', '202cb962ac59075b964b07152d234b70', '1212-12-12', 'public/img/avatars/avatar_user24@mail.ru.jpg', 0);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `films`
--
ALTER TABLE `films`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT для таблицы `films`
--
ALTER TABLE `films`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
