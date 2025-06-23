import { UrlProvider } from './context/UrlContext';
...
root.render(
  <BrowserRouter>
    <UrlProvider>
      <App />
    </UrlProvider>
  </BrowserRouter>
); 