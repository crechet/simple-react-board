import _ from 'lodash';

import constants from '../constants';

const cardLists = {
    "1": { id: "1", position: "0", name: "Card List 1", cards: {
        "1": { id: "1", listId: "1", position: "0", name: "Card 1", description: "Description for Card 1" },
        "2": { id: "2", listId: "1", position: "1", name: "Card 2", description: "Description for Card 2" }
    } },
    "2": { id: "2", position: "1", name: "Card List 2", cards: {
        "3": { id: "3", listId: "2", position: "0", name: "Card about Soup", description: "Soup is good" }
    } },
    "3": { id: "3", position: "2", name: "Card List 3", cards: {} },
    "4": { id: "4", position: "3", name: "Card List 4", cards: {} }
};

export default function (state = {}, action) {
    let updatedState;
    let name;
    let cardListId;
    let cardId;
    let data;
    let source;
    let target;

    switch (action.type) {
        case constants.API_ADD_LIST:
            let { data } = action.payload;
            return { ...state, [data._id]: data };

        case constants.API_FETCH_LISTS:
            let payloadObject = _.keyBy(action.payload, '_id');
            console.log('lists:', payloadObject);
            return payloadObject;

        case constants.API_DELETE_LIST:
            return _.omit(state, action.payload.data._id);

        case constants.API_UPDATE_LIST:
            return { ...state, [action.payload.data._id]: action.payload.data };

        case constants.UPDATE_LISTS_ON_DROP:
            let { updatedSource, updatedTarget } = action.payload;
            return { ...state, [updatedSource._id]: updatedSource, [updatedTarget._id]: updatedTarget };

        // Old...
        case constants.UPDATE_CARD_LISTS_ON_DROP:
            source = action.payload.source;
            target = action.payload.target;
            updatedState = _.clone(state);

            updatedState[source.id].position = target.position;
            updatedState[target.id].position = source.position;

            return updatedState;

        case constants.UPDATE_CARD_LISTS_ON_CARD_DROP:
            function cleanCards(cards, badId) {
                return _.pickBy(cards, (card) => {
                    return card.id !== badId;
                });
            }

            let tempSource, tempTarget;
            source = action.payload.source;
            target = action.payload.target;
            updatedState = {...state};

            // If target is a CardList.
            if (!target.listId) {
                tempSource = _.clone(state[source.listId].cards[source.id]);
                updatedState[source.listId].cards = cleanCards(updatedState[source.listId].cards, source.id);
                tempSource.listId = target.id;
                tempSource.position = _.size(target.cards).toString();
                updatedState[target.id].cards[source.id] = tempSource;
            } else {
                // Objects from State.
                tempSource = _.clone(state[source.listId].cards[source.id]);
                tempTarget = _.clone(state[target.listId].cards[target.id]);

                // Update them with payload data.
                tempSource.listId = target.listId;
                tempSource.position = target.position;
                tempTarget.listId = source.listId;
                tempTarget.position = source.position;

                // Delete original cards from state.
                updatedState[source.listId].cards = cleanCards(updatedState[source.listId].cards, source.id);
                updatedState[target.listId].cards = cleanCards(updatedState[target.listId].cards, target.id);

                // Add updated source and target cards to card lists.
                updatedState[tempTarget.listId].cards[tempTarget.id] = tempTarget;
                updatedState[tempSource.listId].cards[tempSource.id] = tempSource;
            }
            return updatedState;

        case constants.ADD_CARD:
            name = action.payload.name;
            cardListId = action.payload.cardListId;

            updatedState = {...state};
            cardId = Date.now().toString();
            updatedState[cardListId].cards[cardId] = {
                id: cardId,
                listId: cardListId,
                position: _.size(updatedState[cardListId].cards).toString(),
                name: name
            };

            return updatedState;

        case constants.FETCH_CARD:
            data = action.payload;
            return state;

        case constants.UPDATE_CARD:
            data = action.payload;
            updatedState = {...state};
            updatedState[data.listId].cards[data.id] = data;

            return updatedState;

        default:
            return state;
    }
}
