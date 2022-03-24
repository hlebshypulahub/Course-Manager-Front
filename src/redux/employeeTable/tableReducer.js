import { SAVE_SETTINGS, RESTORE_SETTINGS } from "./tableTypes";

const settings = JSON.parse(localStorage.getItem("table-settings"));

const props = {
    reservedViewportWidth: 0,
    columnOrder: null,
    columns: [],
    sortInfo: [],
};

const initialState = settings
    ? {
          settings,
      }
    : {
          settings: props,
      };

export default function reducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SAVE_SETTINGS:
            localStorage.setItem("table-settings", JSON.stringify(payload));
            return {
                settings: { ...payload },
            };

        case RESTORE_SETTINGS:
            return {
                settings: props,
            };

        default:
            return state;
    }
}
