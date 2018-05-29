import * as Sequelize from "sequelize";
import {CustomerInstance, customerFactory} from "./models/customer";
import {fromPromise} from "rxjs/observable/fromPromise";

(function main() {
    console.log('start');

    const sequelize = new Sequelize('test', 'postgres', 'rjk,fcf123', {
        host: 'localhost',
        dialect: 'postgres',
        operatorsAliases: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });

    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });

    const db = {
        sequelize,
        Sequelize,
        customer: customerFactory(sequelize),
    };

    Object.keys(db).map(key => db[key]).forEach((model: any) => {
        if (model.associate) {
            model.associate(db);
        }
    });

    // db.sequelize.sync();
    // db.customer.create(
    //     {
    //         id: 2,
    //         name: '',
    //         birthday: new Date(),
    //         createdAt: new Date(),
    //         updatedAt: new Date()
    //     });

    // fromPromise(db.customer.findAll())
    //     .subscribe((persons) => {
    //         console.log(persons.map(x => x["fullName"]));
    //         console.log(persons.map(x => x.fullName));
    //     });

    // fromPromise(db.customer.findById(22))
    //     .subscribe((customer) => {
    //         console.log(customer);
    //     });

    fromPromise(db.customer.findAndCountAll({
        where: {
            name: {
                [Sequelize.Op.like]: 'qw%'
            }
        },
        include: [],
        offset: 0,
        limit: 10,
        order: 'name DESC',
        raw: false
    }))
        .subscribe((customer) => {
            console.log(customer);
        });

})();
