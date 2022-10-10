import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import App from './App.tsx'
import './index.css'
import './antd-override.css'
import { RecoilRoot } from 'recoil'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'




const Index = () => {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <React.StrictMode>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </RecoilRoot>
    </React.StrictMode>
  )
}

ReactDOM.render(
  <Index />,
  document.getElementById('root')
)
