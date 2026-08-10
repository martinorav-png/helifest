# Logo Animation Preview Design

## Goal

Create a standalone HTML mockup that lets the user preview the supplied animated SVG logo and control its playback.

## Direction

Use a restrained Swiss-inspired presentation: white surface, black logo, strong typographic hierarchy, and thin grid rules. The differentiator is a compact control rail that exposes the animation’s actual behavior instead of competing with the mark.

## Scope

- Preserve the supplied SVG paths and 3.5-second morph cycle.
- Add play/pause, restart, and speed controls.
- Add a responsive information panel describing the live animation settings.
- Keep the page dependency-free so it opens directly from disk.

## Success criteria

- The file opens in a modern browser without a build step.
- The logo animates by default and pauses/resumes from the controls.
- Restart returns the logo to the beginning of the animation.
- Speed controls update the SVG animation speed.
- The layout remains usable on narrow screens.
