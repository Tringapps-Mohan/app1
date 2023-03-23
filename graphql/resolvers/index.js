const postsResolver = require("./posts");

module.exports = {
    Query:{
        ...postsResolver.Query
    }
};
