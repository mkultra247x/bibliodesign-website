# BiblioDesign Website

A modern, elegant website for **BiblioDesign** — a unique service that visits your home, assesses your space, curates the perfect book collection, and arranges it beautifully in your interior.

## 🌐 Features

### Public Website
- **Home** — Hero section, service preview, testimonials, CTA
- **About** — Company story, mission, team members, values
- **Services** — Detailed service offerings with pricing
- **Process** — Step-by-step explanation of how it works
- **Portfolio** — Showcase of completed projects
- **Contact** — Inquiry form with service selection

### Admin CMS (`/admin`)
- **Dashboard** — Overview with inquiry stats
- **Site Content** — Edit all website text (hero, about, contact info, social links)
- **Testimonials** — Add/remove client testimonials
- **Portfolio** — Manage project showcases with image uploads
- **Team** — Manage team member profiles with photos
- **Inquiries** — View and manage contact form submissions

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# Or run in development mode (auto-restart on changes)
npm run dev
```

The site runs at: **http://localhost:3000**

## 🔐 Admin Access

- **URL:** http://localhost:3000/admin
- **Username:** `admin`
- **Password:** `bibliodesign2025`

> ⚠️ Change the password before deploying to production!

## 📁 Project Structure

```
book-curator-website/
├── server.js           # Express server & routes
├── package.json
├── data/               # JSON data storage (CMS content)
│   ├── content.json    # Site text & settings
│   ├── services.json   # Service offerings
│   ├── testimonials.json
│   ├── portfolio.json
│   ├── team.json
│   ├── users.json      # Admin credentials
│   └── inquiries.json  # Contact form submissions
├── views/              # EJS templates
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── index.ejs
│   ├── about.ejs
│   ├── services.ejs
│   ├── process.ejs
│   ├── portfolio.ejs
│   ├── contact.ejs
│   └── admin/
│       ├── login.ejs
│       ├── dashboard.ejs
│       ├── content.ejs
│       ├── testimonials.ejs
│       ├── portfolio.ejs
│       ├── team.ejs
│       └── inquiries.ejs
└── public/
    ├── css/
    ├── js/
    └── images/         # Uploaded images
```

## 🎨 Design

- **Framework:** Tailwind CSS (via CDN)
- **Fonts:** Cormorant Garamond (headings) + Inter (body)
- **Color Palette:**
  - Cream: `#FAF7F2` (background)
  - Espresso: `#2C2118` (dark brown)
  - Sage: `#8B9D83` (muted green)
  - Terracotta: `#C4846C` (warm accent)
  - Gold: `#C9A962` (accent)

## 🔧 Customization

### Change Admin Password
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YOUR_NEW_PASSWORD', 10))"
```
Then update `data/users.json` with the new hash.

### Add More Pages
1. Create a new `.ejs` file in `views/`
2. Add a route in `server.js`
3. Update navigation in `views/partials/header.ejs`

### Modify Services
Edit `data/services.json` directly, or use the admin panel once you add a services management feature.

## 🌍 Deployment

### Environment Variables
For production, set:
- `PORT` — Server port (default: 3000)
- `SESSION_SECRET` — Secure random string for sessions

### Hosting Options
- **Node.js hosts:** Railway, Render, Heroku, DigitalOcean
- **VPS:** Any server with Node.js 18+
- **Docker:** Add a Dockerfile for containerized deployment

## 📝 License

ISC — Feel free to customize for your own book curation business!

---

Built with ❤️ for book lovers and design enthusiasts.
