# Sunnylnn

Official multilingual website for Sunnylnn Ltd.

## Website

The production-ready static site is contained in [`dist`](./dist). It supports English, Chinese, French, German, Spanish, and Italian.

## Local preview

From the repository root, run:

```bash
python3 -m http.server 8080 --directory dist
```

Then open <http://localhost:8080>.

## Deployment

Pushes to `main` are deployed automatically with GitHub Pages through the workflow in `.github/workflows/deploy-pages.yml`.

