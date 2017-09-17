const initialState = {
  activeModal: null,
  tool: null,
  homeLocation: null,
  progress: [],
  location: null,
  expertMode: false,
  embeddedMode: false,
  locate: false,
};

export default function main(state = initialState, action) {
  switch (action.type) {
    case 'MAIN_LOAD_STATE': {
      const s = { ...state };
      const { homeLocation, expertMode } = action.payload;
      if (homeLocation && typeof homeLocation.lat === 'number' && homeLocation.lon === 'number') {
        s.homeLocation = { lat: homeLocation.lat, lon: homeLocation.lon };
      }
      s.expertMode = !!expertMode;
      return s;
    }
    case 'SET_ACTIVE_MODAL':
      return { ...state, activeModal: action.payload };
    case 'MAP_RESET':
      return { ...state, tool: null };
    case 'SET_TOOL':
      return { ...state, tool: action.payload };
    case 'SET_HOME_LOCATION':
      return { ...state, homeLocation: { ...action.payload } };
    case 'START_PROGRESS':
      return { ...state, progress: [...state.progress, action.payload] };
    case 'STOP_PROGRESS':
      return { ...state, progress: state.progress.filter(pid => pid !== action.payload) };
    case 'SET_LOCATION':
      return { ...state, location: { lat: action.payload.lat, lon: action.payload.lon, accuracy: action.payload.accuracy } };
    case 'SET_EXPERT_MODE':
      return { ...state, expertMode: action.payload };
    case 'SET_EMBEDDED_MODE':
      return { ...state, embeddedMode: true };
    case 'LOCATE':
      return { ...state, locate: !state.locate };
    default:
      return state;
  }
}
