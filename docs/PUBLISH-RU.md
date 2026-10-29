# Публикация на GitHub Pages

Публикация еще не выполнена. Следующие действия создадут публичный сайт и публичный репозиторий. PDF задания не включены в проект и не будут опубликованы.

1. Войдите на github.com. Нажмите New repository. Имя: `waveform-studio-lab9`. Visibility: Public. Не добавляйте README, .gitignore или license — они создадут лишнюю начальную историю.
2. Откройте терминал в корне распакованной папки `studio-lab9`, где находится index.html. Проверьте `git log --oneline` — история должна содержать минимум три смысловых коммита.
3. Подставьте свой точный GitHub username вместо YOUR_USERNAME и выполните:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/waveform-studio-lab9.git
git push -u origin main
```

Если origin уже существует, сначала посмотрите `git remote -v`; для замены используйте `git remote set-url origin` с URL именно вашего нового репозитория. Не выполняйте force push. Если появляется окно входа Git Credential Manager, завершите авторизацию самостоятельно. Пароли или токены в файлы проекта не записывайте.

4. Откройте Settings → Pages → Build and deployment → Source → Deploy from a branch. Branch: main, Folder: / (root). Save.
5. Дождитесь успешного pages build/deploy во вкладке Actions. Откройте точный адрес, показанный в Settings → Pages. Это обычно https://YOUR_USERNAME.github.io/waveform-studio-lab9/ — ссылка здесь является шаблоном, а не опубликованным сайтом.
6. Проверьте на опубликованном сайте фото, SVG, аудио, меню, якоря, темы, форму и отсутствие 404. Откройте DevTools → Device toolbar и проверьте ширины 320, 360, 390, 480, 768, 1024 и 1440 px. Убедитесь, что document.documentElement.scrollWidth не больше window.innerWidth.
7. Добавьте в отчет реальные ссылки на репозиторий, Pages и Figma, приложите снимки проверок. Не заменяйте шаблоны вымышленными адресами.

История Git присутствует в `.git` внутри ZIP. Дополнительно выдан файл `studio-lab9.bundle`: если архиватор потеряет `.git`, восстановите историю командой `git clone studio-lab9.bundle studio-restored` и публикуйте из восстановленной папки.

Официальная инструкция: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
