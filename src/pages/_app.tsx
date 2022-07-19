// src/pages/_app.tsx
import type { AppType } from "next/dist/shared/lib/utils";
import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <script async defer data-website-id="4752123b-6e48-4d37-80b7-ce8d551ef168" src="https://analytics.vahor.fr/umami.js"></script>
      <Component {...pageProps} />
    </>)
};

export default MyApp;
