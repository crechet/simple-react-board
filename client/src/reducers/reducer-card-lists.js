import _ from 'lodash';

import constants from '../constants';

export default function (state = {}, action) {
    let listToUpdate;
    let updatedSource, updatedTarget, updatedList;

    function convertCards(list) {
        // if (list.cards)
        list.cards = _.keyBy(list.cards, '_id');
    }

    switch (action.type) {
        case constants.API_ADD_LIST:
            convertCards(action.payload);
            return { ...state, [action.payload._id]: action.payload };

        case constants.API_FETCH_LISTS:
            let listsCollection = _.keyBy(action.payload, '_id');

            listsCollection = _.each(listsCollection, (list) => {
                convertCards(list);
            });

            return listsCollection;

        case constants.API_DELETE_LIST:
            return _.omit(state, action.payload._id);

        case constants.API_UPDATE_LIST:
            convertCards(action.payload);
            return { ...state, [action.payload._id]: action.payload };

        case constants.UPDATE_LISTS_ON_DROP:
            updatedSource = action.payload.updatedSource;
            updatedTarget = action.payload.updatedTarget;
            convertCards(updatedSource);
            convertCards(updatedTarget);
            return { ...state, [updatedSource._id]: updatedSource, [updatedTarget._id]: updatedTarget };

        case constants.API_ADD_CARD_TO_LIST:
            listToUpdate = { ...state[action.payload.list] };
            listToUpdate.cards = { ...listToUpdate.cards, [action.payload._id]: action.payload };

            return { ...state, [action.payload.list]: listToUpdate };

        case constants.API_UPDATE_CARD:
            listToUpdate = { ...state[action.payload.list] };
            listToUpdate.cards[action.payload._id] = action.payload;

            return { ...state, [action.payload.list]: listToUpdate };

        case constants.UPDATE_LISTS_ON_CARD_DROP:
            updatedSource = action.payload.updatedSource;
            updatedTarget = action.payload.updatedTarget;
            updatedList = action.payload.updatedList;

            if (updatedSource && updatedTarget && updatedSource.list === updatedTarget.list) {
                listToUpdate = { ...state[updatedSource.list] };
                listToUpdate.cards = { ...listToUpdate.cards, [updatedTarget._id]: updatedTarget, [updatedSource._id]: updatedSource };

                return { ...state, [updatedSource.list]: listToUpdate };
            } else if (updatedList) {
                // In this case updatedList contains updated cards collection.
                convertCards(updatedList);
                return { ...state, [updatedList._id]: updatedList };
            }

        default:
            return state;
    }
}
