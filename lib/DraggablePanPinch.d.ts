import React, { ReactNode } from "react";
import { ViewStyle } from "react-native";
export interface DraggablePanPinchProps {
    children: ReactNode;
    style?: ViewStyle;
    initialScale?: number;
    initialRotation?: number;
    maxScale?: number;
    minScale?: number;
    boundaryX?: number;
    boundaryY?: number;
    enablePan?: boolean;
    enablePinch?: boolean;
    enableRotation?: boolean;
    onScaleChange?: (scale: number) => void;
    onPositionChange?: (x: number, y: number) => void;
    onRotationChange?: (rotation: number) => void;
}
export declare const DraggablePanPinch: ({ children, style, initialScale, initialRotation, maxScale, minScale, boundaryX, boundaryY, enablePan, enablePinch, enableRotation, onScaleChange, onPositionChange, onRotationChange, }: DraggablePanPinchProps) => React.JSX.Element;
