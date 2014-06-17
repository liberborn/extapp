/*global Ext*/
/*jshint strict: false*/
Ext.define('Demo.view.components.AboutWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.aboutWindow',
    
    initComponent: function() {
        var me = this;
        
        me.callParent(arguments);
    }
});