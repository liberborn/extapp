

/* ----- /portal/modules/test/view/TestView.js ----- */

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



/* ----- /portal/modules/test/model/TestModel.js ----- */

/*global Ext*/
/*jshint strict: false*/

Ext.define('Demo.modules.test.model.TestModel', {
    extend : 'Ext.data.Model',
    fields : [],

    uses : [
        'Demo.modules.test.view.TestView'
    ]
});



/* ----- /portal/modules/test/store/TestStore.js ----- */

/*global Ext*/
Ext.define('Demo.modules.test.store.TestStore', {
    extend : 'Ext.data.TreeStore',
    model  : 'Demo.modules.test.model.TestModel',

    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
});



/* ----- /ext/src/util/CSS.js ----- */

/*
This file is part of Ext JS 4.2

Copyright (c) 2011-2013 Sencha Inc

Contact:  http://www.sencha.com/contact

Commercial Usage
Licensees holding valid commercial licenses may use this file in accordance with the Commercial
Software License Agreement provided with the Software or, alternatively, in accordance with the
terms contained in a written agreement between you and Sencha.

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.sencha.com/contact.

Build date: 2013-03-11 22:33:40 (aed16176e68b5e8aa1433452b12805c0ad913836)
*/
/**
 * Utility class for manipulating CSS rules
 * @singleton
 */
