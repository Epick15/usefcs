import React from 'react';

/**
 const SignUp1 = React.lazy(() => import('./Demo/Authentication/SignUp/SignUp1'));
 const SignUp2 = React.lazy(() => import('./Demo/Authentication/SignUp/SignUp2'));
 const Signin1 = React.lazy(() => import('./Demo/Authentication/SignIn/SignIn1'));
 const Signin2 = React.lazy(() => import('./Demo/Authentication/SignIn/SignIn2'));
 const ResetPassword1 = React.lazy(() => import('./Demo/Authentication/ResetPassword/ResetPassword1'));
 const ResetPassword2 = React.lazy(() => import('./Demo/Authentication/ResetPassword/ResetPassword2'));
 const ChangePassword = React.lazy(() => import('./Demo/Authentication/ChangePassword'));
 const ProfileSettings = React.lazy(() => import('./Demo/Authentication/ProfileSettings'));
 const TabsAuth = React.lazy(() => import('./Demo/Authentication/TabsAuth'));
 const Error = React.lazy(() => import('./Demo/Maintenance/Error'));
 const OfflineUI = React.lazy(() => import('./Demo/Maintenance/OfflineUI'));
 const ComingSoon = React.lazy(() => import('./Demo/Maintenance/ComingSoon'));
 **/
const Login = React.lazy(() => import('./FCS/Login'));

const route = [
    {path: '/login', exact: true, name: 'Login', component: Login},

];

export default route;