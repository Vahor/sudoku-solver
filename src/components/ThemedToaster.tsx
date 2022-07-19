import { useTheme } from 'next-themes';
import React from 'react'
import { Toaster } from 'react-hot-toast';

export interface ThemedToasterProps {}

export const ThemedToaster = ({}: ThemedToasterProps) => {
    const { theme } = useTheme();


  const toastOptions = React.useMemo(() => {
      return ({
          style: {
              background: "#262626",
              color: "#FACEE7", // pink-200
          },
          iconTheme: {
              primary: "#FACEE7",
              secondary: "#262626",
          },
      });
  }, []);

  return <Toaster toastOptions={toastOptions} />;
}