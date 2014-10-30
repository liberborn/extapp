{
    name : 'Demo',
    appFolder : '/portal',
    
    /**
     * Paths to ext classes folders and specific files
     *
     */
    paths : {
        'Demo' : '/portal',
        'DemoSingleton' : '/portal/DemoSingleton.js',
        'Portal' : '/portal', // alternative for 'Demo' class. Points to the same folder
        
        'Ext' : '/ext/src', // path to ExtJS sources
        'Ext.ux.form.field.BoxSelect' : '/portal/plugin/BoxSelect.js' // custom ExtJS class
    },
    
    /**
     * Read dependency types
     *
     */
    dependTypes : {
        // array types without folders
        requires : true,
        uses : true,
        mixins : true,
        includes : true, // custom type (not documented in ExtJS)

        // array types with folders
        controllers : true,
        models : true,
        stores : true,
        views : true,

        // string types
        extend : true,
        store : true,
        model : true
    },
    
    /**
     * Include/exclude Ext classes
     *
     */
    extClasses : {
        'Ext' : false, // default : exclude Ext classes
        'Ext.util' : true
    },
    
    /**
     * Safe rank : prevents infinite loop on dependencies chain
     *
     */
    safeRank : true,
    safeRankLimit : 100
}