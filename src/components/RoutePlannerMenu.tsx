import {
  convertToDrawing,
  setSelectingHomeLocation,
} from 'fm3/actions/mainActions';
import {
  routePlannerSetFinish,
  routePlannerSetFromCurrentPosition,
  routePlannerSetMode,
  routePlannerSetPickMode,
  routePlannerSetStart,
  routePlannerSetTransportType,
  routePlannerSwapEnds,
  // routePlannerToggleItineraryVisibility,
  routePlannerToggleElevationChart,
  routePlannerToggleMilestones,
  RoutingMode,
} from 'fm3/actions/routePlannerActions';
import { toastsAdd } from 'fm3/actions/toastsActions';
import { useScrollClasses } from 'fm3/hooks/useScrollClasses';
import { useMessages } from 'fm3/l10nInjector';
import { TransportType, transportTypeDefs } from 'fm3/transportTypeDefs';
import {
  MouseEvent,
  ReactElement,
  SyntheticEvent,
  useCallback,
  useMemo,
} from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import FormCheck from 'react-bootstrap/FormCheck';
import {
  FaBullseye,
  FaChartArea,
  FaCrosshairs,
  FaFlask,
  FaHome,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaMoneyBill,
  FaPencilAlt,
  FaPlay,
  FaStop,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { is } from 'typescript-is';
import { DeleteButton } from './DeleteButton';
import { ToolMenu } from './ToolMenu';

export default RoutePlannerMenu;

export function RoutePlannerMenu(): ReactElement {
  const m = useMessages();

  const dispatch = useDispatch();

  const milestones = useSelector((state) => state.routePlanner.milestones);

  const homeLocation = useSelector((state) => state.main.homeLocation);

  const transportType = useSelector(
    (state) => state.routePlanner.transportType,
  );

  const mode = useSelector((state) => state.routePlanner.mode);

  const pickPointMode = useSelector((state) => state.routePlanner.pickMode);

  const routeFound = useSelector(
    (state) => !!state.routePlanner.alternatives.length,
  );

  const elevationProfileIsVisible = useSelector(
    (state) => !!state.elevationChart.trackGeojson,
  );

  const canSwap = useSelector(
    (state) => !!(state.routePlanner.start && state.routePlanner.finish),
  );

  const canDelete = useSelector(
    (state) =>
      !!(
        state.routePlanner.start ||
        state.routePlanner.finish ||
        state.routePlanner.midpoints.length > 0
      ),
  );

  function setFromHomeLocation(
    pointType: string | null,
    e: SyntheticEvent<unknown>,
  ) {
    if (e.target instanceof HTMLButtonElement) {
      dispatch(setSelectingHomeLocation(true));

      return;
    }

    if (!homeLocation) {
      dispatch(
        toastsAdd({
          id: 'routePlanner.noHomeAlert',
          messageKey: 'routePlanner.noHomeAlert.msg',
          style: 'warning',
          actions: [
            {
              nameKey: 'routePlanner.noHomeAlert.setHome',
              action: setSelectingHomeLocation(true),
            },
            { nameKey: 'general.close', style: 'dark' },
          ],
        }),
      );
    } else if (pointType === 'start') {
      dispatch(routePlannerSetStart({ start: homeLocation }));
    } else if (pointType === 'finish') {
      dispatch(routePlannerSetFinish({ finish: homeLocation }));
    }
  }

  const activeTransportType = useMemo(
    () => transportTypeDefs.find(({ type }) => type === transportType),
    [transportType],
  );

  const stopPropagation = useCallback((e: MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleConvertToDrawing = useCallback(() => {
    const tolerance = window.prompt(m?.general.simplifyPrompt, '50');

    if (tolerance !== null) {
      dispatch(
        convertToDrawing({
          type: 'planned-route',
          tolerance: Number(tolerance || '0') / 100000,
        }),
      );
    }
  }, [dispatch, m]);

  const sc = useScrollClasses('vertical');

  return (
    <ToolMenu>
      <Dropdown
        className="ml-1"
        id="transport-type"
        onSelect={(transportType) => {
          if (is<TransportType>(transportType)) {
            dispatch(routePlannerSetTransportType(transportType));
          }
        }}
      >
        <Dropdown.Toggle variant="secondary">
          {activeTransportType ? (
            <>
              {activeTransportType.icon}{' '}
              {['car', 'bikesharing'].includes(activeTransportType.type) && (
                <FaMoneyBill />
              )}
              <span className="d-none d-md-inline">
                {' '}
                {m?.routePlanner.transportType[
                  activeTransportType.type
                ].replace(/\s*,.*/, '') ?? '…'}
              </span>
            </>
          ) : (
            ''
          )}{' '}
        </Dropdown.Toggle>

        <Dropdown.Menu
          popperConfig={{
            strategy: 'fixed',
          }}
        >
          <div className="dropdown-long" ref={sc}>
            <div />

            {transportTypeDefs
              .filter(({ hidden }) => !hidden)
              .map(({ type, icon, development }) => (
                <Dropdown.Item
                  as="button"
                  eventKey={type}
                  key={type}
                  title={m?.routePlanner.transportType[type] ?? '…'}
                  active={transportType === type}
                >
                  {icon}{' '}
                  {['car', 'bikesharing'].includes(type) && <FaMoneyBill />}{' '}
                  {m?.routePlanner.transportType[type] ?? '…'}
                  {development && (
                    <>
                      {' '}
                      <FaFlask
                        title={m?.routePlanner.development ?? '…'}
                        className="text-warning"
                      />
                    </>
                  )}
                  {type === 'bikesharing' && (
                    <>
                      {' '}
                      <a
                        href="http://routing.epsilon.sk/bikesharing.php"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={stopPropagation}
                      >
                        <FaInfoCircle />
                      </a>
                    </>
                  )}
                </Dropdown.Item>
              ))}
          </div>
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown
        className="ml-1"
        onSelect={(mode) => {
          dispatch(routePlannerSetMode(mode as RoutingMode));
        }}
      >
        <Dropdown.Toggle
          id="mode"
          variant="secondary"
          disabled={transportType === 'imhd' || transportType === 'bikesharing'}
        >
          {m?.routePlanner.mode[mode] ?? '…'}
        </Dropdown.Toggle>

        <Dropdown.Menu
          popperConfig={{
            strategy: 'fixed',
          }}
        >
          {(['route', 'trip', 'roundtrip'] as const).map((mode1) => (
            <Dropdown.Item
              eventKey={mode1}
              key={mode1}
              title={m?.routePlanner.mode[mode1] ?? '…'}
              active={mode === mode1}
            >
              {m?.routePlanner.mode[mode1] ?? '…'}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      <ButtonGroup className="ml-1">
        <Dropdown
          as={ButtonGroup}
          id="set-start-dropdown"
          onSelect={() => dispatch(routePlannerSetPickMode('start'))}
        >
          <Dropdown.Toggle
            variant="secondary"
            active={pickPointMode === 'start'}
          >
            <FaPlay color="#409a40" />

            <span className="d-none d-md-inline">
              {' '}
              {m?.routePlanner.start ?? '…'}
            </span>
          </Dropdown.Toggle>

          <Dropdown.Menu
            popperConfig={{
              strategy: 'fixed',
            }}
          >
            <Dropdown.Item>
              <FaMapMarkerAlt /> {m?.routePlanner.point.pick ?? '…'}
            </Dropdown.Item>

            <Dropdown.Item
              onSelect={() => {
                dispatch(routePlannerSetFromCurrentPosition('start'));
              }}
            >
              <FaBullseye /> {m?.routePlanner.point.current ?? '…'}
            </Dropdown.Item>

            <Dropdown.Item
              className="d-flex align-items-center justify-content-between"
              eventKey="start"
              onSelect={setFromHomeLocation}
            >
              <div>
                <FaHome /> {m?.routePlanner.point.home ?? '…'}
              </div>

              <Button
                size="sm"
                variant="secondary"
                className="m-n1"
                title={m?.settings.map.homeLocation.select}
              >
                <FaCrosshairs className="pe-none" />
              </Button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {mode !== 'roundtrip' && (
          <>
            <Button
              as={ButtonGroup}
              variant="secondary"
              onClick={() => dispatch(routePlannerSwapEnds())}
              disabled={!canSwap}
              title={m?.routePlanner.swap ?? '…'}
            >
              ⇆
            </Button>

            <Dropdown
              as={ButtonGroup}
              variant="secondary"
              id="set-finish-dropdown"
              onSelect={() => dispatch(routePlannerSetPickMode('finish'))}
            >
              <Dropdown.Toggle
                variant="secondary"
                active={pickPointMode === 'finish'}
              >
                <FaStop color="#d9534f" />

                <span className="d-none d-md-inline">
                  {' '}
                  {m?.routePlanner.finish ?? '…'}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu
                popperConfig={{
                  strategy: 'fixed',
                }}
              >
                <Dropdown.Item>
                  <FaMapMarkerAlt />
                  {m?.routePlanner.point.pick ?? '…'}
                </Dropdown.Item>

                <Dropdown.Item
                  onSelect={() =>
                    dispatch(routePlannerSetFromCurrentPosition('finish'))
                  }
                >
                  <FaBullseye />
                  {m?.routePlanner.point.current ?? '…'}
                </Dropdown.Item>

                <Dropdown.Item
                  className="d-flex align-items-center justify-content-between"
                  eventKey="finish"
                  onSelect={setFromHomeLocation}
                >
                  <div>
                    <FaHome /> {m?.routePlanner.point.home ?? '…'}
                  </div>

                  <Button
                    size="sm"
                    variant="secondary"
                    className="m-n1"
                    title={m?.settings.map.homeLocation.select}
                  >
                    <FaCrosshairs className="pe-none" />
                  </Button>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        )}
      </ButtonGroup>

      {routeFound && (
        <>
          <Button
            className="ml-1"
            variant="secondary"
            onClick={() => dispatch(routePlannerToggleElevationChart())}
            active={elevationProfileIsVisible}
            title={m?.general.elevationProfile ?? '…'}
          >
            <FaChartArea />

            <span className="d-none d-md-inline">
              {' '}
              {m?.general.elevationProfile ?? '…'}
            </span>
          </Button>

          <Button
            className="ml-1"
            variant="secondary"
            onClick={handleConvertToDrawing}
            title={m?.general.convertToDrawing ?? '…'}
          >
            <FaPencilAlt />

            <span className="d-none d-md-inline">
              {' '}
              {m?.general.convertToDrawing ?? '…'}
            </span>
          </Button>

          <FormCheck
            id="chk-milestones"
            className="ml-1"
            type="checkbox"
            inline
            onChange={() => dispatch(routePlannerToggleMilestones(undefined))}
            checked={milestones}
            label={m?.routePlanner.milestones ?? '…'}
          />

          {canDelete && <DeleteButton />}
        </>
      )}
    </ToolMenu>
  );
}
