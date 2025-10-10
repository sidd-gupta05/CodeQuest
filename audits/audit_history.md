# 🧾 LabSphere Dependency Audit History

## 🗓️ Audit Summary

| Date | Audit Tool | Report Version | Notes |
|------|-------------|----------------|-------|
| 25/09/2025 | npm audit | 1 | Fixed TailwindCSS & Next.js build errors on Windows |
| 10/10/2025 | npm audit | 2 | Fixed vulnerabilities in jsPDF, DOMPurify, and PDF.js dependencies |

---

## 🧭 Overview (25/09/2025)

| Issue | Description | Severity | Fix Applied |
|--------|--------------|-----------|--------------|
| EPERM unlink error | Permission error during `npm run build` | Moderate | Clean reinstall of dependencies |
| glob scandir error | Unauthorized access to Windows AppData | Moderate | Set folder permissions |
| Build failure | Webpack compilation halted | High | Regenerated `.next` directory |

**Fix Commands:**
```bash
rm -rf node_modules .next
npm cache clean --force
npm install
```

**Windows Fixes:**

> improved `tsconfig.json` for dependency check and limiting project access 

---

## 🧭 Overview (10/10/2025)

| Package | Severity | Issue | Advisory | Fix Version |
|----------|-----------|--------|-----------|--------------|
| dompurify | Moderate | XSS vulnerability | [GHSA-vhxf-7vqr-mrjg](https://github.com/advisories/GHSA-vhxf-7vqr-mrjg) | via `jspdf@3.0.3` |
| jspdf | High | ReDoS & DoS | [GHSA-w532-jxjh-hjhj](https://github.com/advisories/GHSA-w532-jxjh-hjhj) / [GHSA-8mvj-3j78-4qmw](https://github.com/advisories/GHSA-8mvj-3j78-4qmw) | 3.0.3 |
| jspdf-autotable | High | Inherited from jspdf | — | 5.0.2 |
| pdfjs-dist | High | Arbitrary JS execution | [GHSA-wgrm-67xf-hhpq](https://github.com/advisories/GHSA-wgrm-67xf-hhpq) | 5.4.296 |

**Fix Commands (10/10/2025):**
```bash
npm install jspdf@3.0.3 jspdf-autotable@5.0.2 pdfjs-dist@5.4.296
```
