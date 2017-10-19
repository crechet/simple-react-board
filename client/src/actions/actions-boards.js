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
    axios.get(`${ROOT_URL}/api/card/${id}`)
        .then((response) => {
            dispatch({
                type: constants.API_FETCH_CARD,
                payload: res.data
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

    if (!target.list) {
        // Target is list, not card.
        // TODO handle case when target is list... Now it's only accept another card as target.
    } else {
        // Target is card.
        let updateSource = axios.put(`${ROOT_URL}/api/card`, { _id: source._id, position: target.position });
        let updateTarget = axios.put(`${ROOT_URL}/api/card`, { _id: target._id, position: source.position });

        Promise.all([updateSource, updateTarget])
            .then((response) => {
                dispatch({
                    type: constants.UPDATE_LISTS_ON_CARD_DROP,
                    payload: { updatedSource: response[0].data, updatedTarget: response[1].data }
                });
            });
    }
};

// OLD...
/*export function updateListsOnCardDrop(data) {
    return {
        type: constants.UPDATE_LISTS_ON_CARD_DROP,
        payload: data
    }
}*/
