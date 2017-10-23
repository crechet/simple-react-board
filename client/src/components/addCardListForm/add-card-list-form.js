import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { ReactPageClick } from 'react-page-click';

import { apiAddList } from '../../actions/actions-boards';
import { apiUpdateList } from '../../actions/actions-boards';

@reduxForm({ form: 'AddCardListForm' })
class AddCardListForm extends Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
    }

    componentDidMount() {
        const { cardList } = this.props;
        if (cardList) { this.props.initialize(cardList); }
    }

    handleCancelClick(event) {
        event.preventDefault();
        this.props.onCanсelClicked();
    }

    renderField(field) {
        return(
            <div className="form-group">
                <label className="card-list-form__label">List name</label>
                <input type="text"
                       className="form-control"
                       placeholder="List name"
                       maxLength="100"
                       required
                       {...field.input}/>
            </div>
        );
    }

    onSubmit(values) {
        if (this.props.cardList) {
            this.props.apiUpdateList(values);
        } else {
            this.props.apiAddList(values);
        }
        this.props.onCanсelClicked();
    }

    render() {
        const { handleSubmit, className } = this.props;
        let cardClass = `card-list-form${className ? " " + className : ""}`

        return(
            <ReactPageClick notify={this.handleCancelClick}>
                <div className={`${cardClass}`}>
                    <form onSubmit={handleSubmit(this.onSubmit)}>
                        <Field name="name" component={this.renderField}/>
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

export default connect(null, { apiAddList, apiUpdateList })(AddCardListForm);
