import Snowboard from './main/Snowboard';
import ProxyHandler from './main/ProxyHandler';

const instance = new Proxy(
    new Snowboard(),
    ProxyHandler,
);

export default instance;
