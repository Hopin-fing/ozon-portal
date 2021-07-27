import React from "react"
import {Route, Switch, Redirect} from "react-router-dom";
import Home from "./pages/Home";
import List from "./pages/List";
import Product from "./pages/Product";
import {AuthPage} from "./pages/AuthPage";



export const useRoutes = isAuthenticated => {
    if(isAuthenticated) return (
        <Switch>
            <Route path="/home" exact>
                <Home/>
            </Route>
            <Route path="/list/:name">
                <List/>
            </Route>
            <Route path="/product/:name">
                <Product/>
            </Route>
            <Redirect to="/home"/>
        </Switch>
    )
    return (
        <Switch>
             <Route path="/" exact>
                 <AuthPage/>
             </Route>
            <Redirect to="/"/>
        </Switch>
    )
}