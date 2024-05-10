import Logger from './logger'

export default async ({ expressApp }) => {
    const postgresInstance = await postgresLoader();
    Logger.info('✌️ DB loaded and connected!');
    Logger.info('Server running in ' + isDev + ' mode.');


    await postgresInstance.sync();


    dependencyInjectorLoader({
        postgresConnection: postgresInstance,
        models: [

        ],
    });

    Logger.info('✌️ Dependency Injector loaded');

    expressLoader({ app: expressApp });
    Logger.info('✌️ Express loaded');

    webpush.setVapidDetails(
        'mailto:contact@koena.app',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );

    Logger.info('✌️ EWeb Push loaded');
};
;