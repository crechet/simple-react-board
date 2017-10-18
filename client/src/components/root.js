import React, { Component } from 'react';
import { Route } from 'react-router-dom';

// Components.
import Header from './header';
import Board from '../containers/board';
import EditCard from './edit-card-form';

class Root extends Component {
    renderHeader() {
        return(
            <Header />
        );
    }

    renderMainContainer() {
        return(
            <div className="main-container">
                <div className="view-container">
                    <Board />
                    <Route path="/card/:list/:id"
                           component={EditCard} />
                </div>
            </div>
        );
    }

    render() {
        return(
            <div className="application-container">
                {this.renderHeader()}
                {this.renderMainContainer()}
            </div>
        );
    }
}

export default Root;
