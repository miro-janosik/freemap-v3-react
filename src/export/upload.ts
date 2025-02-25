import FileSaver from 'file-saver';
import { Destination } from 'fm3/actions/mainActions';
import { toastsAdd } from 'fm3/actions/toastsActions';
import { httpRequest } from 'fm3/authAxios';
import { getAuth2, loadGapi } from 'fm3/gapiLoader';
import qs from 'query-string';
import { DefaultRootState } from 'react-redux';
import { Dispatch } from 'redux';

export const licenseNotice =
  'Various licenses may apply - like OpenStreetMap (http://www.openstreetmap.org/copyright). Please add missing attributions upon sharing this file.';

export async function upload(
  type: 'gpx' | 'geojson',
  data: Blob,
  destination: Destination,
  getState: () => DefaultRootState,
  dispatch: Dispatch,
): Promise<void> {
  switch (destination) {
    case 'dropbox': {
      const redirUri = encodeURIComponent(
        `${location.protocol}//${location.host}/dropboxAuthCallback.html`,
      );

      const w = window.open(
        `https://www.dropbox.com/oauth2/authorize?client_id=vnycfeumo6jzg5p&response_type=token&redirect_uri=${redirUri}`,
        'freemap-dropbox',
        'height=400,width=600',
      );

      if (!w) {
        dispatch(
          toastsAdd({
            id: 'enablePopup',
            messageKey: 'general.enablePopup',
            style: 'danger',
            timeout: 5000,
          }),
        );

        return;
      }

      const p = new Promise<string | void>((resolve, reject) => {
        const msgListener = (e: MessageEvent) => {
          if (
            e.origin === window.location.origin &&
            typeof e.data === 'object' &&
            typeof e.data.freemap === 'object' &&
            e.data.freemap.action === 'dropboxAuth'
          ) {
            const { access_token: accessToken, error } = qs.parse(
              e.data.freemap.payload.slice(1),
            );

            if (accessToken) {
              resolve(
                Array.isArray(accessToken) ? accessToken[0] : accessToken,
              );
            } else {
              reject(new Error(`OAuth: ${error}`));
            }

            w.close();
          }
        };

        const timer = window.setInterval(() => {
          if (w.closed) {
            window.clearInterval(timer);

            window.removeEventListener('message', msgListener);

            resolve();
          }
        }, 500);

        window.addEventListener('message', msgListener);
      });

      const authToken = await p; // TODO handle error (https://www.oauth.com/oauth2-servers/authorization/the-authorization-response/)

      if (authToken === undefined) {
        return;
      }

      await httpRequest({
        getState,
        method: 'POST',
        url: 'https://content.dropboxapi.com/2/files/upload',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/octet-stream',
          'Dropbox-API-Arg': JSON.stringify({
            path: `/freemap-export-${new Date().toISOString()}.${type}`,
          }),
        },
        data,
        expectedStatus: 200,
      });

      dispatch(
        toastsAdd({
          id: 'gpxExport',
          style: 'info',
          timeout: 5000,
          messageKey: 'gpxExport.exportedToDropbox',
        }),
      );

      break;
    }
    case 'gdrive':
      {
        await loadGapi();

        await new Promise<void>((resolve) => {
          gapi.load('picker', () => {
            resolve();
          });
        });

        // await new Promise(resolve => {
        //   gapi.client.load('drive', 'v3', resolve);
        // });

        await getAuth2({
          scope: 'https://www.googleapis.com/auth/drive.file',
        });

        const auth2 = gapi.auth2.getAuthInstance();

        const result = await auth2.signIn({
          scope: 'https://www.googleapis.com/auth/drive.file',
        });

        const ar = result.getAuthResponse();

        const folder = await new Promise<any>((resolve) => {
          const pkr = google.picker;

          new pkr.PickerBuilder()
            .addView(
              new pkr.DocsView(pkr.ViewId.FOLDERS).setSelectFolderEnabled(true),
            )
            .setOAuthToken(ar.access_token)
            .setDeveloperKey('AIzaSyC90lMoeLp_Rbfpv-eEOoNVpOe25CNXhFc')
            .setCallback(pickerCallback)
            .setTitle('Select a folder')
            .build()
            .setVisible(true);

          function pickerCallback(data: any) {
            switch (data[pkr.Response.ACTION]) {
              case pkr.Action.PICKED:
                resolve(data[pkr.Response.DOCUMENTS][0]);
                break;
              case pkr.Action.CANCEL:
                resolve(undefined);
                break;
            }
          }
        });

        if (!folder) {
          return; // don't close export dialog
        }

        const formData = new FormData();

        formData.append(
          'metadata',
          new Blob(
            [
              JSON.stringify({
                name: `freemap-export-${new Date().toISOString()}.${type}`,
                mimeType:
                  type === 'gpx'
                    ? 'application/gpx+xml'
                    : 'application/geo+json',
                parents: [folder.id],
              }),
            ],
            { type: 'application/json' },
          ),
        );

        formData.append('file', data);

        await httpRequest({
          getState,
          method: 'POST',
          url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
          headers: { Authorization: `Bearer ${ar.access_token}` },
          data: formData,
          expectedStatus: 200,
        });
      }

      dispatch(
        toastsAdd({
          id: 'gpxExport',
          style: 'info',
          timeout: 5000,
          messageKey: 'gpxExport.exportedToGdrive',
        }),
      );

      break;
    case 'download':
      FileSaver.saveAs(
        data,
        `freemap-export-${new Date().toISOString()}.${type}`,
      );

      break;
  }
}
