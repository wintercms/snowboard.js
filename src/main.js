import Snowboard from './main/Snowboard';
import ProxyHandler from './main/ProxyHandler';

((window) => {
    const snowboard = new Proxy(
        new Snowboard(),
        ProxyHandler,
    );

    window.Snowboard = snowboard;
})(window);
