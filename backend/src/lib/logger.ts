export const logger = {
  info: (message: string, meta?: any) => {
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify({
        level: 'INFO',
        timestamp: new Date().toISOString(),
        message,
        ...meta
      }));
    } else {
      console.log(`[INFO] ${new Date().toLocaleTimeString()} - ${message}`, meta ? JSON.stringify(meta) : '');
    }
  },
  error: (message: string, error?: any, meta?: any) => {
    if (process.env.NODE_ENV === 'production') {
      console.error(JSON.stringify({
        level: 'ERROR',
        timestamp: new Date().toISOString(),
        message,
        error: error ? String(error.message || error) : undefined,
        stack: error ? error.stack : undefined,
        ...meta
      }));
    } else {
      console.error(`[ERROR] ${new Date().toLocaleTimeString()} - ${message}`, error || '', meta ? JSON.stringify(meta) : '');
    }
  }
};
