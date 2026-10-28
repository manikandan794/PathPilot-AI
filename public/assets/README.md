# PathPilot AI — Cinematic Hero Assets

This folder houses the visual assets for PathPilot AI's cinematic scroll-controlled hero section.

### Detected & Configured Workspace Assets:
- `pathpilot-start.jpg`: Initial state poster / start frame (sourced from Frame 001).
- `pathpilot-end.jpg`: Terminal state poster / end frame (sourced from Frame 299).
- `frames/`: Complete sequence of 299 sequential high-resolution frames (`ezgif-frame-001.jpg` to `ezgif-frame-299.jpg`) used for 60fps bidirectional scroll scrubbing on HTML5 Canvas.

### Optional Video File:
- `pathpilot-cinematic.mp4`: If you have compiled the video version of the Google Flow transition, place it in this directory (`public/assets/pathpilot-cinematic.mp4`). PathPilot AI's Hero engine automatically checks for video support and falls back gracefully to high-performance canvas frame sequence scrubbing and poster rendering.