Ext.define('Ext.util.CSS', function() {
    var CSS,
        rules = null,
        doc = document,
        camelRe = /(-[a-z])/gi,
        camelFn = function(m, a){ return a.charAt(1).toUpperCase(); };

    return {

        singleton: true,

        rules: rules,

        initialized: false,

        constructor: function() {
            // Cache a reference to the singleton
            CSS = this;
        },

        /**
         * Creates a stylesheet from a text blob of rules.
         * These rules will be wrapped in a STYLE tag and appended to the HEAD of the document.
         * @param {String} cssText The text containing the css rules
         * @param {String} id An id to add to the stylesheet for later removal
         * @return {CSSStyleSheet}
         */
        createStyleSheet : function(cssText, id) {
            var ss,
                head = doc.getElementsByTagName("head")[0],
                styleEl = doc.createElement("style");

            styleEl.setAttribute("type", "text/css");
            if (id) {
               styleEl.setAttribute("id", id);
            }

            if (Ext.isIE) {
               head.appendChild(styleEl);
               ss = styleEl.styleSheet;
               ss.cssText = cssText;
            } else {
                try{
                    styleEl.appendChild(doc.createTextNode(cssText));
                } catch(e) {
                   styleEl.cssText = cssText;
                }
                head.appendChild(styleEl);
                ss = styleEl.styleSheet ? styleEl.styleSheet : (styleEl.sheet || doc.styleSheets[doc.styleSheets.length-1]);
            }
            CSS.cacheStyleSheet(ss);
            return ss;
        },

        /**
         * Removes a style or link tag by id
         * @param {String} id The id of the tag
         */
        removeStyleSheet : function(id) {
            var existing = doc.getElementById(id);
            if (existing) {
                existing.parentNode.removeChild(existing);
            }
        },

        /**
         * Dynamically swaps an existing stylesheet reference for a new one
         * @param {String} id The id of an existing link tag to remove
         * @param {String} url The href of the new stylesheet to include
         */
        swapStyleSheet : function(id, url) {
            var ss;
            CSS.removeStyleSheet(id);
            ss = doc.createElement("link");
            ss.setAttribute("rel", "stylesheet");
            ss.setAttribute("type", "text/css");
            ss.setAttribute("id", id);
            ss.setAttribute("href", url);
            doc.getElementsByTagName("head")[0].appendChild(ss);
        },

        /**
         * Refresh the rule cache if you have dynamically added stylesheets
         * @return {Object} An object (hash) of rules indexed by selector
         */
        refreshCache : function() {
            return CSS.getRules(true);
        },

        // @private
        cacheStyleSheet : function(ss) {
            if (!rules) {
                rules = CSS.rules = {};
            }
            try {// try catch for cross domain access issue
                var ssRules = ss.cssRules || ss.rules,
                    i = ssRules.length - 1,
                    imports = ss.imports,
                    len = imports ? imports.length : 0,
                    rule, j;
                    
                // Old IE has a different way of handling imports
                for (j = 0; j < len; ++j) {
                    CSS.cacheStyleSheet(imports[j]);
                }

                for (; i >= 0; --i) {
                    rule = ssRules[i];
                    // If it's an @import rule, import its stylesheet
                    if (rule.styleSheet) {
                        CSS.cacheStyleSheet(rule.styleSheet);
                    }
                    CSS.cacheRule(rule, ss);
                }
            } catch(e) {}
        },

        cacheRule: function(cssRule, styleSheet) {
            // If it's an @import rule, import its stylesheet
            if (cssRule.styleSheet) {
                return CSS.cacheStyleSheet(cssRule.styleSheet);
            }

            var selectorText = cssRule.selectorText,
                selectorCount, j;

            if (selectorText) {

                // Split in case there are multiple, comma-delimited selectors
                selectorText = selectorText.split(',');
                selectorCount = selectorText.length;
                for (j = 0; j < selectorCount; j++) {
                    // IE<8 does not keep a reference to parentStyleSheet in the rule, so we
                    // must cache an object like this until IE<8 is deprecated.
                    rules[Ext.String.trim(selectorText[j]).toLowerCase()] = {
                        parentStyleSheet: styleSheet,
                        cssRule: cssRule
                    };
                };
            }
        },

        /**
         * Gets all css rules for the document
         * @param {Boolean} refreshCache true to refresh the internal cache
         * @return {Object} An object (hash) of rules indexed by selector
         */
        getRules : function(refreshCache) {
            var result = {},
                selector;

            if (rules === null || refreshCache) {
                CSS.refreshCache();
            }
            for (selector in rules) {
                result[selector] = rules[selector].cssRule;
            }
            return result;
        },
        
        refreshCache: function() {
            var ds = doc.styleSheets,
                i = 0,
                len = ds.length;

            rules = CSS.rules = {}
            for (; i < len; i++) {
                try {
                    if (!ds[i].disabled) {
                        CSS.cacheStyleSheet(ds[i]);
                    }
                } catch(e) {}
            }
        },

        /**
         * Gets an an individual CSS rule by selector(s)
         * @param {String/String[]} selector The CSS selector or an array of selectors to try. The first selector that is found is returned.
         * @param {Boolean} refreshCache true to refresh the internal cache if you have recently updated any rules or added styles dynamically
         * @return {CSSStyleRule} The CSS rule or null if one is not found
         */
        getRule: function(selector, refreshCache, rawCache) {
            var i, result;

            if (!rules || refreshCache) {
                CSS.refreshCache();
            }
            if (!Ext.isArray(selector)) {
                result = rules[selector.toLowerCase()]
                if (result && !rawCache) {
                    result = result.cssRule;
                }
                return result || null;
            }
            for (i = 0; i < selector.length; i++) {
                if (rules[selector[i]]) {
                    return rawCache ? rules[selector[i].toLowerCase()] : rules[selector[i].toLowerCase()].cssRule;
                }
            }
            return null;
        },

        /**
         * Creates a rule.
         * @param {CSSStyleSheet} styleSheet The StyleSheet to create the rule in as returned from {@link #createStyleSheet}.
         * @param {String} selector The selector to target the rule.
         * @param {String} property The cssText specification eg `"color:red;font-weight:bold;text-decoration:underline"`
         * @return {CSSStyleRule} The created rule
         */
        createRule: function(styleSheet, selector, cssText) {
            var result,
                ruleSet = styleSheet.cssRules || styleSheet.rules,
                index = ruleSet.length;

            if (styleSheet.insertRule) {
                styleSheet.insertRule(selector + '{' + cssText + '}', index);
            } else {
                styleSheet.addRule(selector, cssText||' ');
            }
            CSS.cacheRule(result = ruleSet[index], styleSheet);
            return result;
        },

        /**
         * Updates a rule property
         * @param {String/String[]} selector If it's an array it tries each selector until it finds one. Stops immediately once one is found.
         * @param {String} property The css property or a cssText specification eg `"color:red;font-weight:bold;text-decoration:underline"`
         * @param {String} value The new value for the property
         * @return {Boolean} true If a rule was found and updated
         */
        updateRule : function(selector, property, value) {
            var rule, i, styles;
            if (!Ext.isArray(selector)) {
                rule = CSS.getRule(selector);
                if (rule) {
                    // 2 arg form means cssText sent, so parse it and update each style
                    if (arguments.length == 2) {
                        styles = Ext.Element.parseStyles(property);
                        for (property in styles) {
                            rule.style[property.replace(camelRe, camelFn)] = styles[property];
                        }
                    } else {
                        rule.style[property.replace(camelRe, camelFn)] = value;
                    }
                    return true;
                }
            } else {
                for (i = 0; i < selector.length; i++) {
                    if (CSS.updateRule(selector[i], property, value)) {
                        return true;
                    }
                }
            }
            return false;
        },

        deleteRule: function(selector) {
            var rule = CSS.getRule(selector, false, true),
                styleSheet, index;

            if (rule) {
                styleSheet = rule.parentStyleSheet;
                index = Ext.Array.indexOf(styleSheet.cssRules || styleSheet.rules, rule.cssRule);
                if (styleSheet.deleteRule) {
                    styleSheet.deleteRule(index);
                } else {
                    styleSheet.removeRule(index);
                }
                delete rules[selector];
            }
        }
    };
});



/* ----- /portal/DemoSingleton.js ----- */

/*global Ext */
/*jslint browser: true */
/*jshint strict: false */

Ext.define('DemoSingleton', {
    singleton: true,

    requires: [
        'Ext.grid.View',
        'Ext.util.CSS',
        'Ext.Img'
    ]
});



/* ----- /portal/model/AboutModel.js ----- */

Ext.define('Demo.model.AboutModel', {
    extend : 'Ext.data.Model',

    fields : [
        { name : 'value', type : 'string' },
        { name : 'code', type : 'string' },
        { name : 'flag', type : 'string' }
    ]
});



