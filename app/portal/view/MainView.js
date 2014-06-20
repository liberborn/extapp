/*global Ext*/
/*jshint strict: false*/
Ext.define('Demo.view.MainView', {
    extend: "Demo.view.app.Portlet",
    alias: 'widget.mainview',

    uses: [
        'Demo.view.portal.NavigationHeader'
    ]
});