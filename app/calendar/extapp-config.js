{
    name : 'Calendar',
    appFolder : '/calendar',
    
    /**
     * Paths to ext classes folders and specific files
     *
     */
    paths : {
        'Ext.calendar' : '/calendar/src',
        'Ext' : '/ext/src' // path to ExtJS sources
    },
    
    /**
     * Read dependency types
     *
     */
    dependTypes : {
        // array types without folders
        requires : true,
        uses : true,
        includes : false, // custom type (not documented in ExtJS)

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
        'Ext.calendar' : true
    },
    
    /**
     * Safe rank : prevents infinite loop on dependencies chain
     *
     */
    safeRank : true,
    safeRankLimit : 100
}