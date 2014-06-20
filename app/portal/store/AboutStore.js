/*global Ext*/
/*jslint browser: true*/
/*jshint strict: false*/

Ext.define('Demo.store.AboutStore', {
    extend: 'Ext.data.Store',
    alias: 'widget.aboutWindow',

    model: 'Demo.model.AboutModel',

    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }

    autoLoad : false,

    sorters : [{
        property : 'name',
        direction : 'ASC'
    }]    
});