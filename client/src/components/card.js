import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { DragSource, DropTarget } from 'react-dnd';
import dndTypes from '../constants/dnd-types';

/**
 * Specifies the Card Drag Source.
 * Describe how Drag Source reacts on DnD event.
 * */
const cardSource = {
    beginDrag(props) {
        const card = props.card;
        const item = { id: card._id, position: card.position, listId: card.list };
        return item;
    }
};

/**
 * Specifies the Card Drop Target.
 * Describes how Drop Target reacts on DnD events.
 * */
const cardTarget = {
    drop(targetProps, monitor) {
        const source = monitor.getItem();
        const target = targetProps.card;

        // If Card was dropped on new target.
        if (source.id !== target.id) {
            targetProps.onDrop({ source, target });
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

// Wrap Card component with DragSource decorator.
@DragSource(dndTypes.DND_TYPE_CARD, cardSource, collectSource)
// Wrap Card component with DropTarget decorator.
@DropTarget(dndTypes.DND_TYPE_CARD, cardTarget, collectTarget)

class Card extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { _id, list } = this.props.card;
        const { connectDragSource, connectDropTarget, isDragging, highlighted } = this.props;

        const className = `card${highlighted && !isDragging ? " " + "card_highlighted-as-drop-target" : ""}`;

        return connectDragSource(connectDropTarget(
            <div className={className}>
                <Link className="card-link" to={`/card/${list}/${_id}`}>
                    <div className="card__title">{this.props.card.name}</div>
                </Link>
             </div>
        ));
    }
}

function mapStateToProps({ cardLists }, ownProps) {
    const { card } = ownProps;
    return { card: cardLists[card.list].cards[card._id] }
}

export default connect(mapStateToProps)(Card);
