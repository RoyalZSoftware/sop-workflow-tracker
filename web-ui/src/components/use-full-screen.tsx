import { Fullscreen } from "@mui/icons-material";
import { useState } from "react";

export function useFullScreen() {
    const [fullScreenWidgetId, setFullScreenWidgetId] = useState<string | undefined>(undefined);

    const toggleFullScreen = (widgetId: string) => {
        if (fullScreenWidgetId !== widgetId)
            setFullScreenWidgetId(widgetId);
        else
            setFullScreenWidgetId(undefined);
    };

    return {
        styleFor: (widgetId: string) => {
            if (fullScreenWidgetId === undefined) {
                return {};
            }
            if (fullScreenWidgetId === widgetId) {
                return { height: '100%', width: '100%', maxWidth: '100%' };
            }
            return { display: 'none' };
        },
        gridFor: (widgetId: string, originalSize: any) => {
            if (fullScreenWidgetId === undefined) {
                return originalSize;
            }
            if (fullScreenWidgetId === widgetId) {
                return 12;
            }
            return originalSize;
        },
        isFullScreen: (widgetId: string) => {
            return fullScreenWidgetId === widgetId;
        },
        toggleFullScreen,
        DefaultToggleFullScreenButton: ({widgetId}: {widgetId: string}) => {
            return <Fullscreen onClick={() => toggleFullScreen(widgetId)} style={{ cursor: 'pointer', zIndex: 400, position: 'absolute', top: 16, right: 16 }} />
        }
    };
}