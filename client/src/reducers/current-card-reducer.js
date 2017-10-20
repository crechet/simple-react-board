import constants from '../constants';

export default function (state = null, action) {
    switch (action.type) {
        case constants.API_FETCH_CARD:
            return action.payload;

        default:
            return state;
    }
}
