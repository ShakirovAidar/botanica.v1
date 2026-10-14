# 50Lemons — Fast Booking (Phuket Villas)

Одностраничное приложение заявки на подбор виллы на Пхукете.

## Структура

```
index.html              — приложение
assets/
  icons/
    favicon-32.png
    apple-touch-icon.png
    logo.png            — логотип (mask в nav)
  img/
    og-preview.jpg      — превью для соцсетей
    wisdom.jpg          — фото проекта Wisdom
  map/
    1582-977.jpg …      — тайлы карты (Esri World Topo, z11)
```

## Запуск

Откройте `index.html` в браузере или положите папку на любой статический хостинг
(Nginx, Cloudflare Pages, Netlify, GitHub Pages и т.п.).

```bash
# локально
npx serve .
# или
python3 -m http.server 8080
```

## Важно для шаринга (Open Graph)

Соцсети (Telegram, Facebook, iMessage) **не** читают относительные пути к `og:image`.
После деплоя укажите абсолютный URL:

```html
<meta property="og:image" content="https://YOUR-DOMAIN/assets/img/og-preview.jpg">
<meta name="twitter:image" content="https://YOUR-DOMAIN/assets/img/og-preview.jpg">
```

## Карта

Используются статические тайлы Esri (World Topographic Map), без API-ключа.
Атрибуция указана на карте. Координаты проектов — приблизительные маркеры на Пхукете.

## Юридический FAQ

Текст про покупку иностранцем основан на:
- Land Code (Таиланд)
- Civil and Commercial Code §§ 538, 540 (аренда до 30 лет)
- Condominium Act § 19 bis (квота 49%)

Не является юридической консультацией.

## Версия

Release build — 14.10.2026
