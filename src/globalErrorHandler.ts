import { setErrorTicketId } from 'fm3/actions/mainActions';
import storage from 'local-storage-fallback';
import { is } from 'typescript-is';
import { MyStore } from './storeCreator';

let store: MyStore;

export function setStore(s: MyStore): void {
  store = s;
}

(Error.prototype as any).toJSON = function toJSON() {
  return {
    name: this.name,
    message: this.message,
    fileName: this.fileName,
    lineNumber: this.lineNumber,
    columnNumber: this.columnNumber,
    description: this.description, // MS
    number: this.number, // MS
    stack: this.stack,
  };
};

window.addEventListener('error', (evt) => {
  sendError({
    kind: 'global',
    message: evt.message,
    filename: evt.filename,
    lineno: evt.lineno,
    colno: evt.colno,
    error: evt.error,
  });
});

interface ErrorDetails {
  kind: string;
  action?: any;
  error?: any;
  message?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
}

export function sendError(errDetails: ErrorDetails): void {
  // filter out old browsers
  if (!Array.prototype.flatMap) {
    return;
  }

  console.error('Application error');
  console.error(errDetails);

  if (errDetails.error) {
    window.TrackJS?.console.error(errDetails.error);
  }

  const state = store?.getState();

  window.gtag?.('event', 'error', {
    event_category: 'Error',
    value: errDetails.kind,
  });

  fetch(`${process.env['API_URL']}/logger`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      level: 'error',
      message: 'Webapp error.',
      details: {
        error: errDetails,
        url: window.location.href,
        userAgent: navigator.userAgent,
        storage,
        state,
      },
    }),
  })
    .then((response) => (response.status === 200 ? response.json() : undefined))
    .then((data) => {
      if (
        errDetails.message === 'Script error.' ||
        errDetails.filename === ''
      ) {
        // don't show to user
      } else {
        handle(is<{ id: string }>(data) ? data.id : undefined);
      }
    })
    .catch((err) => {
      console.error(err);

      handle();
    });
}

function handle(id?: string) {
  if (store) {
    store.dispatch(setErrorTicketId(id));
  } else {
    document.body.innerHTML = `
      <h1>Application error</h1>
      <p>Ticket ID: ${id}.</p>
      <p>You can send ticket ID and steps how to reproduce the error to <a href="mailto:freemap@freemap.sk">freemap@freemap.sk</a>.</p>

      <h1>Chyba aplikácie</h1>
      <p>ID incidentu: ${id}.</p>
      <p>Na <a href="mailto:freemap@freemap.sk">freemap@freemap.sk</a> nám môžete zaslať toto ID a kroky, ako sa vám to podarilo.</p>

      <h1>Alkalmazáshiba</h1>
      <p>Jegyazonosító (ticket ID): ${id}.</p>
      <p>
        A jegyazonosítót és a hiba újbóli megjelenéséhez vezető lépések leírását a következő e-mail címre küldheti:
        <a href="mailto:freemap@freemap.sk">freemap@freemap.sk</a>.
      </p>
    `;
  }
}
