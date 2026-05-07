import type { App } from "leafer-ui";
import { editorStore } from "../../../store/editor";



export function forceSelectModeInSelectTool(app:App) {
    editorStore.subscribe((state) => {
        if (state.activeTool === 'select') {
            app.editor.config.multipleSelect = true;
        }else{
            app.editor.config.multipleSelect = false;
        }
    });
}