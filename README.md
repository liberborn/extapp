# About


Extapp is the lightweight tool to build ExtJS applications. The main goal is to collect all dependencies required by JS application into one production-ready output file.

The tool is processing build in *non-conflict manner*. It may alert developer about errors and warnings but mainly it does not break the build because for example of duplicates or some class file was not found etc.

No additional comment conventions needed. Extapp avoids some custom magic comments like /\*requires file.js \*/. It uses native ExtJS dependencies declarations in **Ext.define()** method or in any other place in the code.

**The main features of the Extapp tool:**
- resolving dependencies
- deduplicate referenced dependencies
- ranking classes based on references
- smart avoid of infinite loops
- build sources into one output file
- usage in other JS frameworks


# Usage

```bash
Usage: java -jar extapp-yyyy.mm.jar [options] [base path] [config file] [source file] [output file]

Global Options
  -h, --help                    Displays this information
  -v, --verbose                 Display informational messages and warnings
  -l, --delimiter               Output a delimiter between combined files
  -b, --basePath                Base path to web folder (absolute or relative)
  -c <file>, --config <file>    Config file with extapp options
  -s <file>, --source <file>    Source file. Starting point to process dependencies.
  -o <file>, --output <file>    Place the output into <file>. Defaults to source file
```  

# Main features

## Reading dependencies

Each Ext class usually starts with **'Ext.define()'** method. Parameters like **'requires', 'uses', 'controllers', 'views'** etc refer to other classes which have to be declared before current ext class.

There are three reference types which can be grouped like this:
- **array types without folders**: 'requires', 'uses'
- **array types with folders**: 'controllers', 'models', 'stores', 'views'
- **string types**: 'extend', 'model', 'store'

## Rankink classes

The simpliest way to prioritize classes is to rank them based on references. 

**For example:** if **class 'A'** with rank #1 requires **class 'B'** with *rank 1* - then **class 'B'** rises to *rank 2*. After that if **class 'C'** with *rank 4* uses **class 'A'** - then **class 'A'** raises to *rank 5* and **class 'B'** raises to *rank 6*.

The ranking table guarantees that all classes are correctly prioritized and will be defined with referencing to already declared classes. 

## Smart avoid of infinite loops

I have did not find the 100% orthodox way to find out if classes dependencies chains will go into infinite loops.

It was resolved with easy trick - *rank limit* introduced. Usually the very huge ExtJS application reaches up to 10-15 rank levels. So we can assume that if rank goes for example to 100 it is very unusual and possibly it is the infinite loop.

## Build sources into one output file

Actually this is the core feature of the tool. On production environments we don't need to load hundreds of small files with ExtJS classes declared. It significantly decreases browser performance and UI experience. We want to have one combined script file even with ~10Mb size. User can wait one time.

## Extapp VS Sencha.cmd

Sencha.cmd is the ultimate tool to work with ExtJS applications.

Extapp is about something different.
- excluding native **'Ext'** sources
- working in non-conflict way
- deployment friendly

### Excluding native **'Ext'** sources

The big ExtJS appications usually use many of core ExtJS sources. That is why it is useful just to include 'ext-all.js' and do not care about native **'Ext'** classes. Extapp does the job. You may exclude **'Ext'** class but include **'Ext.data'** etc.

### Working in non-conflict way

We do not want the dictatorship of the tools. Class was not found ? - OK. Go ahead. Duplicates? - Nevermind. Output file was not set? - Let's backup the source file and use it instead!

### Deployment friendly

It is much more easy to integrate one simple jar file into deployment environments than install and manage huge tools.

Use app build and sources at the same time. Ignoring set output file will backup source file and use it for app build. It is very useful to use the app build and sources at the same time on website. This way may help to not fail the production builds and the website will still working with references to source files.

Extapp may be easily integrated in both ant and gradle deployment scripts.

# Extapp examples

## Demo Portal

### Run in command line
```bash
java -jar .build/extapp-2014.06.jar -v -l -b app -c /portal/extapp-config.js -s /portal/app.js -o /portal/app-output.js
```

### Extapp config file
```js
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
```

