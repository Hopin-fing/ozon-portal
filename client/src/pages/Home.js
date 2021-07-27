import React from 'react';
import CommandPanel from "../components/CommandPanel";
import Tabs from "../components/Tabs";
import {useSelector} from "react-redux";

const Home = () => {
    const loading = useSelector(({products}) => products.loading);
    const productTree = useSelector(({products}) => products.productTree);

    return (
        <div>
            <div className="row">
                <CommandPanel/>
            </div>
            {loading
                ? <div className="row">
                    <div className="col s12 text-center">
                        <p className="center-align">
                            Загрузка...
                        </p>

                    </div>
                </div>
                : <Tabs productTree={productTree}/>}
        </div>
    );
};

export default Home;