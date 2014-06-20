/*global Ext */
/*jslint browser: true */
/*jshint strict: false */

Ext.define('DemoSingleton', {
    singleton: true,

    requires: [
        'Ext.grid.View',
        'Ext.util.CSS',
        'Ext.Img'
    ]
});