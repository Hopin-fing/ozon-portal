import React, {useEffect, useState} from 'react';
import TabContent from "./TabContent";
import _ from "lodash";

const Tabs = ({productTree} ) => {

    //TODO: Не изменяется минимальные цены у каждой категории при обновлении самих цен

    const [ active, setActive ] = React.useState(0);
    const openTab = e => setActive(+e.target.dataset.index);
    const newProductTree = _.cloneDeep(productTree)
    newProductTree["All_Models"] = {}
    Object.keys(productTree).map(name => {
        newProductTree["All_Models"] = Object.assign(newProductTree["All_Models"], productTree[name])
    })
    const reversKeys = Object.keys(newProductTree).reverse()

    return (
         <> {productTree.length !== 0
         ?<div className="row">
                 <div className="col s12">

                     <div className="tab">
                         {reversKeys.map((name, index) => (
                             <button
                                 className={`tablinks ${index   === active ? 'active' : ''}`}
                                 onClick={openTab}
                                 key={`button-tab-${index }`}
                                 data-index={index }
                             >{name.replace("_", " ")}</button>
                         ))}
                     </div>
                     {newProductTree[reversKeys[active]]
                     && <TabContent title = {reversKeys[active]}
                                 cabinetInfo = {newProductTree[reversKeys[active]]}
                     />}

                     {/*<Pagination totalRecords={products.result.items.length} />*/}
                 </div>


             </div>
         : null}

         </>
    );
};

export default Tabs;