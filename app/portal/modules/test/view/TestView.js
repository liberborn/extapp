/*global Ext*/
/*jshint strict: false*/
Ext.define('Demo.modules.test.view.TestView', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.testmodule',

    store : 'Demo.modules.test.store.TestStore',

    initComponent: function () {
        this.buildTopPanel();

        this.callParent(arguments);
    }
});