if(process.env.NODE_ENV === 'production'){
    module.exports = require('./prod');
} else {
    module.exports = {
        mongoURI: {
            remote: "", // enter development URI
            local: ""
        },
        cookieKey: "nsunclksau4fhqow387rhiouncfqo2u43bfoqwuf"
    };
}