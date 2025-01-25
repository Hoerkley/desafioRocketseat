export function buildRoutePath(path) {
    const routeParamentersRexes = /:([a-zA-Z]+)/g;
    const routewithParms = path.replaceAll(routeParamentersRexes, '(?<$1>[a-z0-9\-_]+)');
    const pathRegex = new RegExp(`^${routewithParms}(?<query>\\?(.*))?$`);
    return pathRegex;
}