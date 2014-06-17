# About


Extapp is the tool to build ExtJS applications.

Main features: 
- reading classes dependencies
- ranking classes based on requires
- build source files into one output file.


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


# Examples

### Running in command line
```bash
java -jar .build/extapp-2014.06.jar -v -l -b app -c /portal/extapp-config.js -s /portal/app/app.js -o /portal/app/app-output.js
```

### Extapp config file
```js
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
```


# References

Inspired by _Nicholas's C. Zakas_ Combiner tool
- http://www.nczonline.net/blog/2009/09/22/introducing-combiner-a-javascriptcss-concatenation-tool/
- https://github.com/nzakas/combiner
