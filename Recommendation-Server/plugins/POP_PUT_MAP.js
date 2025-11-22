module.exports = {
    "Article": {
        "revisable": ["title", "cover", "body", "like_num"],
        "authField": "author"
    },
    "Movie": {
        "revisable": ["title", "cover", "body", "like_num","director","score"],
        "authField": "_id"
    },
    "User": {
        "revisable": ["avator", "password", "email", "nikname", "signature","collectList","articleCount"],
        "authField": "_id"
    },
    "Comment": {
        "revisable": ["content"],
        "authField": "uid"
    },
    "Column": {
        "revisable": ["aids"],
        "authField": "name"
    },

}