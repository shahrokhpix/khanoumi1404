# گزارش‌های خانومی ۱۴۰۴

دو گزارش تعاملی React/Vite:

- **گزارش سال** — `/`
- **گزارش جنگ** — `/war`

همه فونت‌ها، تصاویر، SVGها و اسکریپت‌ها **محلی** هستند و برای رندر به اینترنت بین‌الملل وابسته نیستند.

## دمو زنده (GitHub Pages)

بعد از فعال‌سازی Pages، دمو اینجا منتشر می‌شود:

**https://shahrokhpix.github.io/khanoumi1404/**

| مسیر | گزارش |
|------|--------|
| `/khanoumi1404/` | گزارش سال |
| `/khanoumi1404/war` | گزارش جنگ |

### فعال‌سازی (یک‌بار)

1. GitHub → repo **khanoumi1404** → **Settings** → **Pages**
2. **Source:** `GitHub Actions`
3. هر push به `main` با workflow **Deploy GitHub Pages demo** خودکار deploy می‌کند

---

## پیش‌نیاز سرور build

| مورد | نسخه پیشنهادی |
|------|----------------|
| Node.js | 20 LTS یا جدیدتر |
| npm | 10+ |

روی سرور production فقط خروجی **`dist/`** لازم است؛ Node بعد از build الزامی نیست (مگر اینکه خودتان `vite preview` بزنید).

---

## ۱. دریافت کد

```bash
git clone https://github.com/shahrokhpix/khanoumi1404.git
cd khanoumi1404
npm ci
```

---

## ۲. تنظیم دامنه (قبل از build)

فایل `.env` بسازید (از `.env.example`):

```env
VITE_SITE_URL=https://reports.example.com
```

- بدون `/` در انتها
- برای canonical، Open Graph، `sitemap.xml` و `robots.txt` استفاده می‌شود
- اگر خالی بماند، build موفق است ولی آدرس‌های SEO مطلق تولید نمی‌شوند

---

## ۳. build

```bash
npm run build
```

خروجی در **`dist/`**:

| فایل/پوشه | کاربرد |
|-----------|--------|
| `index.html` | گزارش سال + SPA |
| `war/index.html` | متای SEO گزارش جنگ |
| `404.html` | fallback برای GitHub Pages و مشابه |
| `assets/` | JS و CSS bundle |
| `fonts/` | IRANSans / IRANSansX |
| `assets/**` | تصاویر و SVG |
| `annual-report.pdf` | دانلود PDF سال |
| `war-report.pdf` | دانلود PDF جنگ |
| `sitemap.xml` | نقشه سایت |
| `robots.txt` | راهنمای کراولر |
| `site.webmanifest` | PWA manifest |

> PDFها باید در `public/` باشند تا داخل `dist/` کپی شوند. بدون آن‌ها لینک «دانلود PDF» 404 می‌دهد.

---

## ۴. deploy روی سرور (Nginx)

محتوای **`dist/`** را در root سایت بگذارید، مثلاً `/var/www/khanoumi-reports/`.

```nginx
server {
    listen 80;
    server_name reports.example.com;

    root /var/www/khanoumi-reports;
    index index.html;

    # فایل‌های استاتیک با cache
    location ~* \.(js|css|png|jpe?g|webp|svg|woff2?|ttf|pdf|ico|xml|txt|webmanifest)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # SPA: / و /war هر دو index.html را لود می‌کنند
    location / {
        try_files $uri $uri/ /index.html;
    }

    # مسیر /war/ — war/index.html از postbuild
    location /war/ {
        try_files $uri $uri/ /war/index.html;
    }
}
```

بعد از SSL (مثلاً certbot):

```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## ۵. Apache (اختیاری)

در root سایت، `.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## ۶. GitHub Pages (دمو)

Workflow آماده است: `.github/workflows/deploy-pages.yml`

```bash
VITE_BASE_PATH=/khanoumi1404/ \
VITE_SITE_URL=https://shahrokhpix.github.io/khanoumi1404 \
npm run build
```

روی GitHub Actions این متغیرها خودکار تنظیم می‌شوند. فقط **Pages → Source: GitHub Actions** را فعال کنید.

---

## ۷. تست محلی قبل از deploy

```bash
npm run preview
```

مرورگر: `http://127.0.0.1:4173/` و `http://127.0.0.1:4173/war`

---

## ۸. چک‌لیست بعد از deploy

- [ ] `/` — گزارش سال باز می‌شود
- [ ] `/war` — گزارش جنگ باز می‌شود
- [ ] `/annual-report.pdf` و `/war-report.pdf` دانلود می‌شوند
- [ ] `/fonts/IRANSans.ttf` بدون خطا لود می‌شود
- [ ] DevTools → Network: **بدون درخواست خارجی** برای فونت/CSS/JS
- [ ] `/sitemap.xml` و `/robots.txt` در دسترس‌اند

---

## توسعه محلی

```bash
npm run dev
```

سرور dev: `http://127.0.0.1:5173`

---

## ساختار مسیرها

| مسیر | توضیح |
|------|--------|
| `/` | گزارش سال ۱۴۰۴ |
| `/war` | گزارش جنگ |
| `/annual-report.pdf` | PDF گزارش سال |
| `/war-report.pdf` | PDF گزارش جنگ |

---

## نکات

- **اینترنت بین‌الملل:** Google Fonts حذف شده؛ فقط فونت‌های `public/fonts/` استفاده می‌شوند.
- **SEO:** `VITE_SITE_URL` را حتماً قبل از build production تنظیم کنید.
- **مقیاس نمایش:** گزارش سال 80%؛ گزارش جنگ فقط روی دسکتاپ (≥1024px) 80% — در CSS (`src/index.css`).

---

## مخزن

[https://github.com/shahrokhpix/khanoumi1404](https://github.com/shahrokhpix/khanoumi1404)
