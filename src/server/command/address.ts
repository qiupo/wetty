import type { IncomingHttpHeaders } from 'http';
import _ from 'lodash';
import { escapeShell } from '../shared/shell.js';

export function address(
  headers: IncomingHttpHeaders,
  user: string,
  host: string,
): string {
  // Check request-header for username
  const remoteUser = headers['remote-user'];
  if (!_.isUndefined(remoteUser) && !Array.isArray(remoteUser)) {
    return `${escapeShell(remoteUser)}@${host}`;
  }
  if (!_.isUndefined(headers.referer)) {
    const match = headers.referer.match('.+/ssh/([^/]+)$');
    if (match) {
      const arr = match[1].split('?');
      const username = escapeShell(arr[0]);
      const matchHost =arr[1]? arr[1].split('=')[1]: host;
      return `${username}@${matchHost}`;
    }
  }
  return user ? `${escapeShell(user)}@${host}` : host;
}
