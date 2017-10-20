import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

// Custom reducers.
import cardListsReducer from './reducer-card-lists';
import currentCardReducer from './current-card-reducer';

const rootReducer = combineReducers({
    form: formReducer,
    cardLists: cardListsReducer,
    currentCard: currentCardReducer
});

export default rootReducer;
