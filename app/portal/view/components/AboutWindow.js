/*global Ext*/
/*jshint strict: false*/
Ext.define('Demo.view.components.AboutWindow', {
    extend: 'Demo.view.components.Window',
    alias: 'widget.aboutWindow',

    store: 'Demo.store.AboutStore',
    
    initComponent: function() {
        var me = this;
        
        me.callParent(arguments);
    }
});