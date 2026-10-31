# Halloween 2K26

This client-side Halloween experience is built with React 19 and Vite. It includes an opening invitation, greeting card, Treat promise route, and five-level Trick route with a personalized survivor certificate and downloadable PDF.

The app uses the Vite React plugin for JSX support.

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## Local development

```sh
npm install
npm run dev
```

## Production checks

```sh
npm run lint
npm run build
npm run preview
```

The production files are written to `dist/`. The project has no backend, database, API keys, or server-side runtime requirement.

## Static deployment

- **Vercel:** use `npm run build` and `dist` as the output directory.
- **Netlify:** use `npm run build` and `dist` as the publish directory.
- **GitHub Pages:** use the same build command; the relative Vite base supports deployment from a repository subpath.

The experience uses in-app scene state rather than URL routes, so static hosting does not require rewrite rules.

