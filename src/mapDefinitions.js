const baseSpecs = [['A', 'Automapa', 'car'], ['T', 'Turistická', 'male'], ['C', 'Cyklomapa', 'bicycle'], ['K', 'Lyžiarska', 'snowflake-o']];

export const baseLayers = [
  ...baseSpecs.map(([type, name, icon]) => ({
    name,
    type,
    icon,
    url: `//{s}.freemap.sk/${type}/{z}/{x}/{y}.{tileFormat}`,
    attribution: 'mapa © Freemap Slovakia, dáta © prispievatelia <a href="https://osm.org/copyright" target="_blank">OpenStreetMap</a>',
    minZoom: 8,
    maxNativeZoom: 16,
    key: type.toLowerCase(),
  })),
  {
    name: 'Satelitná',
    type: 'S',
    icon: 'plane',
    minZoom: 0,
    maxNativeZoom: 18,
    key: 's',
  },
  {
    name: 'OpenStreetMap',
    type: 'O',
    icon: 'globe',
    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    minZoom: 0,
    maxNativeZoom: 19,
    // showOnlyInExpertMode: true,
    attribution: 'dáta © prispievatelia <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors',
    key: 'o',
  },
  {
    name: 'mtbmap.cz',
    type: 'M',
    url: 'http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png',
    minZoom: 3,
    maxNativeZoom: 18,
    showOnlyInExpertMode: true,
    attribution: 'mapa © <a href="mailto:smmtb@gmail.com">Martin Tesař</a>, dáta © prispievatelia <a href="https://osm.org/copyright" target="_blank">OpenStreetMap</a>',
    key: 'm',
  },
  {
    name: 'Infomapa',
    type: 'i',
    icon: 'info',
    url: 'http://{s}.infomapa.sk/0/{z}/{x}/{y}',
    minZoom: 8,
    maxNativeZoom: 18,
    showOnlyInExpertMode: true,
    attribution: 'mapa © 2016 <a href="http://www.infomapa.sk/" target="_blank">www.infomapa.sk</a>, dáta © prispievatelia <a href="https://osm.org/copyright" target="_blank">OpenStreetMap</a>',
    key: 'i',
  },
  {
    name: 'Infomapa ČB',
    type: 'j',
    icon: 'info',
    url: 'http://{s}.infomapa.sk/1/{z}/{x}/{y}',
    minZoom: 8,
    maxNativeZoom: 18,
    showOnlyInExpertMode: true,
    attribution: 'mapa © 2016 <a href="http://www.infomapa.sk/" target="_blank">www.infomapa.sk</a>, dáta © prispievatelia <a href="https://osm.org/copyright" target="_blank">OpenStreetMap</a>',
    key: 'j',
  },
];

export const overlayLayers = [
  {
    name: 'Fotografie',
    type: 'I',
    icon: 'picture-o',
    minZoom: 0,
    key: 'f',
    zIndex: 3,
    attribution: 'fotografie © CC-BY-SA', // FIXME it is ignored
  },
  {
    name: 'Lesné cesty NLC',
    type: 'N',
    icon: 'tree',
    url: 'http://gpsteam.eu/cache/nlcml/{z}/{x}/{y}.png',
    attribution: '© <a href="http://www.nlcsk.org/" target="_blank">NLC Zvolen</a>',
    minZoom: 14,
    maxNativeZoom: 16,
    key: 'n',
    zIndex: 2,
  },
  {
    name: 'Strava heatmap',
    type: 's',
    url: 'https://heatmap-external-{s}.strava.com/tiles/ride/bluered/{z}/{x}/{y}.png?px=256',
    attribution: '© <a href="https://www.strava.com/" target="_blank">Strava</a>',
    minZoom: 0,
    maxNativeZoom: 16,
    key: 'h',
    showOnlyInExpertMode: true,
    zIndex: 2,
  },
  {
    name: 'OSM GPS stopy',
    type: 'g',
    icon: 'mobile',
    url: 'http://gps-{s}.tile.openstreetmap.org/lines/{z}/{x}/{y}.png',
    attribution: '© prispievatelia <a href="https://osm.org/copyright" target="_blank">OpenStreetMap</a>',
    minZoom: 0,
    maxNativeZoom: 20,
    key: 'g',
    showOnlyInExpertMode: true,
    zIndex: 2,
  },
  {
    name: 'Turistické trasy',
    type: 't',
    icon: 'male',
    url: '//tiles.freemap.sk/trails/{z}/{x}/{y}.png',
    attribution: '© prispievatelia <a href="https://osm.org/copyright" target="_blank">OpenStreetMap</a>',
    minZoom: 8,
    maxNativeZoom: 16,
    key: 'T',
    showOnlyInExpertMode: true,
    zIndex: 2,
  },
  {
    name: 'Cyklotrasy',
    type: 'c',
    icon: 'bicycle',
    url: '//tiles.freemap.sk/cycle/{z}/{x}/{y}.png',
    attribution: '© prispievatelia <a href="https://osm.org/copyright" target="_blank">OpenStreetMap</a>',
    minZoom: 8,
    maxNativeZoom: 16,
    key: 'C',
    showOnlyInExpertMode: true,
    zIndex: 2,
  },
  {
    name: 'Render. klienti',
    type: 'r',
    icon: 'pencil-square-o',
    url: '//old.freemap.sk/layers/renderedby/?/{z}/{x}/{y}',
    minZoom: 8,
    maxNativeZoom: 12,
    key: 'R',
    showOnlyInExpertMode: true,
    zIndex: 4,
  },
];

// http://tile.mtbmap.cz/mtbmap_tiles/11/1135/705.png
// http://mtbmap.cz/
// 3 - 18
