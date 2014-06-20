/*global Ext, Demo*/
/*jslint browser: true*/
/*jshint strict: false*/

Ext.define('Demo.plugin.DemoPlugin', {
    singleton: true,

    requires: [
        'DemoSingleton'
    ],

    init : function (tree, collapseAll) {
        var me = this;
    }
});