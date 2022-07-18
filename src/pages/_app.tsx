// src/pages/_app.tsx
import type { AppType } from "next/dist/shared/lib/utils";
import { GoogleAnalytics } from "nextjs-google-analytics";
import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <GoogleAnalytics />
      <Component {...pageProps} />
    </>)
};

export default MyApp;
