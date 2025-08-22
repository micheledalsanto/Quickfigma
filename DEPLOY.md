# 🚀 Deploy Guide per Netlify

## Configurazione Automatica

Il progetto è già configurato per il deploy su Netlify con:

### File di Configurazione
- ✅ `netlify.toml` - Configurazione principale Netlify
- ✅ `public/_redirects` - Backup redirects per SPA routing
- ✅ `package.json` - Build commands corretti

### Impostazioni Build
```
Build command: npm run build
Publish directory: dist
Node version: 18
```

## 🔧 Deploy su Netlify

### Opzione 1: Deploy da GitHub (Consigliato)

1. **Push su GitHub**
   ```bash
   git add .
   git commit -m "feat: setup for netlify deploy"
   git push origin main
   ```

2. **Connetti a Netlify**
   - Vai su [netlify.com](https://netlify.com)
   - "New site from Git"
   - Seleziona il repository GitHub
   - Le impostazioni saranno rilevate automaticamente da `netlify.toml`

3. **Deploy automatico**
   - Netlify builderà e deployerà automaticamente
   - Ogni push a `main` triggerà un nuovo deploy

### Opzione 2: Deploy manuale

1. **Build locale**
   ```bash
   npm run build
   ```

2. **Upload cartella `dist/`**
   - Trascina la cartella `dist` su netlify.com
   - O usa Netlify CLI

### Opzione 3: Netlify CLI

1. **Installa Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   ```

2. **Deploy**
   ```bash
   # Deploy di test
   netlify deploy

   # Deploy in produzione
   netlify deploy --prod
   ```

## 🔧 Configurazioni Incluse

### Performance
- Cache headers per assets statici (1 anno)
- Compressione automatica Netlify
- CDN globale

### Security
- Headers di sicurezza (XSS, CSRF protection)
- HTTPS automatico
- Custom domain support

### SPA Routing
- Redirect `/*` → `/index.html` per React Router
- Supporto per URL diretti con hash routing

## 🌐 Domain personalizzato (Opzionale)

1. **Aggiungi dominio su Netlify**
   - Site settings → Domain management
   - Add custom domain

2. **Configura DNS**
   - Punta il dominio ai name servers Netlify
   - O aggiungi record CNAME

## 📊 Monitoraggio

### Analytics (Opzionale)
Aggiungi a `public/index.html` prima di `</head>`:

```html
<!-- Google Analytics o altro servizio -->
```

### Performance
- Netlify fornisce automaticamente analytics di base
- Lighthouse scores visibili nel dashboard

## 🐛 Troubleshooting

### Build Failures
```bash
# Test build locale
npm run build

# Check logs su Netlify dashboard
```

### Routing Issues
- Verifica che `_redirects` sia in `public/`
- Controlla `netlify.toml` redirect rules

### Performance Issues
- Ottimizza immagini in `public/docs/`
- Considera lazy loading per contenuti pesanti

## 🔄 CI/CD Pipeline

Il setup include:
- ✅ Auto-deploy da GitHub
- ✅ Build preview per PR
- ✅ Branch deploy per testing
- ✅ Rollback automatico in caso di errori

Ogni commit triggerà un deploy automatico con preview URL per testing.