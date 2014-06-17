{
    name : 'Demo',
    appFolder : '/portal/app',
    paths : {
        'Demo' : '/portal/app',
        'DemoSingleton' : '/portal/app/DemoSingleton.js',
        'Portal' : '/portal/app', // alternative for 'Demo' class. Points to the same folder
        
        'Ext' : '/ext/src', // path to ExtJS sources
        'Ext.ux.form.field.BoxSelect' : '/portal/app/plugin/BoxSelect.js' // custom ExtJS class
    },
    dependTypes : {
        requires : true,
        uses : true,
        controllers : true,
        models : true,
        stores : true,
        views : true,
        includes : true // custom dependency type (not documented in ExtJS) 
                        // useful in dev environment when ExtJS is not loading sources
    },
    extClasses : {
        'Ext' : true // include Ext sources
    }
}