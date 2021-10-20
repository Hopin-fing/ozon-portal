import React from 'react';
import CommandPanel from "../components/CommandPanel";
import Tabs from "../components/Tabs";
import {useSelector} from "react-redux";
import {Loader} from "../components/Loader";

const Home = () => {
    const loading = useSelector(({products}) => products.loading);
    const productTree = useSelector(({products}) => products.productTree);

    return (
        <div>
            <div className="row">
                <CommandPanel/>
                {/*<ChatPanel/>*/}
            </div>
            {loading
                ? <div className="row">
                    <div className="col s12 text-center">
                        <Loader/>
                        <p className="center-align">
                            Загрузка может длиться 3 - 5 минут
                        </p>

                    </div>
                </div>
                : <Tabs productTree={productTree}/>}
        </div>
    );
};

export default Home;