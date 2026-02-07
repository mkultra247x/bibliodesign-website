const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'bibliodesign-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false
}));

// Image upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/images/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Helper functions
const loadData = (file) => {
  const filePath = path.join(__dirname, 'data', file);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return null;
};

const saveData = (file, data) => {
  const filePath = path.join(__dirname, 'data', file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Auth middleware
const requireAuth = (req, res, next) => {
  if (req.session.isAdmin) return next();
  res.redirect('/admin/login');
};

// PUBLIC ROUTES
app.get('/', (req, res) => {
  const content = loadData('content.json');
  const testimonials = loadData('testimonials.json');
  res.render('index', { content, testimonials });
});

app.get('/about', (req, res) => {
  const content = loadData('content.json');
  const team = loadData('team.json');
  res.render('about', { content, team });
});

app.get('/services', (req, res) => {
  const content = loadData('content.json');
  const services = loadData('services.json');
  res.render('services', { content, services });
});

app.get('/process', (req, res) => {
  const content = loadData('content.json');
  res.render('process', { content });
});

app.get('/portfolio', (req, res) => {
  const content = loadData('content.json');
  const projects = loadData('portfolio.json');
  res.render('portfolio', { content, projects });
});

app.get('/contact', (req, res) => {
  const content = loadData('content.json');
  res.render('contact', { content, success: req.query.success });
});

app.post('/contact', (req, res) => {
  const inquiries = loadData('inquiries.json') || [];
  inquiries.push({
    ...req.body,
    date: new Date().toISOString(),
    id: Date.now()
  });
  saveData('inquiries.json', inquiries);
  res.redirect('/contact?success=true');
});

// ADMIN ROUTES
app.get('/admin/login', (req, res) => {
  res.render('admin/login', { error: null });
});

app.post('/admin/login', (req, res) => {
  const users = loadData('users.json');
  const user = users?.find(u => u.username === req.body.username);
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    req.session.isAdmin = true;
    return res.redirect('/admin');
  }
  res.render('admin/login', { error: 'Invalid credentials' });
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/admin', requireAuth, (req, res) => {
  const inquiries = loadData('inquiries.json') || [];
  res.render('admin/dashboard', { inquiries });
});

app.get('/admin/content', requireAuth, (req, res) => {
  const content = loadData('content.json');
  res.render('admin/content', { content, success: req.query.success });
});

app.post('/admin/content', requireAuth, (req, res) => {
  saveData('content.json', req.body);
  res.redirect('/admin/content?success=true');
});

app.get('/admin/testimonials', requireAuth, (req, res) => {
  const testimonials = loadData('testimonials.json') || [];
  res.render('admin/testimonials', { testimonials });
});

app.post('/admin/testimonials', requireAuth, (req, res) => {
  const testimonials = loadData('testimonials.json') || [];
  testimonials.push({ ...req.body, id: Date.now() });
  saveData('testimonials.json', testimonials);
  res.redirect('/admin/testimonials');
});

app.post('/admin/testimonials/delete/:id', requireAuth, (req, res) => {
  let testimonials = loadData('testimonials.json') || [];
  testimonials = testimonials.filter(t => t.id != req.params.id);
  saveData('testimonials.json', testimonials);
  res.redirect('/admin/testimonials');
});

app.get('/admin/portfolio', requireAuth, (req, res) => {
  const projects = loadData('portfolio.json') || [];
  res.render('admin/portfolio', { projects });
});

app.post('/admin/portfolio', requireAuth, upload.single('image'), (req, res) => {
  const projects = loadData('portfolio.json') || [];
  projects.push({
    ...req.body,
    image: req.file ? '/images/' + req.file.filename : '',
    id: Date.now()
  });
  saveData('portfolio.json', projects);
  res.redirect('/admin/portfolio');
});

app.post('/admin/portfolio/delete/:id', requireAuth, (req, res) => {
  let projects = loadData('portfolio.json') || [];
  projects = projects.filter(p => p.id != req.params.id);
  saveData('portfolio.json', projects);
  res.redirect('/admin/portfolio');
});

app.get('/admin/team', requireAuth, (req, res) => {
  const team = loadData('team.json') || [];
  res.render('admin/team', { team });
});

app.post('/admin/team', requireAuth, upload.single('photo'), (req, res) => {
  const team = loadData('team.json') || [];
  team.push({
    ...req.body,
    photo: req.file ? '/images/' + req.file.filename : '',
    id: Date.now()
  });
  saveData('team.json', team);
  res.redirect('/admin/team');
});

app.post('/admin/team/delete/:id', requireAuth, (req, res) => {
  let team = loadData('team.json') || [];
  team = team.filter(m => m.id != req.params.id);
  saveData('team.json', team);
  res.redirect('/admin/team');
});

app.get('/admin/inquiries', requireAuth, (req, res) => {
  const inquiries = loadData('inquiries.json') || [];
  res.render('admin/inquiries', { inquiries });
});

app.post('/admin/inquiries/delete/:id', requireAuth, (req, res) => {
  let inquiries = loadData('inquiries.json') || [];
  inquiries = inquiries.filter(i => i.id != req.params.id);
  saveData('inquiries.json', inquiries);
  res.redirect('/admin/inquiries');
});

app.listen(PORT, () => {
  console.log(`BiblioDesign running at http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
});
