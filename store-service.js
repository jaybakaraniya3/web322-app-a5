const Sequelize = require('sequelize');

var sequelize = new Sequelize('postgresql://senecaDB_owner:pS4EbvFCiL2N@ep-aged-tree-a5g6b8ab.us-east-2.aws.neon.tech/senecaDB', {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

const Category = sequelize.define('Category', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category: Sequelize.STRING
});

const Item = sequelize.define('Item', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN,
    price: Sequelize.DOUBLE,
    category: Sequelize.INTEGER
});

Item.belongsTo(Category, {foreignKey: 'category'});

module.exports = {
    initialize: function() {
        return new Promise((resolve, reject) => {
            sequelize.sync()
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    getCategories: function() {
        return new Promise((resolve, reject) => {
            Category.findAll()
                .then((data) => {
                    const categories = data.map(category => category.get({ plain: true }));
                    resolve(categories);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    addCategory: function(categoryData) {
        return new Promise((resolve, reject) => {
            Category.create(categoryData)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    deleteCategoryById: function(id) {
        return new Promise((resolve, reject) => {
            Category.destroy({
                where: {
                    id: id
                }
            })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
        });
    },

    addItem: function(itemData) {
        return new Promise((resolve, reject) => {
            itemData.published = itemData.published ? true : false;
            itemData.postDate = new Date();
            
            Item.create(itemData)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    getAllItems: function() {
        return Item.findAll({
            include: [{ model: Category }]
        })
        .then(data => data.map(item => item.get({ plain: true })))
        .catch(err => Promise.reject("Error retrieving items"));
    },

    getItemById: function(id) {
        return new Promise((resolve, reject) => {
            Item.findOne({
                where: {
                    id: id
                },
                include: [{ model: Category }]
            })
            .then((data) => {
                if (data) {
                    resolve(data.get({ plain: true }));
                } else {
                    reject("No results found");
                }
            })
            .catch((err) => {
                reject(err);
            });
        });
    },

    deleteItemById: function(id) {
        return new Promise((resolve, reject) => {
            Item.destroy({
                where: {
                    id: id
                }
            })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
        });
    },

    getPublishedItems: function() {
        return new Promise((resolve, reject) => {
            Item.findAll({
                where: {
                    published: true
                },
                include: [{ model: Category }]
            })
            .then((data) => {
                const items = data.map(item => item.get({ plain: true }));
                resolve(items);
            })
            .catch((err) => {
                reject(err);
            });
        });
    }
};
