import React, {Component, Suspense} from 'react';
import {Switch, Redirect, Route} from 'react-router-dom';
import Loadable from 'react-loadable';
import '../../node_modules/font-awesome/scss/font-awesome.scss';

import moment from "moment";

import Loader from './layout/Loader'
import Aux from "../hoc/_Aux";
import ScrollToTop from './layout/ScrollToTop';
import routes from '../route';

import crypt from "node-cryptex";

const k = new Buffer(32);
const v = new Buffer(16);
const AdminLayout = Loadable({
    loader: () => import('./layout/AdminLayout'), loading: Loader
});

const Login = Loadable({
    loader: () => import('../FCS/Login'), loading: Loader
});


const hourExpire = localStorage.getItem('_rki') ? crypt.decrypt(localStorage.getItem('_rki'), k, v) : '';
const user = localStorage.getItem('USER_ID') || '';

class App extends Component {


    render() {

        const menu = routes.map((route, index) => {
            return (route.component) ? (<Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={props => (<route.component {...props} />)}/>) : (null);
        });

        return (

            <Aux>
                <ScrollToTop>
                    <Suspense fallback={<Loader/>}>
                        <Switch>

                            {// this.state.loggedIn && this.state.role
                                // this.state.loggedIn
                                user !== "" && hourExpire !== '' && hourExpire >= moment().format() ? <>
                                    {menu}
                                    {/*<Route path="/"   component={() => <AdminLayout info={info}/>}/>*/}
                                    {/*<Route path="/"*/}
                                    {/*       render={(props) => <AdminLayout {...props} role={this.state.role}/>*/}
                                    <Route path="/" component={AdminLayout}/>
                                </> : <>
                                    <Route path="/login" exact component={Login}/>
                                    <Redirect to="/login"/>
                                </>}

                        </Switch>
                    </Suspense>
                </ScrollToTop>
            </Aux>);


        // }


    }
}

export default App;
