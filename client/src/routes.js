import React from "react"
import {Route, Switch, Redirect} from "react-router-dom";
import Home from "./pages/Home";
import List from "./pages/List";
import Product from "./pages/Product";
import {AuthPage} from "./pages/AuthPage";
import Chat from "./pages/Chat";
import StockPage from "./pages/StockPage";

export const useRoutes = isAuthenticated => {
    if(isAuthenticated) return (
        <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/list/:name" component={List}/>
            <Route path="/product/:name" component={Product}/>
            <Route path="/chat_list" component={Chat}/>
            <Route path="/chat/:nameChat" component={Chat}/>
            <Route path="/stock_stop" component={StockPage}/>

            <Redirect to="/" component={Home}/>
        </Switch>
    )
    return (
        <Switch>
             <Route path="/auth" exact>
                 <AuthPage/>
             </Route>
            <Redirect to="/auth"/>
        </Switch>
    )
}