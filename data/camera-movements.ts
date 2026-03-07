export const cameraMovements = [
  { id: 'orbit-left', label: 'Orbit Left', description: 'Camera orbits around the product from left', prompt: 'Orbit left' },
  { id: 'orbit-right', label: 'Orbit Right', description: 'Camera orbits around the product from right', prompt: 'Orbit right' },
  { id: 'zoom-in', label: 'Zoom In', description: 'Smooth zoom into the product', prompt: 'Zoom in' },
  { id: 'zoom-out', label: 'Zoom Out', description: 'Smooth zoom out revealing context', prompt: 'Zoom out' },
  { id: 'pan-left', label: 'Pan Left', description: 'Camera pans horizontally left', prompt: 'Pan left' },
  { id: 'pan-right', label: 'Pan Right', description: 'Camera pans horizontally right', prompt: 'Pan right' },
  { id: 'tilt-up', label: 'Tilt Up', description: 'Camera tilts upward', prompt: 'Tilt up' },
  { id: 'tilt-down', label: 'Tilt Down', description: 'Camera tilts downward', prompt: 'Tilt down' },
  { id: 'dolly-in', label: 'Dolly In', description: 'Camera physically moves toward the product', prompt: 'Dolly in' },
  { id: 'static', label: 'Static', description: 'Fixed camera position with subtle product animation', prompt: 'Static shot' },
] as const

export type CameraMovementId = typeof cameraMovements[number]['id']
