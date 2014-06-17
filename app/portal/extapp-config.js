{
    name : 'Demo',
    appFolder : '/portal/app',
    paths : {
        'Portal' : '/portal/app',
        'Demo' : '/portal/app',
        'DemoSingleton' : '/portal/app/DemoSingleton.js',
        
        'Ext' : '/ext/src',
        'Ext.ux.form.field.BoxSelect' : '/portal/app/plugin/BoxSelect.js'
    },
    dependTypes : {
        requires : true,
        uses : true,
        controllers : true,
        models : true,
        stores : true,
        views : true,
        includes : true
    },
    extClasses : {
        'Ext' : true
    }
}