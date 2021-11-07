import React from 'react';
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {Loader} from "../Loader";

const ListChat = ({urlId}) => {

    const loading = useSelector(({chat}) => chat.loading);
    // const history = useSelector(({chat}) => chat.listChat);
    const allChats = useSelector(({chat}) => {
        let result = []
        for(let key in chat.listChat){
            result = result.concat(chat.listChat[key])
        }
        return result
    });

    allChats.sort(function(x, y) {
        return (x.isRead === y.isRead)? 0 : x.isRead ? 1 : -1;
    })
    // const cabinets = Object.keys(history)
    //
    //
    // cabinets.forEach(cabinet => {
    //     history.sort(function(x, y) {
    //         return (x.isRead === y.isRead)? 0 : x.isRead ? 1 : -1;
    //     })
    // })

    // const [activeCabinet, setActiveCabinet] = useState(null)

    // const handlerCabinet = item =>{
    //     setActiveCabinet(item.replace("_", " "))
    // }

     return(
        // <>
        // {urlId
        //     ?
            <>
                <h4>Чаты с пользователями</h4>
                {loading
                    ? <Loader/>
                    : <>{allChats.map((item, index) =>
                        <div key={`cabinet-container_${index}`}
                             className={"container chat-link"
                             + (!item.isRead ? " is-active" : "" )
                             + (item.isSpecial ? " is-special" : "") }
                        >
                            <Link key={`client_${index}`}
                                  className="waves-effect waves-light btn"
                                  to={{pathname:`/chat/` + item["id"]}}>
                                {item.id
                                    .substring(item.id.lastIndexOf('-'))
                                    .replace("-", "")}
                            </Link>
                        </div>)}
                    </>}
            </>
            // :<>
            //     <h4>Доступные кабинеты Озона</h4>
            //     {loading
            //         ? <Loader/>
            //         :
            //         <>{cabinets.map((cabinet, index) =>
            //             <div key={`cabinet-container_${index}`}
            //                  className={"container chat-link " + (history[cabinet].find(chat => !chat.isRead ) ? "is-active" : "" )}>
            //                 <Link key={`cabinet_${index}`}
            //                       to={{pathname: `/chat_list/` + cabinet}}
            //                       onClick={() => handlerCabinet(cabinet)}
            //                       className="waves-effect waves-light btn">
            //                     {cabinet.replace("_", " ")}
            //                 </Link>
            //             </div>
            //         )}</>
            //     }
            // </>
        // }</>
    )




};

export default ListChat;