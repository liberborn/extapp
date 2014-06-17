/*global Ext, gPortalConfig, Qforma, gPortalPermissions*/
/*jshint strict: false*/
/*jslint browser: true*/
Ext.define('Demo.controller.Main', {
    extend: 'Ext.app.Controller',

    views: [
        'Demo.view.portal.NavigationHeader',
        'Demo.view.portal.PortletsPanel',
        'Demo.view.components.AboutWindow'
    ],

    requires: [
        'DemoSingleton'
    ],

    refs: [],

    init: function () {
        // init
    }
});