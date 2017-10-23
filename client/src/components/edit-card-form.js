import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { ReactPageClick } from 'react-page-click';

import { fetchCard, updateCard } from '../actions/actions-boards';

@reduxForm({ form: 'EditCard' })
class EditCard extends Component {
    constructor(props) {
        super(props);

        this.handleFormClose = this.handleFormClose.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.card && !this.props.card || this.props.card && this.props.card._id !== nextProps.card._id) {
            this.handleFormInitialize(nextProps.card);
        }
    }

    componentWillMount() {
        if (!this.props.card) {
            let { id } = this.props.match.params;
            this.props.fetchCard(id);
        } else {
            this.handleFormInitialize(this.props.card);
        }
    }

    onSubmit(values) {
        const data = {
            list: this.props.match.params.list,
            _id: this.props.match.params.id,
            name: values.name,
            description: values.description
        };

        this.props.updateCard(data);
        this.handleFormClose();
    }

    handleFormInitialize(card) {
        const initialData = {
            name: "",
            description: ""
        };

        if (!card) {
            this.props.initialize(initialData);
        } else {
            initialData.name = card.name;
            initialData.description = card.description;
        }

        this.props.initialize(initialData);
    }

    handleFormClose(event) {
        if (event) { event.preventDefault(); }
        this.props.history.push("/");
    }

    renderField(field) {
        let control = <input type="text" className="form-control"
                             placeholder={field.placeholder}
                             maxLength="50"
                             required
                             {...field.input}/>;

        if (field.type === "textarea") {
            control = <textarea className="form-control edit-card__textarea" placeholder={field.placeholder}
                                required
                                maxLength="500"
                                {...field.input}/>;
        }

        return(
            <div className="form-group">
                <label className="card-list-form__label">{field.label}</label>
                {control}
            </div>
        );
    }

    render() {
        const { handleSubmit } = this.props;
        return(
            <div className="dialog-overlay">
                <ReactPageClick notify={this.handleFormClose}>
                <div className="dialog-content">
                    <div className="edit-card-form">
                        <form onSubmit={handleSubmit(this.onSubmit)}>
                            <Field type="text"
                                   name="name"
                                   label="Card Name"
                                   placeholder="Card Name"
                                   component={this.renderField}/>
                            <Field type="textarea"
                                   name="description"
                                   label="Card Description"
                                   placeholder="Card Description"
                                   component={this.renderField}/>

                            <div className="text-right">
                                <button type="submit"
                                        className="card-list-form__btn btn btn-primary">Ok</button>
                                <button className="card-list-form__btn btn btn-default"
                                        onClick={this.handleFormClose}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
                </ReactPageClick>
            </div>
        );
    }
}

function mapStateToProps({ cardLists, currentCard }, ownProps) {
    const { list, id } = ownProps.match.params;
    if (list && id && cardLists[list]) {
        return { card: cardLists[list].cards[id] }
    } else if (currentCard && currentCard._id) {
        return { card: currentCard }
    } else {
        return { card: null }
    }
}

export default connect(mapStateToProps, { fetchCard, updateCard })(EditCard);
