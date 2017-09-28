import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

// Custom reducers.
import cardListsReducer from './reducer-card-lists';

const rootReducer = combineReducers({
    form: formReducer,
    cardLists: cardListsReducer
});

export default rootReducer;