### Command line output
```bash
$ java -jar .build/extapp-2014.06.jar -v -l -b app -c /portal/extapp-config.js -s /portal/app.js -o /portal/app-output.js

[INFO] Base path : app
[INFO] Config file : app/portal/extapp-config.js
[INFO] Source file : app/portal/app.js
[INFO] Output file : app/portal/app-output.js

[INFO] Processing source files...

[WARNING] Ext class 'Demo.modules.test.controller.Main' has 1 duplicate dependencies. File : /portal/modules/test/controller/Main.js

[WARNING] Rank limit 100 has been reached. Possibly infinite loop took place.
Stop processing 'Demo.modules.test.view.TestView'. Please check dependency chain or disable safe rank.
Ext class 'Demo.modules.test.view.TestView'. File : /portal/modules/test/view/TestView.js

[ERROR] File not found : /portal/store/SampleStore.js


[INFO] Building ext app...

[INFO] -- rank : extClass --
[INFO] 100 : /portal/modules/test/view/TestView.js
[INFO] 99 : /portal/modules/test/model/TestModel.js
[INFO] 98 : /portal/modules/test/store/TestStore.js
[INFO] 6 : /ext/src/util/CSS.js
[INFO] 5 : /portal/DemoSingleton.js
[INFO] 5 : /portal/model/AboutModel.js
[INFO] 4 : /portal/store/AboutStore.js
[INFO] 4 : /portal/view/app/Portlet.js
[INFO] 4 : /portal/view/components/Window.js
[INFO] 4 : /portal/view/components/Logo.js
[INFO] 3 : /portal/view/portal/NavigationHeader.js
[INFO] 3 : /portal/view/components/AboutWindow.js
[INFO] 3 : /portal/view/portal/PortletsPanel.js
[INFO] 2 : /portal/plugin/DemoPlugin.js
[INFO] 2 : /portal/controller/Main.js
[INFO] 1 : /portal/view/MainView.js
[INFO] 1 : /portal/controller/Secondary.js
[INFO] 1 : /portal/modules/test/controller/Main.js
[INFO] 0 : /portal/app.js

[INFO] Extapp build complete!

[INFO] -- errors : 1
[INFO] -- warnings : 2
[INFO] -- total : 19 files
[INFO] -- time : 0.409 seconds
```

## Calendar (ExtJS 5 Samples)

### Run in command line
```bash
java -jar .build/extapp-2014.06.jar -v -l -b app -c /calendar/extapp-config.js -s /calendar/src/App.js
```

### Extapp config file
```js
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
```

### Command line output
```bash
$ java -jar .build/extapp-2014.06.jar -v -l -b app -c /calendar/extapp-config.js -s /calendar/src/App.js

[INFO] Base path : app
[INFO] Config file : app/calendar/extapp-config.js
[INFO] Source file : app/calendar/src/App.js
[INFO] No output file specified. Using source file for output instead.
[INFO] Source backup file : app/calendar/src/App.src.js
[INFO] Output file : app/calendar/src/App.js

[INFO] Processing source files...

[WARNING] Ext class 'Ext.calendar.data.MemoryCalendarStore' has 1 duplicate dependencies. File : /calendar/src/data/MemoryCalendarStore.js

[WARNING] Ext class 'Ext.calendar.data.MemoryEventStore' has 1 duplicate dependencies. File : /calendar/src/data/MemoryEventStore.js


[INFO] Building ext app...

[INFO] -- rank : extClass --
[INFO] 8 : /calendar/src/util/Date.js
[INFO] 8 : /calendar/src/data/EventMappings.js
[INFO] 7 : /calendar/src/dd/StatusProxy.js
[INFO] 7 : /calendar/src/template/BoxLayout.js
[INFO] 7 : /calendar/src/view/AbstractCalendar.js
[INFO] 6 : /calendar/src/dd/DragZone.js
[INFO] 6 : /calendar/src/dd/DropZone.js
[INFO] 6 : /calendar/src/util/WeekEventRenderer.js
[INFO] 6 : /calendar/src/template/Month.js
[INFO] 6 : /calendar/src/view/MonthDayDetail.js
[INFO] 5 : /calendar/src/view/Month.js
[INFO] 5 : /calendar/src/template/DayHeader.js
[INFO] 5 : /calendar/src/dd/DayDragZone.js
[INFO] 5 : /calendar/src/dd/DayDropZone.js
[INFO] 5 : /calendar/src/template/DayBody.js
[INFO] 4 : /calendar/src/view/DayBody.js
[INFO] 4 : /calendar/src/data/CalendarMappings.js
[INFO] 4 : /calendar/src/view/DayHeader.js
[INFO] 3 : /calendar/src/form/field/ReminderCombo.js
[INFO] 3 : /calendar/src/form/field/CalendarCombo.js
[INFO] 3 : /calendar/src/view/Day.js
[INFO] 3 : /calendar/src/form/field/DateRange.js
[INFO] 2 : /calendar/src/form/EventDetails.js
[INFO] 2 : /calendar/src/data/CalendarModel.js
[INFO] 2 : /calendar/src/view/Week.js
[INFO] 2 : /calendar/src/data/EventModel.js
[INFO] 1 : /calendar/src/data/Events.js
[INFO] 1 : /calendar/src/form/EventWindow.js
[INFO] 1 : /calendar/src/data/MemoryEventStore.js
[INFO] 1 : /calendar/src/data/MemoryCalendarStore.js
[INFO] 1 : /calendar/src/data/Calendars.js
[INFO] 1 : /calendar/src/CalendarPanel.js
[INFO] 0 : /calendar/src/App.js

[INFO] Extapp build complete!

[INFO] -- warnings : 2
[INFO] -- total : 33 files
[INFO] -- time : 0.836 seconds

```

