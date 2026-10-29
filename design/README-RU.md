# Макеты WAVEFORM для Figma

Подготовлены 4 SVG-макета: Mobile 390 / Desktop 1440, каждый в Dark и Light.
Это подготовленные локальные макеты. Облачный файл Figma пока не создан.
Макеты отражают содержание и визуальную систему сайта; это не снимки его браузерного рендера. Перед сдачей сравните отступы с сайтом и при необходимости уточните расположение слоев.

## Импорт с редактируемыми слоями и сетками
1. Откройте новый Design file на figma.com в настольном приложении Figma или веб-редакторе, где доступен импорт development plugins.
2. Создайте локальный плагин через Plugins → Development → New plugin (Run once, без UI). Figma назначит ему id. Скопируйте этот id в design/figma-plugin/manifest.json, затем выберите Import plugin from manifest с данным файлом. Либо замените code.js в созданной Figma папке предоставленным code.js, сохранив выданный Figma manifest и добавив documentAccess: dynamic-page и networkAccess: allowedDomains [none]. Публиковать плагин в Community не нужно.
3. Запустите WAVEFORM Lab 9 — Import four frames.
4. Появится страница Lab 9 · WAVEFORM с четырьмя native Frame: сначала мобильные, затем настольные. Текст, карточки и иконки редактируются отдельно.
5. Проверьте Layout grid каждого Frame: Mobile — 4 columns, margin 20, gutter 16; Desktop — 12 columns, margin 80, gutter 24. Shift+G включает/выключает сетки.
6. Для всех скругленных прямоугольников установлено Corner smoothing 65%. CSS использует corner-shape: squircle там, где браузер поддерживает это свойство; иначе работают округлые углы.
7. Примените Contrast-плагин к парам текста/фона. Таблица расчетов контрастности находится в docs/verification.json и отчете.
8. Сохраните файл в Figma и приложите ссылку преподавателю. Если импорт development plugin недоступен, перетащите 4 SVG в редактор, оберните каждый в Frame соответствующей ширины и добавьте сетки вручную.

Плагин работает локально, сетевых разрешений не запрашивает. Импорт в реальный Figma-файл не был выполнен и проверен в текущей сессии.

## Ассеты
В images/: SVG-иконки, WebP-фото, оригинальные WAV-демо. Hero-изображение создано встроенным инструментом ImageGen.
Brief: contemporary professional recording studio, condenser microphone and pop filter in foreground, mixing console, acoustic wooden slats, dark graphite interior, subtle violet and lime lights, realistic editorial photography, no people, text or logos.

Официальный справочник manifest: https://developers.figma.com/docs/plugins/manifest/
