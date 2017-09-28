import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { ReactPageClick } from 'react-page-click';

import { addCard } from '../actions/actions-boards';

@reduxForm({ form: 'AddCardForm' })
class AddCardForm extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
    }

    renderField(field) {
        return(
            <div className="form-group">
                <label className="card-list-form__label">Card name</label>
                <input type="text"
                       className="form-control"
                       placeholder="Card name"
                       required
                       {...field.input}/>
            </div>
        );
    }

    onSubmit(values) {
        const card = {
            name: values.cardName,
            cardListId: this.props.cardListId
        };
        this.props.addCard(card);
        this.props.onCancelClicked();
    }

    handleCancelClick(event) {
        event.preventDefault();
        this.props.onCancelClicked();
    }

    render() {
        const { handleSubmit } = this.props;

        return(
            <ReactPageClick notify={this.handleCancelClick}>
                <div className="add-card-form">
                    <form onSubmit={handleSubmit(this.onSubmit)}>
                        <Field name="cardName" component={this.renderField}/>
                        <div className="text-right">
                            <button type="submit"
                                    className="card-list-form__btn btn btn-primary">Ok</button>
                            <button className="card-list-form__btn btn btn-default"
                                    onClick={this.handleCancelClick}>Cancel</button>
                        </div>
                    </form>
                </div>
            </ReactPageClick>
        );
    }
}

export default connect(null, { addCard })(AddCardForm);

AddCardForm.propTypes = {};
