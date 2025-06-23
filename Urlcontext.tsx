import React, { createContext, useState, useContext, ReactNode } from 'react';

type ClickInfo = {
  timestamp: string;
  referrer: string;
  location?: string;
};

type UrlRecord = {
  longUrl: string;
  shortCode: string;
  createdAt: string;
  expiresAt: string;
  clicks: ClickInfo[];
};

type UrlContextType = {
  urls: UrlRecord[];
  addUrl: (url: UrlRecord) => void;
  addClick: (shortCode: string, click: ClickInfo) => void;
};

const UrlContext = createContext<UrlContextType | undefined>(undefined);

export const UrlProvider = ({ children }: { children: ReactNode }) => {
  const [urls, setUrls] = useState<UrlRecord[]>(() => {
    const data = localStorage.getItem('urls');
    return data ? JSON.parse(data) : [];
  });

  const addUrl = (url: UrlRecord) => {
    const updated = [...urls, url];
    setUrls(updated);
    localStorage.setItem('urls', JSON.stringify(updated));
  };

  const addClick = (shortCode: string, click: ClickInfo) => {
    ``    const updated = urls.map(url =>
      url.shortCode === shortCode
        ? { ...url, clicks: [...url.clicks, click] }
        : url
    );
    setUrls(updated);
    localStorage.setItem('urls', JSON.stringify(updated));
  };

  return (
    <UrlContext.Provider value={{ urls, addUrl, addClick }}>
      {children}
    </UrlContext.Provider>
  );
};

export const useUrlContext = () => {
  const context = useContext(UrlContext);
  if (!context) {
    throw new Error("useUrlContext must be used within UrlProvider");
  }
  return context;
};