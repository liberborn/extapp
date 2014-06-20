/*global Ext*/
/*jslint browser: true*/
/*jshint strict: false*/

Ext.Loader.setConfig({
    paths : {
        'Demo' : '/portal/app',
        'DemoSingleton' : '/portal/app/DemoSingleton.js',
        'Ext.ux.form.field.BoxSelect' : '/portal/app/plugin/BoxSelect.js'
    },
    enabled: true
});

Ext.application({
    name: 'Demo',
    appFolder: '/portal/app',

    controllers: [
        'Main',
        'Secondary'
    ],

    requires: [
        "Demo.view.MainView",
        'DemoSingleton'
    ],

    includes : [
        'Demo.modules.test.controller.Main',
    ],

    store : Ext.create("Demo.store.Main", {
        title : 'StoreTitle'
    }),

    launch: function () {
        var me = this;
        
        Ext.grid({
            store : 'Demo.store.SampleStore',
            width : 100
        });
        
        Ext.grid({
            store : me.getStore(),
            width : 100
        });
    }
});