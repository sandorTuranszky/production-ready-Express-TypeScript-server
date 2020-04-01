import * as http from 'http';
import * as config from 'config';
import app from '../src/app';
import { logger as winston } from '../src/utils/logger/winston';

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string): number | string | boolean {
  const value = parseInt(val, 10);

  if (Number.isNaN(value)) {
    // named pipe
    return val;
  }

  if (value >= 0) {
    // port number
    return value;
  }

  return false;
}

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || config.get('app.port'));
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: any): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      winston.error(`${bind} requires elevated privileges`);
      // eslint-disable-next-line no-process-exit
      process.exit(1);
      // eslint-disable-next-line no-unreachable
      break;
    case 'EADDRINUSE':
      winston.error(`${bind} is already in use`);
      // eslint-disable-next-line no-process-exit
      process.exit(1);
      // eslint-disable-next-line no-unreachable
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `pipe ${addr.port}`;
  winston.info(`Listening on ${bind} in ${app.get('env')} environment`);
}

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
