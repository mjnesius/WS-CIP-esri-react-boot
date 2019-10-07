import { call, put, takeLatest } from 'redux-saga/effects';
import { setFilter } from '../../services/api'; //getFeatures,
import { types as mapActions } from '../reducers/map';

// Worker Saga: gets fired with SET_FEATURES // note: uses generator functions (special iterator functions, execute until they reach 'yield'
// function* fetchFeatures (action) {
//     try {
//         console.log("-map.js fetchFeatures(): "+ JSON.stringify(action))
//         // call API to fetch config
//         const features = yield call(getFeatures);

//         // Put config in store
//         yield put({
//             type: mapActions.SET_FEATURES,
//             payload: features
//         });

//     } catch (e) {
//         console.log('SAGA ERROR: map/fetchFeatures, ', e);
//     }
// }

function* setFilters (action) {
    try {
        // call API apply filter
        const features = yield call(setFilter);

        // Put filtered features in store
        yield put({
            type: mapActions.SET_FEATURES,
            payload: features
        });

    } catch (e) {
        console.log('SAGA ERROR: map/setFilters, ', e);
    }
}

// WATCHER: gets tied into Redux via createStore() using applyMiddleware() //
export function* watchFetchFeatures() {
    //yield takeLatest(mapActions.SET_FEATURES, fetchFeatures);
    yield takeLatest(mapActions.APPLY_FILTER, setFilters);
}
