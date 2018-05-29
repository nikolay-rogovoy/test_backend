/***/
import * as Sequelize from "sequelize";

interface CustomerAttributes {

    /***/
    id: number;

    /***/
    name: string;

    /***/
    birthday: Date;

    // Timestamps
    createdAt: Date,
    updatedAt: Date,

    fullName: string;
}

export type CustomerInstance = Sequelize.Instance<CustomerAttributes> & CustomerAttributes;

export function customerFactory(sequalize: Sequelize.Sequelize) {
    const attributes: SequelizeAttributes<CustomerAttributes> = {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: Sequelize.STRING, allowNull: true},
        birthday: {type: Sequelize.DATE, allowNull: true},
        createdAt: {type: Sequelize.DATE},
        updatedAt: {type: Sequelize.DATE},
        fullName: {
            type: Sequelize.VIRTUAL,
            get() {
                return this.name + '[' + this.name + ']';
            },
            set(value) {
                this.name = value;
            }
        }
    };
    return sequalize.define<CustomerInstance, CustomerAttributes>("customer",
        attributes,
        {
            freezeTableName: true,
            getterMethods: {
                fullName() {
                    return this.name + '(' + this.name + ')';
                }
            },
            setterMethods: {
                fullName(value) {
                    this.name = value;
                },
            },
            indexes: [{
                unique: true,
                fields: ['name']
            }]
        }
    );
}
