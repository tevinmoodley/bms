// Node Libs
import uuidv4 from 'uuid/v4';
import currencies from '../../../libs/currencies.json';
const appConfig = require('electron').remote.require('electron-settings');
const ipc = require('electron').ipcRenderer;
import i18n from '../../../i18n/i18n';

// Actions & Verbs
import * as ACTION_TYPES from '../../constants/actions.jsx';
import * as UIActions from '../../actions/ui';

// Helpers
import  * as DataManager from '../../helpers/DataManager';

const SuppliersMW = ({ dispatch, getState }) => next => action =>
{
  switch (action.type)
  {
    case ACTION_TYPES.SUPPLIER_GET_ALL:
    {
      // Get all Suppliers
      return DataManager.getAll(dispatch, action, '/suppliers', DataManager.db_suppliers, 'suppliers')
                        .then(docs =>
                          next(Object.assign({}, action, { payload: docs || [] })))
                        .catch(err =>
                          next({ type: ACTION_TYPES.SUPPLIER_GET_ALL, payload: []}));
    }

    case ACTION_TYPES.SUPPLIER_NEW:
    {
      const new_supplier = Object.assign(action.payload, {object_number: getState().suppliers.length});
      // Save to remote store then local store
      return DataManager.putRemoteResource(dispatch, DataManager.db_suppliers, new_supplier, '/supplier', 'suppliers')
                        .then(response =>
                          {
                            const supplier = Object.assign(action.payload, {_id: response}); // w/ _id
                            next({ type: ACTION_TYPES.SUPPLIER_NEW, payload: supplier });
                            if(action.callback)
                              action.callback(supplier);
                          })
                        .catch(err =>
                          next({ type: ACTION_TYPES.SUPPLIER_NEW, payload: []}));
    }

    case ACTION_TYPES.SUPPLIER_UPDATE:
    {
      console.log('supplier update:', action.payload);
      return DataManager.postRemoteResource(dispatch, DataManager.db_suppliers, action.payload, '/supplier', 'suppliers')
                        .then(response =>
                          next({ type: ACTION_TYPES.SUPPLIER_UPDATE, payload: response }))
                        .catch(err =>
                          next({ type: ACTION_TYPES.REQUISITION_GET_ALL, payload: []}));
    }

    case ACTION_TYPES.SUPPLIER_DUPLICATE:
    {
      const duplicateSupplier = Object.assign({}, action.payload,
      {
        created_at: Date.now(),
        _id: uuidv4(),
        _rev: null,
      });
      return dispatch(
      {
        type: ACTION_TYPES.SUPPLIER_SAVE,
        payload: duplicateSupplier,
      });
    }

    default: {
      return next(action);
    }
  }
};

export default SuppliersMW;
