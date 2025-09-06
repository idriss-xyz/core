'use client';
import {
  FullscreenOverlay,
  FullscreenOverlayProperties,
} from '../fullscreen-overlay';

export const MobileNotSupported = (
  properties: Omit<FullscreenOverlayProperties, 'hideAboveClass'>,
) => {
  return <FullscreenOverlay {...properties} hideAboveClass="lg:hidden" />;
};
