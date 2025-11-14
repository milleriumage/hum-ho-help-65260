type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDevelopment = typeof window !== 'undefined' && window.location.hostname === 'localhost';

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry;
    let log = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (context) {
      log += `\nContext: ${JSON.stringify(context, null, 2)}`;
    }
    
    if (error) {
      log += `\nError: ${error.message}\nStack: ${error.stack}`;
    }
    
    return log;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    const formattedLog = this.formatLog(entry);

    // In production, you might want to send these to a logging service
    if (this.isDevelopment) {
      switch (level) {
        case 'error':
          console.error(formattedLog);
          break;
        case 'warn':
          console.warn(formattedLog);
          break;
        case 'debug':
          console.debug(formattedLog);
          break;
        default:
          console.log(formattedLog);
      }
    }

    // In production, send critical logs to monitoring service
    if (!this.isDevelopment && (level === 'error' || level === 'warn')) {
      // TODO: Send to external logging service (e.g., Sentry, LogRocket)
      // this.sendToMonitoring(entry);
    }
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log('error', message, context, error);
  }

  debug(message: string, context?: Record<string, any>) {
    if (this.isDevelopment) {
      this.log('debug', message, context);
    }
  }

  // Log security events
  security(action: string, context?: Record<string, any>) {
    this.log('warn', `SECURITY: ${action}`, context);
  }

  // Log audit events
  audit(action: string, context?: Record<string, any>) {
    this.log('info', `AUDIT: ${action}`, context);
  }
}

export const logger = new Logger();
