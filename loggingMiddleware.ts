export const logAction = (message: string, data: any) => {
  const log = {
    timestamp: new Date().toISOString(),
    message,
    data,
  };
  const logs = JSON.parse(localStorage.getItem('logs') || '[]');
  logs.push(log);
  localStorage.setItem('logs', JSON.stringify(logs));
};