import constants from '../constants';
import axios from 'axios';

import { ROOT_URL } from '../constants';

export const apiFetchLists = () => (dispatch) => {
    axios.get(`${ROOT_URL}/api/list`)
        .then((res) => {
            dispatch({
                type: constants.API_FETCH_LISTS,
                payload: res.data
            });
        });
};

export const apiFetchList = (id) => (dispatch) => {
    axios.get(`${ROOT_URL}/api/list/${id}`)
        .then((list) => {
            dispatch({
                type: constants.API_FETCH_LIST,
                payload: list.data
            });
        });
};

export const apiAddList = (listData) => (dispatch) => {
    axios.post(`${ROOT_URL}/api/list`, listData)
        .then((list) => {
            dispatch({
                type: constants.API_ADD_LIST,
                payload: list.data
            });
        });
};

export const apiDeleteList = (listId) => (dispatch) => {
    axios.delete(`${ROOT_URL}/api/list/${listId}`)
        .then((response) => {
            dispatch({
                type: constants.API_DELETE_LIST,
                payload: response.data
            });
        });
};

export const apiUpdateList = (data) => (dispatch) => {
    axios.put(`${ROOT_URL}/api/list`, data)
        .then((list) => {
            dispatch({
                type: constants.API_UPDATE_LIST,
                payload: list.data
            });
        });
};

export const updateListsOnDrop = ({ source, target }) => (dispatch) => {
    let updateSource = axios.put(`${ROOT_URL}/api/list`, { _id: source._id, position: target.position });
    let updateTarget = axios.put(`${ROOT_URL}/api/list`, { _id: target._id, position: source.position });

    Promise.all([updateSource, updateTarget])
        .then((response) => {
            dispatch({
                type: constants.UPDATE_LISTS_ON_DROP,
                payload: { updatedSource: response[0].data, updatedTarget: response[1].data }
            });
        });
};

export const addCardToList = (card) => (dispatch) => {
    axios.post(`${ROOT_URL}/api/card`, card)
        .then((response) => {
            dispatch({
                type: constants.API_ADD_CARD_TO_LIST,
                payload: response.data
            });
        });
};

export const fetchCard = (id) => (dispatch) => {
    axios.get(`${ROOT_URL}/api/card/${id}`)
        .then((response) => {
            dispatch({
                type: constants.API_FETCH_CARD,
                payload: response.data
            });
        });
};

export const updateCard = (card) => (dispatch) => {
    axios.put(`${ROOT_URL}/api/card`, card)
        .then((response) => {
            dispatch({
                type: constants.API_UPDATE_CARD,
                payload: response.data
            });
        });
};

export const deleteCard = (list, _id) => (dispatch) => {
    axios.delete(`${ROOT_URL}/api/card/${list}/${_id}`)
        .then((updatedList) => {
            dispatch({
                type: constants.API_UPDATE_LIST,
                payload: updatedList.data
            });
        });
};

export const updateListsOnCardDrop = ({ source, target }) => (dispatch) => {
    // data contains source and target properties.
    function moveCardListToList(card, toList, position) {
        // Remove card from source list.
        axios.put(`${ROOT_URL}/api/pull/card`, card)
            .then(() => {
                card.list = toList;
                card.position = position;

                // Update card list reference and position.
                axios.put(`${ROOT_URL}/api/card`, card)
                    .then((updatedCard) => {
                        // Post it to target list.
                        axios.put(`${ROOT_URL}/api/push/card`, updatedCard.data)
                            .then((updatedList) => {
                                dispatch({
                                    type: constants.UPDATE_LISTS_ON_CARD_DROP,
                                    payload: { updatedList: updatedList.data }
                                });
                            })
                    })
            });
    }

    // Target is list, not card.
    if (!target.list) {
        // Remove card from source list.
        source.recalculatePositions = true;
        axios.put(`${ROOT_URL}/api/pull/card`, source)
            .then((updatedList) => {
                dispatch({
                    type: constants.UPDATE_LISTS_ON_CARD_DROP,
                    payload: { updatedList: updatedList.data }
                });

                // Update card list reference to target list.
                source.list = target._id;
                // Set source card position to be the last at the target list.
                source.position = Object.keys(target.cards).length + 1;

                axios.put(`${ROOT_URL}/api/card`, source)
                    .then((updatedCard) => {
                        // Add it to target list.
                        axios.put(`${ROOT_URL}/api/push/card`, updatedCard.data)
                            .then((updatedList) => {
                                dispatch({
                                    type: constants.UPDATE_LISTS_ON_CARD_DROP,
                                    payload: { updatedList: updatedList.data }
                                });
                            })
                    })
            })

    // Source and target cards are in the same list.
    } else if(source.list === target.list) {
        let updateSource = axios.put(`${ROOT_URL}/api/card`, { _id: source._id, position: target.position });
        let updateTarget = axios.put(`${ROOT_URL}/api/card`, { _id: target._id, position: source.position });

        Promise.all([updateSource, updateTarget])
            .then((response) => {
                dispatch({
                    type: constants.UPDATE_LISTS_ON_CARD_DROP,
                    payload: { updatedSource: response[0].data, updatedTarget: response[1].data }
                });
            });

    // If source and target cards are in the different lists.
    } else {
        moveCardListToList(source, target.list, target.position);
        moveCardListToList(target, source.list, source.position);
    }
};

