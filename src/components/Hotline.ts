import 'leaflet-hotline';
import { createPathComponent, PathProps } from '@react-leaflet/core';
import { PropsWithChildren } from '@react-leaflet/core/types/component';

interface Props extends PathProps, PropsWithChildren {
  positions: (readonly [number, number, number])[];
  outlineWidth: number;
  outlineColor?: string;
  palette: Record<number, string>;
  min?: number;
  max?: number;
  weight?: number; // TODO inherited from PathProps; should we actually extend from Path?
}

export const Hotline = createPathComponent<any, Props>(
  (props, context) => {
    return {
      instance: (window['L'] as any).hotline(props.positions, props),
      context,
    };
  },

  (instance, props, prevProps) => {
    if (props.positions !== prevProps.positions) {
      (instance as any).setLatLngs(props.positions);
    }
  },
);
