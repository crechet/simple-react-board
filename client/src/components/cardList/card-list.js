import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import dndTypes from '../../constants/dnd-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import './card-list.css';

// Actions.
import { apiDeleteList, updateListsOnCardDrop } from '../../actions/actions-boards';

// Components.
import Card from '../card/card';
import AddCardForm from '../cardListForm/add-card-form';
import AddCardListForm from '../addCardListForm/add-card-list-form';

/**
 * Specifies the CardList Drag Source.
 * Describe how Drag Source reacts on DnD event.
 * */
const cardListSource = {
    beginDrag(props, monitor) {
        const cardList = props.cardList;
        const item = { _id: cardList._id, position: cardList.position };
        return item;
    }
};

/**
 * Specifies the CardList Drop Target.
 * Describes how Drop Target reacts on DnD events.
 * */
const cardListTarget = {
    drop(targetProps, monitor) {
        const source = monitor.getItem();
        const target = targetProps.cardList;

        // If CardList was dropped on new target.
        if (source._id !== target._id) {
            targetProps.onDrop({ source, target });
        }
    }
};

/**
 * Specifies the List Drop Target for Cards.
 * Describes how Drop Target reacts on DnD events.
 * */
const cardDropTargetForCardList = {
    drop(targetProps, monitor) {
        const source = monitor.getItem();
        const target = targetProps.cardList;
        const dropAlreadyHandled = monitor.didDrop();
        // If Card was dropped on Card List.
        if (source.list && !target.list && !dropAlreadyHandled) {
            targetProps.onCardDrop({ source, target });
        }
    }
};

/**
 * Specifies which props to inject into your component for Drag Source.
 * @ connect - function that assign specified role: (Drag Source, Drop Target, Drag preview) to the component.
 * @ monitor - watching for current DnD state and injects it's data to component props.
 * */
function collectSource(connect, monitor) {
    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:
        connectDragSource: connect.dragSource(),
        // You can ask the monitor about the current drag state:
        isDragging: monitor.isDragging()
    };
}

/**
 * Specifies which props to inject into your component for drop target.
 * */
function collectTarget(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        highlighted: monitor.canDrop()
    };
}

/**
 * Specifies which props to inject into your component for drop target.
 * */
function collectCardDropTarget(connect, monitor) {
    return {
        connectCardDropTarget: connect.dropTarget()
    };
}

// Wrap CardList component with DragSource decorator.
@DragSource(dndTypes.DND_TYPE_CARD_LIST, cardListSource, collectSource)
@DropTarget(dndTypes.DND_TYPE_CARD_LIST, cardListTarget, collectTarget)
// Wrap CardList component with DropTarget decorator for Cards.
@DropTarget(dndTypes.DND_TYPE_CARD, cardDropTargetForCardList, collectCardDropTarget)

class CardList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAddCardFormShown: false,
            isEditCardListFormShown: false
        };

        this.deleteCardList = this.deleteCardList.bind(this);
        this.toggleShowAddCardForm = this.toggleShowAddCardForm.bind(this);
        this.toggleShowEditCardListForm = this.toggleShowEditCardListForm.bind(this);
        this.handleAddCardFormClose = this.handleAddCardFormClose.bind(this);
        this.handleEditCardListFormClose = this.handleEditCardListFormClose.bind(this);
        this.handleCardDrop = this.handleCardDrop.bind(this);
    }

    deleteCardList() {
        const cardListId = this.props.cardList._id;
        this.props.apiDeleteList(cardListId);
    }

    toggleShowAddCardForm() { this.setState({ isAddCardFormShown: !this.state.isAddCardFormShown }); }
    toggleShowEditCardListForm() { this.setState({ isEditCardListFormShown: !this.state.isEditCardListFormShown }); }

    handleAddCardFormClose() { this.setState({ isAddCardFormShown: false }); }
    handleEditCardListFormClose() { this.setState({ isEditCardListFormShown: false }); }

    handleCardDrop({ source, target }) {
        this.props.updateListsOnCardDrop({ source, target });
    }

    renderCards() {
        const { cards } = this.props.cardList;

        const sortedCards = _.sortBy(cards, (card) => {
            return card.position;
        });

        return _.map(sortedCards, (card) => {
            return <Card key={card._id}
                         card={card}
                         list={card.list}
                         onDrop={this.handleCardDrop} />;
        })
    }

    renderEditCardList() {
        const { isEditCardListFormShown } = this.state;

        if (isEditCardListFormShown) {
            return(
                <AddCardListForm className={"card-list-form_borders_tb card-lists-form_full-width"}
                                 cardList={this.props.cardList}
                                 onCanсelClicked={this.handleEditCardListFormClose} />
            );
        }
    }

    renderAddCard() {
        const { isAddCardFormShown } = this.state;
        const { highlighted, isDragging } = this.props;

        if (!isAddCardFormShown) {
            return (
                <div className={`card-list__footer${highlighted && !isDragging ? " " + "card-list__footer_highlighted" : ""}`}>
                    <div className="card-list__footer-action text-right"
                         onClick={this.toggleShowAddCardForm}>Add Card</div>
                </div>
            );
        }
    }

    renderAddCardForm() {
        const isAddCardFormShown = this.state.isAddCardFormShown;

        if (isAddCardFormShown) {
            return(
                <div className="card-list__footer-form">
                    <AddCardForm onCancelClicked={this.handleAddCardFormClose}
                                 cardListId={this.props.cardList._id}/>
                </div>
            );
        }
    }

    render() {
        // Default component props.
        const cardList = this.props.cardList;

        // Injected by React DnD component props.
        const { connectDragSource, connectDropTarget, connectCardDropTarget, isDragging, highlighted } = this.props;
        const highlightDropTarget = highlighted && !isDragging ? "card-list_highlighted-as-drop-target" : "";
        const cardListClassName = `card-list ${highlightDropTarget}`;

        // Connect CardList as DragStart and Drop Target.
        return connectDragSource(
            connectDropTarget(
            connectCardDropTarget(
            <div className="card-list-container">
                <div className={cardListClassName}>
                    <div className="card-list__header clearfix">
                        <p className="card-list__title">{cardList.name}</p>
                        <span className="tool glyphicon glyphicon-remove-circle"
                              onClick={this.deleteCardList}></span>
                        <span className="tool tool_smaller glyphicon glyphicon-pencil"
                              onClick={this.toggleShowEditCardListForm}
                        ></span>
                    </div>

                    <div className="card-list__cards">
                        {this.renderCards()}
                    </div>
                    <div className={`card-list__drop-flag${highlighted ? " " + "card-list__drop-flag_visible" : ""}`}>
                        {highlighted && !isDragging ? <span className="card-list__drop-flag-icon glyphicon glyphicon-chevron-down"></span> : ""}
                    </div>

                </div>
                {this.renderEditCardList()}
                {this.renderAddCard()}
                {this.renderAddCardForm()}
            </div>
        )));
    }
}

function mapStateToProps(state) {
    return { cardLists: state.cardLists };
}

export default connect(mapStateToProps, { apiDeleteList, updateListsOnCardDrop })(CardList);
