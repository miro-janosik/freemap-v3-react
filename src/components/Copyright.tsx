import { setActiveModal } from 'fm3/actions/mainActions';
import { tipsShow } from 'fm3/actions/tipsActions';
import { useMessages } from 'fm3/l10nInjector';
import { ReactElement, useCallback, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import Overlay from 'react-bootstrap/Overlay';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { FaLock, FaQuestion, FaRegCopyright, FaRegMap } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Attribution } from './Attribution';

export function Copyright(): ReactElement {
  const m = useMessages();

  const dispatch = useDispatch();

  const mapType = useSelector((state) => state.map.mapType);

  const overlays = useSelector((state) => state.map.overlays);

  // const imhd = useSelector(
  //   (state) => state.routePlanner.transportType === 'imhd',
  // );

  const showLegendButton = useSelector((state) =>
    (['sk', 'cs'].includes(state.l10n.language)
      ? ['A', 'K', 'T', 'C', 'X', 'O']
      : ['X', 'O']
    ).includes(state.map.mapType),
  );

  const [show, setShow] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleButtonClick = useCallback(() => {
    setShow(true);
  }, []);

  const handleHide = useCallback(() => {
    setShow(false);
  }, []);

  return (
    <Card className="fm-toolbar mr-2 mb-2">
      <Button
        className="mr-1"
        ref={buttonRef}
        onClick={handleButtonClick}
        title={m?.mainMenu.mapLegend + ', Privacy policy'}
        variant="secondary"
      >
        <FaQuestion />
      </Button>
      <Overlay
        rootClose
        placement="top"
        show={show}
        onHide={handleHide}
        target={buttonRef.current}
      >
        <Popover id="popover-copyright" className="fm-menu">
          <Popover.Content>
            {showLegendButton && (
              <Dropdown.Item
                key="legend"
                href="?show=legend"
                onSelect={(_, e) => {
                  e.preventDefault();
                  setShow(false);
                  dispatch(setActiveModal('legend'));
                }}
              >
                <FaRegMap /> {m?.mainMenu.mapLegend}
              </Dropdown.Item>
            )}
            <Dropdown.Item
              key="privacyPolicy"
              href="?tip=privacyPolicy"
              onSelect={(_, e) => {
                e.preventDefault();
                setShow(false);
                dispatch(tipsShow('privacyPolicy'));
              }}
            >
              <FaLock /> Privacy policy
            </Dropdown.Item>
          </Popover.Content>
        </Popover>
      </Overlay>
      <OverlayTrigger
        trigger="click"
        rootClose
        placement="top"
        overlay={
          <Popover
            id="popover-positioned-right"
            className="fm-attr-popover pl-2 pr-3"
          >
            <Attribution
              m={m}
              mapType={mapType}
              overlays={overlays}
              // imhd={imhd}
            />
          </Popover>
        }
      >
        <Button variant="secondary" title={m?.main.copyright}>
          <FaRegCopyright />
        </Button>
      </OverlayTrigger>
    </Card>
  );
}
