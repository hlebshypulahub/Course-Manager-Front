import { SAVE_SETTINGS, RESTORE_SETTINGS } from "./tableTypes";

export const restoreSettings = () => {
    return {
        type: RESTORE_SETTINGS,
    };
};

export const saveSettings = (settings) => {
    return {
        type: SAVE_SETTINGS,
        payload: settings,
    };
};
