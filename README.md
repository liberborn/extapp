extapp
======

Extapp is the tool to build ExtJS applications.

Main features: 
- reading classes dependencies
- ranking classes based on requires
- build source files into one output file.


Usage
======
Usage: java -jar extapp-yyyy.mm.jar [options] [base path] [config file] [source file] [output file]

Global Options
  -h, --help                    Displays this information
  -v, --verbose                 Display informational messages and warnings
  -l, --delimiter               Output a delimiter between combined files
  -b, --basePath                Base path to web folder (absolute or relative)
  -c <file>, --config <file>    Config file with extapp options
  -s <file>, --source <file>    Source file. Starting point to process dependencies.
  -o <file>, --output <file>    Place the output into <file>. Defaults to source file
  

Example
======
java -jar .build/extapp-2014.06.jar -v -l -b app -c /portal/extapp-config.js -s /portal/app/app.js -o /portal/app/app-output.js
