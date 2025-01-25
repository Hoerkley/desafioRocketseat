export function extracQueryParams(query){
    return query.substr(1).split('&').reduce((queryParms, param) => {
        const[key, value] = param.split('=');
        queryParms[key] = value;
        return queryParms;
    }, {});
}