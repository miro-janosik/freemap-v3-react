import { wikiLoadPreview } from 'fm3/actions/wikiActions';
import { useMessages } from 'fm3/l10nInjector';
import { Icon } from 'leaflet';
import { ReactElement, useEffect, useRef } from 'react';
import { render } from 'react-dom';
import { FaExternalLinkAlt, FaWikipediaW } from 'react-icons/fa';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';

class WikiIcon extends Icon {
  static template: ChildNode | undefined;

  createIcon(oldIcon?: HTMLElement) {
    const reuse = oldIcon && oldIcon.tagName === 'DIV';

    const div = oldIcon && reuse ? oldIcon : document.createElement('div');

    (this as any)._setIconStyles(div, 'icon');

    if (WikiIcon.template) {
      div.appendChild(WikiIcon.template.cloneNode());
    } else {
      render(<FaWikipediaW />, div);

      WikiIcon.template = div.childNodes.item(0);
    }

    return div;
  }

  createShadow(oldIcon?: HTMLElement) {
    return oldIcon || (null as any as HTMLElement);
  }
}

const wikiIcon = new WikiIcon({
  className: 'leaflet-marker-wiki-icon',
  iconUrl: '',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -9],
  tooltipAnchor: [0, -9],
});

export function WikiLayer(): ReactElement {
  const m = useMessages();

  const points = useSelector((state) => state.wiki.points);

  const preview = useSelector((state) => state.wiki.preview);

  const dispatch = useDispatch();

  const cbMapRef = useRef(new Map<string, () => void>());

  // workaround for https://github.com/PaulLeCam/react-leaflet/issues/895
  useEffect(() => {
    const cbMap = cbMapRef.current;

    const oldKeys = new Set(cbMap.keys());

    for (const { wikipedia } of points) {
      oldKeys.delete(wikipedia);

      if (!cbMap.has(wikipedia)) {
        cbMap.set(wikipedia, () => dispatch(wikiLoadPreview(wikipedia)));
      }
    }

    for (const key of oldKeys) {
      cbMap.delete(key);
    }
  }, [dispatch, points]);

  return (
    <>
      {points.map(({ id, lat, lon, name, wikipedia }) => (
        <Marker
          key={id}
          position={{ lat, lng: lon }}
          icon={wikiIcon}
          // onclick={onSelects[i]}
        >
          {name && (
            <Tooltip className="compact" direction="top" permanent>
              <div
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 200,
                }}
              >
                {name}
              </div>
            </Tooltip>
          )}
          <Popup onOpen={cbMapRef.current.get(wikipedia)}>
            <h4>
              <a
                href={
                  preview
                    ? `https://${preview.lang}.wikipedia.org/wiki/${preview.langTitle}`
                    : wikipedia.replace(
                        /(.*):(.*)/,
                        'https://$1.wikipedia.org/wiki/$2',
                      )
                }
                target="wikipedia"
              >
                {preview ? preview.title : wikipedia.replace(/.*:/, '')}{' '}
                <FaExternalLinkAlt />
              </a>
            </h4>
            {preview ? (
              <div style={{ maxHeight: '50vh', overflow: 'auto' }}>
                {preview.thumbnail && (
                  <img
                    src={preview.thumbnail.source}
                    width={preview.thumbnail.width}
                    height={preview.thumbnail.height}
                  />
                )}
                <div dangerouslySetInnerHTML={{ __html: preview.extract }} />
              </div>
            ) : (
              m?.general.loading
            )}
          </Popup>
        </Marker>
      ))}
    </>
  );
}
