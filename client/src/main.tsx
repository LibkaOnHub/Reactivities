import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/layout/styles.css';
import { router } from "./app/router/router";

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

// font pro Material UI
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router';
import { StoreContext, store } from './lib/stores/store';

// klient pro React query
const queryClient = new QueryClient();

// vložení hlavní komponenty do HTML prvku root
// a App komponenta bude umístěna v React Query (QueryClientProvider)
createRoot(document.getElementById('root')!).render(
    <StrictMode>

        <StoreContext.Provider value={store}>

            <QueryClientProvider client={queryClient}>

                <ReactQueryDevtools />

                <ToastContainer position="bottom-right" hideProgressBar theme="colored" />

                <RouterProvider router={router} />

            </QueryClientProvider>

        </StoreContext.Provider>

    </StrictMode>
)