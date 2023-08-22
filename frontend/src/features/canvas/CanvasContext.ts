import { createContext } from 'react';
import { fabric } from 'fabric';

export const CanvasContext = createContext<fabric.Canvas | null>(null);
