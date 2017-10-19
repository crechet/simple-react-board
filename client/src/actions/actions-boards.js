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
                payload: list
            });
        });
};

export const apiDeleteList = (listId) => (dispatch) => {
    axios.delete(`${ROOT_URL}/api/list/${listId}`)
        .then((response) => {
            dispatch({
                type: constants.API_DELETE_LIST,
                payload: response
            });
        });
};

export const apiUpdateList = (data) => (dispatch) => {
    axios.put(`${ROOT_URL}/api/list`, data)
        .then((list) => {
            dispatch({
                type: constants.API_UPDATE_LIST,
                payload: list
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
    debugger;
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

// TODO: add delete card action...

export const updateListsOnCardDrop = ({ source, target }) => (dispatch) => {
    // data contains source and target properties.
    console.log('ACTION updateListsOnCardDrop', { source, target });
    let updateSource, updateTarget;

    if (!target.list) {
        // Target is list, not card.
        // Remove card from source list.
        axios.put(`${ROOT_URL}/api/pull/card`, source)
            .then(() => {
                axios.get(`${ROOT_URL}/api/list/${source.list}`)
                    .then((list) => {
                        // Update source list.
                        dispatch({
                            type: constants.UPDATE_LISTS_ON_CARD_DROP,
                            payload: { updatedList: list.data }
                        });
                    })
                    .then(() => {
                        // Update card list reference.
                        source.list = target._id;
                        axios.put(`${ROOT_URL}/api/card`, source)
                            .then((card) => {
                                // Add it to target list.
                                axios.put(`${ROOT_URL}/api/push/card`, card.data)
                                    .then(() => {
                                        axios.get(`${ROOT_URL}/api/list/${card.data.list}`)
                                            .then((list) => {
                                                // Update target list.
                                                dispatch({
                                                    type: constants.UPDATE_LISTS_ON_CARD_DROP,
                                                    payload: { updatedList: list.data }
                                                });
                                            })
                                    })
                            })
                    })
            })


    } else if(source.list === target.list) {
        // Source and target cards are in the same list.
        updateSource = axios.put(`${ROOT_URL}/api/card`, { _id: source._id, position: target.position });
        updateTarget = axios.put(`${ROOT_URL}/api/card`, { _id: target._id, position: source.position });

        Promise.all([updateSource, updateTarget])
            .then((response) => {
                dispatch({
                    type: constants.UPDATE_LISTS_ON_CARD_DROP,
                    payload: { updatedSource: response[0].data, updatedTarget: response[1].data }
                });
            });
    } else {
        // If source and target cards are in the different lists.
        let tempSourceList = source.list;
        let tempTargetList = target.list;

        // Remove card from source list.
        axios.put(`${ROOT_URL}/api/pull/card`, source)
            .then(() => {
                // Update source card list reference.
                source.list = tempTargetList;
                axios.put(`${ROOT_URL}/api/card`, source)
                    .then((card) => {
                         // Post it to target list.
                         axios.put(`${ROOT_URL}/api/push/card`, card.data)
                            .then(() => {
                                axios.get(`${ROOT_URL}/api/list/${card.data.list}`)
                                    .then((list) => {
                                        dispatch({
                                            type: constants.UPDATE_LISTS_ON_CARD_DROP,
                                            payload: { updatedList: list.data }
                                        });
                                    })

                            })
                    })
            });

        // Delete card from target list.
        axios.put(`${ROOT_URL}/api/pull/card`, target)
            .then(() => {
                // Update target card list reference.
                target.list = tempSourceList;
                axios.put(`${ROOT_URL}/api/card`, target)
                    .then((card) => {
                        // Post it to source list.
                        axios.put(`${ROOT_URL}/api/push/card`, card.data)
                            .then(() => {
                                axios.get(`${ROOT_URL}/api/list/${card.data.list}`)
                                    .then((list) => {
                                        dispatch({
                                            type: constants.UPDATE_LISTS_ON_CARD_DROP,
                                            payload: { updatedList: list.data }
                                        });
                                    })
                            })
                    })
            });
    }
};

