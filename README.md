Цель — отобразить в табличном представлении список самолетов с сортировкой по увеличению расстояния от самолета до аэропорта.

В таблице выводить:
1. Координаты самолета;
2. Скорость в км/ч;
3. Курс в градусах;
4. Высоту полета самолета в метрах;
5. Коды аэропортов вылета и назначения;
6. Номер рейса.

Условия:
- Данные требуется периодически (3-5 сек) перезапрашивать  с сервера и обновлять содержимое таблицы;
- Описание формата JSON ответа сервера не прилагается к задаче;
- Координаты аэропорта «Домодедово» для решения задачи — 55.410307°, 37.902451°;
- Код реализовать на JS с выполнением на стороне клиента;
- В минимальном варианта должно быть 2 файла: index.html и script.js (style.css и картинки для улучшения внешнего вида - по желанию); 
- Задание выполнить на чистом JS без использования дополнительных библиотек и фреймворков.

URL — https://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=56.84,55.27,33.48,41.48.
