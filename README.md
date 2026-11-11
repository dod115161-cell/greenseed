# GreenSeed - Mầm Xanh
1. Local: `npm install` rồi `npm run dev` (http://localhost:5173).
2. GitHub: `git init && git add . && git commit -m "init"`, tạo repo rỗng trên GitHub, rồi `git remote add origin <url> && git push -u origin main`.
3. Netlify: Add new site > Import from Git > chọn repo. Build command `npm run build`, Publish directory `dist` (đã có sẵn trong netlify.toml).
4. Redirects cho SPA: đã cấu hình trong `netlify.toml` và `public/_redirects`.
