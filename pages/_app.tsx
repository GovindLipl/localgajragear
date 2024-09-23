import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.css'
import 'styles/theme.css'
import "react-datepicker/dist/react-datepicker.css";
import store from '../store/index';
const MyApp = React.forwardRef(({
  Component, pageProps,
}: AppProps, ref) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
})

export default MyApp;
