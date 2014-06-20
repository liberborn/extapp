/*global Ext, Qforma*/
/*jshint strict: false*/
/*jslint browser: true*/

Ext.define('Demo.controller.Secondary', {
    extend: 'Demo.controller.Main',

    requires: [
        'DemoSingleton'
    ],

    init: function () {
        var me = this;
        
        me.application.on({
        });

        me.control({
        });
    }
});