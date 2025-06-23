export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidShortcode = (code: string): boolean =>
  /^[a-zA-Z0-9]{1,10}$/.test(code);

export const isValidInteger = (val: string): boolean =>
  /^\d+$/.test(val);