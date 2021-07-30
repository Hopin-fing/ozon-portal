import {useCallback, useState} from "react";

export const useHttp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)


    const request = useCallback(
        async (
            url,
            method = 'GET',
            body= null,
            headers = {}) => {
        setLoading(true)

        try {
            if(body) {
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }


           // const response = await fetch( url, {method, mode: 'no-cors', body, headers})
           const response = await fetch( url, {
                   method: method, // *GET, POST, PUT, DELETE, etc.
                   mode: 'no-cors', // no-cors, *cors, same-origin
                   cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                   credentials: 'same-origin', // include, *same-origin, omit
                   headers: {
                       'Content-Type': 'application/json'
                   },
                   referrerPolicy: 'no-referrer', // no-referrer, *client
               })
           const data = await response.json()

            if(!response.ok) {
                throw new Error(data.message || 'Ошибка')
            }
            setLoading(false)


            return data
        } catch (e) {
            setLoading(false)
            setError(e.message)
            throw e
        }
    }, [])

    const clearError = useCallback(() => setError(null), [])

    return {loading, request, error, clearError}
}