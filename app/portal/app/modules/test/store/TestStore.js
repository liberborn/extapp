/*global Ext*/
Ext.define('Demo.modules.test.store.TestStore', {
    extend : 'Ext.data.TreeStore',
    model  : 'Demo.modules.test.model.TestModel',

    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
});