# Deployment with ant/gradle examples

## Ant targets
```xml
<project name="Extapp" default="optimizeExtApps" basedir=".">

  <!-- define props -->
  <taskdef resource="net/sf/antcontrib/antcontrib.properties" />

  <property name="extappJar" value=".build/extapp-2014.06.jar" />
  <property name="projectBasePath" value="app" />

  <!-- Extapp Builder -->
  <target name="extappBuilder">
    <echo message="Extapp optimizer : ${extappName}" />
    <java jar="${extappJar}" fork="true" failonerror="yes">
      <arg value="-v" />
      <arg value="-l" />
      <arg value="-b" />
      <arg value="${basePath}" />
      <arg value="-c" />
      <arg value="${configFile}" />
      <arg value="-s" />
      <arg value="${sourceFile}" />
      <arg value="-o" />
      <arg value="${outputFile}" />
    </java>
  </target>
  
  <!-- Build portal with extapp -->
  <target name="optimizePortal">
    <antcall target="extappBuilder">
      <param name="extappName" value="portal" />
      <param name="basePath" value="${projectBasePath}" />
      <param name="configFile" value="/portal/extapp-config.js" />
      <param name="sourceFile" value="/portal/app.js" />
      <param name="outputFile" value="/portal/app-output.js" />
    </antcall>
  </target>

  <!-- Build calendar with extapp -->
  <target name="optimizeCalendar">
    <antcall target="extappBuilder">
      <param name="extappName" value="calendar" />
      <param name="basePath" value="${projectBasePath}" />
      <param name="configFile" value="/calendar/extapp-config.js" />
      <param name="sourceFile" value="/calendar/src/App.js" />
      <param name="outputFile" value="" />
    </antcall>
  </target>

  <!-- Optimize ExtJS apps with extapp builder -->
  <target name="optimizeExtApps">
    <antcall target="optimizePortal" />
    <antcall target="optimizeCalendar" />
  </target>
</project>
```


## Gradle tasks
```groovy
def extappJar = '.build/extapp-2014.06.jar'

/**
 * Extapp Builder
 *
 */
def extappBuilder(name, config, source) {
    printSection('Extapp optimizer : ' + name)
    javaexec {
        main ='-jar'
        args = [
            file(extappJar).path, '-v', '-l', '-b', webDir, '-c', config, '-s', source
        ]
    }
}

/**
 * Optimize ExtJS apps with extapp builder
 *
 */
task optimizeExtApps << {
    extappBuilder('portal', '/portal/extapp-config.js', '/portal/app.js')
    extappBuilder('calendar', '/calendar/extapp-config.js', '/calendar/src/App.js')
}

defaultTasks 'optimizeExtApps'
```

# Usage in other JS frameworks

Extapp can be potentially used in other JS frameworks (not only ExtJS) which are developed similarly to ExtJS methodology.

**ExtJS example:**
```js
// ExtJS methodology
Ext.define({'Ext.classOne.SubClass', {
    extend: 'Ext.classOne.Class',
    
    requires: [
        'Ext.classTwo.Class
    ],
    
    uses: [
        'Ext.classTwo.SubClass
    ],
    
    init: function(){
        // init
    }
});

Ext.define({'Ext.classTwo.SubClass', {
    extend: 'Ext.classTwo.Class',
    
    init: function(){
        // init
    }
});
```
**Rank results:**
```bash
[INFO] -- rank : extClass --
[INFO] 2 : Ext/classTwo/Class.js
[INFO] 1 : Ext/classOne/Class.js
[INFO] 1 : Ext/classTwo/SubClass.js
[INFO] 0 : Ext/classOne/SubClass.js
```

**Any other JS framework example:**
```js
// ExtJS methodology
Framework.defineFunction('Framework.classOne.SubClass', {
    extend: 'Framework.classOne.Class',
    
    requires: [
        'Framework.classTwo.Class
    ],
    
    uses: [
        'Framework.classTwo.SubClass
    ],
    
    init: function(){
        // init
    }
});

Framework.defineFunction({'Framework.classTwo.SubClass', {
    extend: 'Framework.classTwo.Class',
    
    init: function(){
        // init
    }
});
```

**Rank results:**
```bash
[INFO] -- rank : extClass --
[INFO] 2 : Framework/classTwo/Class.js
[INFO] 1 : Framework/classOne/Class.js
[INFO] 1 : Framework/classTwo/SubClass.js
[INFO] 0 : Framework/classOne/SubClass.js
```

# References

Inspired by _Nicholas's C. Zakas_ Combiner tool
- http://www.nczonline.net/blog/2009/09/22/introducing-combiner-a-javascriptcss-concatenation-tool/
- https://github.com/nzakas/combiner
