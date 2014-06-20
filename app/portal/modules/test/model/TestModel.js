/*global Ext*/
/*jshint strict: false*/

Ext.define('Demo.modules.test.model.TestModel', {
    extend : 'Ext.data.Model',
    fields : [],

    uses : [
        'Demo.modules.test.view.TestView'
    ]
});