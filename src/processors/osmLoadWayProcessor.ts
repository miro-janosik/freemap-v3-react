import { lineString } from '@turf/helpers';

import { trackViewerSetData } from 'fm3/actions/trackViewerActions';
import { toNodes, toWays } from 'fm3/osmUtils';
import { Processor } from 'fm3/middlewares/processorMiddleware';
import { osmLoadWay } from 'fm3/actions/osmActions';
import { httpRequest } from 'fm3/authAxios';

export const osmLoadWayProcessor: Processor = {
  actionCreator: osmLoadWay,
  errorKey: 'osm.fetchingError',
  handle: async ({ dispatch, getState }) => {
    const { data } = await httpRequest({
      getState,
      method: 'GET',
      url: `//api.openstreetmap.org/api/0.6/way/${
        getState().trackViewer.osmWayId
      }/full`,
      expectedStatus: 200,
    });

    const nodes: any = {};
    const ways: any = {};

    for (const item of data.elements) {
      if (item.type === 'node') {
        nodes[item.id] = [item.lon, item.lat];
      } else if (item.type === 'way') {
        ways[item.id] = item.nodes.map(ref => nodes[ref]);
      }
    }

    dispatch(
      trackViewerSetData({
        trackGeojson: {
          type: 'FeatureCollection',
          features: Object.keys(ways).map(id => lineString(ways[id])),
        },
        startPoints: [],
        finishPoints: [],
      }),
    );
  },
};
