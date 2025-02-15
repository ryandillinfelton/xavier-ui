import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import promiseMiddleware from 'redux-promise-middleware';
import { notifications, notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import { reportsReducer } from '../reducers/ReportsReducer';
import { uploadsReducer } from '../reducers/UploadsReducer';
import { userReducer } from '../reducers/UserReducer';
import { dialogDeleteReducer } from '../reducers/DialogDeleteReducer';

let registry;

export function init(...middleware) {
    if (registry) {
        throw new Error('store already initialized');
    }

    registry = new ReducerRegistry({}, [
        promiseMiddleware(),
        notificationsMiddleware({ autoDismiss: true }),
        ...middleware
    ]);

    //If you want to register all of your reducers, this is good place.
    registry.register({
        notifications,
        reportState: reportsReducer,
        uploadState: uploadsReducer,
        userState: userReducer,
        dialogDeleteState: dialogDeleteReducer
    });

    return registry;
}

export function getStore() {
    return registry.getStore();
}

export function register(...args) {
    return registry.register(...args);
}
