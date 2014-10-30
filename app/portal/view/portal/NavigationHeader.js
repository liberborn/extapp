/*global Ext*/
/*jshint strict: false*/
Ext.define('Demo.view.portal.NavigationHeader', {
    extend: 'Ext.container.Container',
    alias: 'widget.navigationheader',

    requires: [
        'DemoSingleton'
    ],
    
    mixins: [
        'Demo.view.components.Logo'
    ]
});