/* ----- /portal/store/AboutStore.js ----- */

/*global Ext*/
/*jslint browser: true*/
/*jshint strict: false*/

Ext.define('Demo.store.AboutStore', {
    extend: 'Ext.data.Store',
    alias: 'widget.aboutWindow',

    model: 'Demo.model.AboutModel',

    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }

    autoLoad : false,

    sorters : [{
        property : 'name',
        direction : 'ASC'
    }]    
});



/* ----- /portal/view/app/Portlet.js ----- */

/*global Ext*/
Ext.define('Demo.view.app.Portlet', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.portlet',
    
    uses : [
        'DemoSingleton'
    ]
});



/* ----- /portal/view/components/Window.js ----- */

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



/* ----- /portal/view/components/Logo.js ----- */

/*global Ext*/
/*jshint strict: false*/
Ext.define('Demo.view.components.Logo', {
    extend: 'Ext.Img',
    alias: 'widget.logo'
});



/* ----- /portal/view/portal/NavigationHeader.js ----- */

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



/* ----- /portal/view/components/AboutWindow.js ----- */

/*global Ext*/
/*jshint strict: false*/
Ext.define('Demo.view.components.AboutWindow', {
    extend: 'Demo.view.components.Window',
    alias: 'widget.aboutWindow',

    store: 'Demo.store.AboutStore',
    
    initComponent: function() {
        var me = this;
        
        me.callParent(arguments);
    }
});



/* ----- /portal/view/portal/PortletsPanel.js ----- */

/*global Ext*/
/*jshint strict: false*/
Ext.define('Demo.view.portal.PortletsPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.portletspanel',

    uses: [
        'Demo.view.app.Portlet'
    ]
});




/* ----- /portal/plugin/DemoPlugin.js ----- */

/*global Ext, Demo*/
/*jslint browser: true*/
/*jshint strict: false*/

Ext.define('Demo.plugin.DemoPlugin', {
    singleton: true,

    requires: [
        'DemoSingleton'
    ],

    init : function (tree, collapseAll) {
        var me = this;
    }
});



/* ----- /portal/controller/Main.js ----- */

/*global Ext, gPortalConfig, Qforma, gPortalPermissions*/
/*jshint strict: false*/
/*jslint browser: true*/

Ext.define('Demo.controller.Main', {
    extend: 'Ext.app.Controller',

    views: [
        'Demo.view.portal.NavigationHeader',
        'Demo.view.portal.PortletsPanel',
        'Demo.view.components.AboutWindow'
    ],

    requires: [
        'DemoSingleton'
    ],

    refs: [],

    init: function () {
        // init
    }
});



/* ----- /portal/view/MainView.js ----- */

/*global Ext*/
/*jshint strict: false*/
Ext.define('Demo.view.MainView', {
    extend: "Demo.view.app.Portlet",
    alias: 'widget.mainview',

    uses: [
        'Demo.view.portal.NavigationHeader'
    ]
});



/* ----- /portal/controller/Secondary.js ----- */

/*global Ext, Qforma*/
/*jshint strict: false*/
/*jslint browser: true*/

Ext.define('Demo.controller.Secondary', {
    extend: 'Demo.controller.Main',

    requires: [
        'DemoSingleton'
    ],

    init: function () {
        var me = this;
        
        me.application.on({
        });

        me.control({
        });
    }
});



/* ----- /portal/modules/test/controller/Main.js ----- */

/*global Ext, Qforma, iLaunch, pageState*/
/*jslint browser: true*/
/*jshint strict: false*/

Ext.define('Demo.modules.test.controller.Main', {
    extend : 'Ext.app.Controller',

    views : [
        'Demo.modules.test.view.TestView'
    ],

    requires : [
        'DemoSingleton',
        'Portal.plugin.DemoPlugin',
        'Ext.ux.form.field.BoxSelect',
        'Demo.modules.test.store.TestStore'
    ],

    stores : [
        'Demo.modules.test.store.TestStore'
    ],

    refs: [],
    
    init : function () {
        // init
    }
});



/* ----- /portal/app.js ----- */

/*global Ext*/
/*jslint browser: true*/
/*jshint strict: false*/

Ext.Loader.setConfig({
    paths : {
        'Demo' : '/portal/app',
        'DemoSingleton' : '/portal/app/DemoSingleton.js',
        'Ext.ux.form.field.BoxSelect' : '/portal/app/plugin/BoxSelect.js'
    },
    enabled: true
});

Ext.application({
    name: 'Demo',
    appFolder: '/portal/app',

    controllers: [
        'Main',
        'Secondary'
    ],

    requires: [
        "Demo.view.MainView",
        'DemoSingleton'
    ],

    includes : [
        'Demo.modules.test.controller.Main',
    ],

    store : Ext.create("Demo.store.Main", {
        title : 'StoreTitle'
    }),

    launch: function () {
        var me = this;
        
        Ext.grid({
            store : 'Demo.store.SampleStore',
            width : 100
        });
        
        Ext.grid({
            store : me.getStore(),
            width : 100
        });
    }
});

