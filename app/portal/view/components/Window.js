/*global Ext*/
/*jshint strict: false*/
Ext.define('Demo.view.components.Window', {
    extend: 'Ext.window.Window',
    alias: 'widget.demowindow',
    
    initComponent: function() {
        var me = this;
        
        me.callParent(arguments);
    }
});