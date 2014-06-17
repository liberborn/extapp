/*global Ext*/
/*jshint strict: false*/
Ext.define('Demo.view.MainView', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.mainview',

    uses: [
        'Demo.view.portal.NavigationHeader'
    ]
});