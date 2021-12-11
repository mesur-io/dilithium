const dilithium = require('../util/dilithium.js');

dilithium().then((instance) => {
    console.log('loaded');
    console.log(instance._dilithiumVersion());
});
