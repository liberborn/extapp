/*global Ext, Qforma, iLaunch, pageState*/
/*jslint browser: true*/
/*jshint strict: false*/

Ext.define('Demo.modules.test.controller.Main', {
    extend : 'Ext.app.Controller',

    views : [
        'Demo.modules.test.view.TestView'
    ],

    requires : [
        'DemoSingleton',
        'Portal.plugin.DemoPlugin',
        'Ext.ux.form.field.BoxSelect',
        'Demo.modules.test.store.TestStore'
    ],

    stores : [
        'Demo.modules.test.store.TestStore'
    ],

    refs: [],
    
    init : function () {
        // init
    }
});