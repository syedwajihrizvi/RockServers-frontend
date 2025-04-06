import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routes/routes.tsx'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

import './styles/index.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import GlobalProvider from './providers/global-provider.tsx'

const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <GlobalProvider>
        <RouterProvider router={router}/>
      </GlobalProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
