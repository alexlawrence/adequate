!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("preact")):"function"==typeof define&&define.amd?define(["exports","preact"],t):t(n.preactHooks={},n.preact)}(this,function(n,t){var u,i,r,o=[],f=t.options.__r,e=t.options.diffed,c=t.options.__c,a=t.options.unmount;function v(n){t.options.__h&&t.options.__h(i);var u=i.__H||(i.__H={t:[],u:[]});return n>=u.t.length&&u.t.push({}),u.t[n]}function p(n){return d(q,n)}function d(n,t,r){var o=v(u++);return o.__c||(o.__c=i,o.i=[r?r(t):q(void 0,t),function(t){var u=n(o.i[0],t);o.i[0]!==u&&(o.i[0]=u,o.__c.setState({}))}]),o.i}function s(n,t){var r=v(u++);T(r.o,t)&&(r.i=n,r.o=t,i.__h.push(r))}function l(n,t){var i=v(u++);return T(i.o,t)?(i.o=t,i.v=n,i.i=n()):i.i}function m(){o.some(function(n){n.__P&&(n.__H.u.forEach(y),n.__H.u.forEach(x),n.__H.u=[])}),o=[]}function y(n){n.p&&n.p()}function x(n){var t=n.i();"function"==typeof t&&(n.p=t)}function T(n,t){return!n||t.some(function(t,u){return t!==n[u]})}function q(n,t){return"function"==typeof t?t(n):t}t.options.__r=function(n){f&&f(n),u=0,(i=n.__c).__H&&(i.__H.u.forEach(y),i.__H.u.forEach(x),i.__H.u=[])},t.options.diffed=function(n){e&&e(n);var u=n.__c;if(u){var i=u.__H;i&&i.u.length&&(1!==o.push(u)&&r===t.options.requestAnimationFrame||((r=t.options.requestAnimationFrame)||function(n){var t,u=function(){clearTimeout(i),cancelAnimationFrame(t),setTimeout(n)},i=setTimeout(u,100);"undefined"!=typeof window&&(t=requestAnimationFrame(u))})(m))}},t.options.__c=function(n,t){t.some(function(n){n.__h.forEach(y),n.__h=n.__h.filter(function(n){return!n.i||x(n)})}),c&&c(n,t)},t.options.unmount=function(n){a&&a(n);var t=n.__c;if(t){var u=t.__H;u&&u.t.forEach(function(n){return n.p&&n.p()})}},n.useState=p,n.useReducer=d,n.useEffect=function(n,t){var r=v(u++);T(r.o,t)&&(r.i=n,r.o=t,i.__H.u.push(r))},n.useLayoutEffect=s,n.useRef=function(n){return l(function(){return{current:n}},[])},n.useImperativeHandle=function(n,t,u){s(function(){"function"==typeof n?n(t()):n&&(n.current=t())},null==u?u:u.concat(n))},n.useMemo=l,n.useCallback=function(n,t){return l(function(){return n},t)},n.useContext=function(n){var t=i.context[n.__c];if(!t)return n.__;var r=v(u++);return null==r.i&&(r.i=!0,t.sub(i)),t.props.value},n.useDebugValue=function(n,u){t.options.useDebugValue&&t.options.useDebugValue(u?u(n):n)},n.useErrorBoundary=function(n){var t=v(u++),r=p();return t.i=n,i.componentDidCatch||(i.componentDidCatch=function(n){t.i&&t.i(n),r[1](n)}),[r[0],function(){r[1](void 0)}]}});
//# sourceMappingURL=hooks.umd.js.map