import React, { ReactNode } from "react";
import { ViewStyle } from "react-native";
interface ActionButtons {
    zoomIn?: ReactNode;
    zoomOut?: ReactNode;
    rotateLeft?: ReactNode;
    rotateRight?: ReactNode;
}
interface ShowActionButtons {
    zoomIn?: boolean;
    zoomOut?: boolean;
    rotateLeft?: boolean;
    rotateRight?: boolean;
}
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
    showButtons?: ShowActionButtons;
    actionButtons?: ActionButtons;
    actionButtonsContainerStyle?: ViewStyle;
    actionButtonsStyle?: ViewStyle;
    rotateDegree?: number;
    zoomScale?: number;
}
export declare const DraggablePanPinch: ({ children, style, initialScale, initialRotation, maxScale, minScale, boundaryX, boundaryY, enablePan, enablePinch, enableRotation, onScaleChange, onPositionChange, onRotationChange, showButtons, actionButtons, actionButtonsContainerStyle, actionButtonsStyle, rotateDegree, zoomScale, }: DraggablePanPinchProps) => React.JSX.Element;
export {};
