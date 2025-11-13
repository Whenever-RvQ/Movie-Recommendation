module.exports = {
    "Article": {
        "revisable": ["title", "cover", "body", "like_num"],
        "authField": "author"
    },
    "Movie": {
        "revisable": ["title", "cover", "body", "like_num","director"],
        "authField": "_id"
    },
    "User": {
        "revisable": ["avator", "password", "email", "nikname", "signature"],
        "authField": "_id"
    },
    "Comment": {
        "revisable": ["content"],
        "authField": "uid"
    },
    "Column": {
        "revisable": ["aids"],
        "authField": "name"
    }
}