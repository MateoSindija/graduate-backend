import config, {isDev} from '@config/config';
import {Sequelize} from 'sequelize-typescript';
import Logger from './logger';
import fs from 'fs';
// eslint-disable-next-line
import {SCHEMA} from '@constants/schema';
import path from 'path';

const connect = async () => {
    try {
        const sequelize = new Sequelize(
            config.postgres.database,
            config.postgres.user,
            config.postgres.password,
            {
                host: config.postgres.host,
                port: config.postgres.port,
                dialect: 'postgres',
                schema: SCHEMA,
                // Only start SSL connections in production
                ...(isDev
                    ? {}
                    : {
                        dialectOptions: {
                            ssl: {
                                rejectUnauthorized: true,
                                ca: fs
                                    .readFileSync(
                                        path.resolve(
                                            __dirname,
                                            '../global-bundle.pem'
                                        ),
                                        'ascii'
                                    )
                                    .toString(),
                            },
                        },
                    }),
                define: {
                    timestamps: true,
                    createdAt: 'CreatedAt',
                    updatedAt: 'UpdatedAt',
                    deletedAt: 'DeletedAt',
                },
                models: [],
            }
        );

        await sequelize.authenticate();

        return sequelize;
    } catch (error) {
        Logger.error(error);
        return null;
    }
};

export default connect;
