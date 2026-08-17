import React from 'react';
import { createRoot } from 'react-dom/client';
import PixelTransition from './components/PixelTransition.jsx';

const imageStyle = { width: '100%', height: '100%', objectFit: 'cover' };

function slideFromImage(image, name) {
  return (
    <img
      src={image.src}
      alt={image.alt || name}
      style={imageStyle}
      draggable={false}
    />
  );
}

function VenuePixelCard({ venue }) {
  const images = (venue.images?.length ? venue.images : (venue.image ? [{ src: venue.image, alt: venue.imageAlt }] : []))
    .filter((image) => image?.src);

  if (!images.length) {
    return (
      <div
        className="paper-venue-pixel paper-venue-pixel--empty"
        style={{
          width: '100%',
          height: '100%',
          display: 'grid',
          placeItems: 'center',
          backgroundColor: '#111111',
          color: '#ffffff',
          fontFamily: "'Stack Sans Notch', Arial, sans-serif",
          fontSize: '18px',
          fontWeight: 600,
          textAlign: 'center',
          padding: '12px',
        }}
      >
        {venue.name}
      </div>
    );
  }

  const slides = images.map((image) => slideFromImage(image, venue.name));
  const slideKey = `${venue.id}:${images.map((image) => image.src).join('|')}`;

  return (
    <PixelTransition
      slides={slides}
      slideKey={slideKey}
      autoPlay={images.length > 1}
      autoPlayInterval={2600}
      gridSize={10}
      pixelColor="#000000"
      animationStepDuration={0.4}
      aspectRatio="100%"
      className="paper-venue-pixel"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

export function mountVenuePixel(element, venue) {
  if (!element || !venue) return () => {};

  const root = createRoot(element);
  root.render(<VenuePixelCard venue={venue} />);

  return () => root.unmount();
}
