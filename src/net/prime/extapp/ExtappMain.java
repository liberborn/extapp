package net.prime.extapp;

import java.io.File;
import java.io.FileInputStream;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import jargs.gnu.CmdLineParser;

public class ExtappMain {

    private Boolean verbose = false;
    private Boolean delimiter = false;
    private Boolean minify = false;
    private String basePath = "";
    private String configFilename = null;
    private String sourceFilename = null;
    private String outputFilename = null;
    
    public static String charset = "UTF-8"; 

    private ExtappConfig config = new ExtappConfig();

    private static Gson gs = new GsonBuilder().create();
    
    // Get current time
    long start = System.currentTimeMillis();
    int errors = 0;
    int warnings = 0;
    
    ExtappMain(Boolean verbose, Boolean delimiter, Boolean minify, 
            String basePath, String configFilename, String sourceFilename, String outputFilename) {
        this.verbose = verbose;
        this.delimiter = delimiter;
        this.minify = minify;
        this.basePath = basePath;
        this.configFilename = configFilename;
        this.sourceFilename = sourceFilename;
        this.outputFilename = outputFilename;
    }
    
    public String getCharset() {
        return charset;
    }

    public Boolean getVerbose() {
        return verbose;
    }
    
    public Boolean getDelimiter() {
        return delimiter;
    }
    
    public Boolean isMinify() {
        return minify;
    }
    
    public String getConfigFilename() {
        return configFilename;
    }
    
    public String getSourceFilename() {
        return sourceFilename;
    }
    
    public String getSourceFilepath() {
        return getPath(getSourceFilename());
    }
    
    public String getOutputFilename() {
        return outputFilename;
    }
    
    public String getOutputFilepath() {
        return getPath(getOutputFilename());
    }
    
    public String getBasePath() {
        return basePath;
    }
    
    public String getPath(String fileName) {
        return (basePath + "/" + fileName).replaceAll("\\//", "/");
    }
    
    public void printMsg(String msg, String type) {
        if (verbose) {
            System.err.print("\n[" + type.toUpperCase() + "] " + msg);
        }
    }
    
    public void printMsg(String msg) {
        printMsg(msg, "info");
    }
    
    public void printProgress() {
        if (verbose) {
            System.err.print(".");
        }
    }
    
    public void printLn() {
        if (verbose) {
            System.err.print("\n");
        }        
    }
    
    public void printSection(String msg) {
        printLn();
        printMsg(msg);
        printLn();
    }
    
    public void init() {
        try {
            // Base path
            if (basePath == null) {
                basePath = "";
            }
            printMsg("Base path : " + basePath);
            
            // Config file
            if (configFilename != null) {
                FileInputStream configFileStream = new FileInputStream(new File(getPath(configFilename)));
                String configStr = IOUtils.toString(configFileStream, charset);            

                if (configStr != null && configStr != "") {
                    config = gs.fromJson(configStr, ExtappConfig.class);
                    printMsg("Config file : " + getPath(configFilename));
                } else {
                    System.err.println("[ERROR] Config file is non-valid");
                    usage();
                    System.exit(1);
                }                
            } else {
                System.err.println("\n[ERROR] No config file specified");
                usage();
                System.exit(1);
            }

            // Source file
            if (sourceFilename != null) {
                printMsg("Source file : " + getPath(sourceFilename));
            } else {
                System.err.println("\n[ERROR] No source file specified");
                usage();
                System.exit(1);
            }

            // Output file
            if (outputFilename != null) {
                printMsg("Output file : " + getPath(outputFilename));
            } else {
                File sourceFile = new File(getPath(sourceFilename));
                String sourceBackupFilename = getPath(sourceFilename).replace(".js", "") + ".src.js";
                File sourceBackupFile = new File(sourceBackupFilename);

                FileUtils.copyFile(sourceFile, sourceBackupFile);
                outputFilename = sourceFilename;

                printMsg("No output file specified. Using source file for output instead.");
                printMsg("Source backup file : " + sourceBackupFilename);
                printMsg("Output file : " + getPath(sourceFilename));
            }
            
            // Delimiter
            if (delimiter) {
                printMsg("Delimiter is enabled");
            }
            
            // Minify
            if (minify) {
                printMsg("Minify is enabled");
            }

            // Ext file combiner
            ExtFileCombiner extFileCombiner = new ExtFileCombiner(this, config);
            extFileCombiner.init();

        } catch (Exception e) {
            usage();
            System.err.println(e.getMessage());
            System.exit(1);
        } 
    }

    /**
     * main
     * 
     * @param args the command line arguments
     */
    public static void main(String[] args) {

        // Default settings
        Boolean verbose = false;
        Boolean delimiter = false;
        Boolean minify = false;
        String basePath = "";
        String configFilename = null;
        String sourceFilename = null;
        String outputFilename = null;

        // Command line parser
        CmdLineParser parser = new CmdLineParser();
        CmdLineParser.Option helpOpt = parser.addBooleanOption('h', "help");
        CmdLineParser.Option verboseOpt = parser.addBooleanOption('v', "verbose");
        CmdLineParser.Option delimiterOpt = parser.addBooleanOption('l', "delimiter");
        CmdLineParser.Option minifyOpt = parser.addBooleanOption('m', "minify");
        
        CmdLineParser.Option basePathOpt = parser.addStringOption('b', "basePath");
        CmdLineParser.Option configFilenameOpt = parser.addStringOption('c', "config");
        CmdLineParser.Option sourceFilenameOpt = parser.addStringOption('s', "source");
        CmdLineParser.Option outputFilenameOpt = parser.addStringOption('o', "output");
        
        try {
            parser.parse(args);

            // Help
            Boolean help = (Boolean) parser.getOptionValue(helpOpt);
            if (help != null && help.booleanValue()) {
                usage();
                System.exit(0);
            } 

            verbose = parser.getOptionValue(verboseOpt) != null;
            delimiter = parser.getOptionValue(delimiterOpt) != null;
            minify = parser.getOptionValue(minifyOpt) != null;

            basePath = (String) parser.getOptionValue(basePathOpt);
            configFilename = (String) parser.getOptionValue(configFilenameOpt);
            sourceFilename = (String) parser.getOptionValue(sourceFilenameOpt);
            outputFilename = (String) parser.getOptionValue(outputFilenameOpt);
    
            ExtappMain extapp = new ExtappMain(verbose, delimiter, minify, basePath, configFilename, sourceFilename, outputFilename);
            
            extapp.init();
            
        } catch (CmdLineParser.OptionException e) {
            usage();
            System.exit(1);            
        } catch (Exception e) { 
            System.err.println(e.getMessage());
            System.exit(1);
        } finally {
            // System.exit(1);
        }
        
    }
    
    /**
     * Usage : outputs help information to the console
     *
     */
    private static void usage() {
        System.out.println(
                "\nUsage: java -jar extapp-yyyy.mm.jar [options] [base path] [config file] [source file] [output file]\n\n"

                + "Global Options\n"
                + "  -h, --help                    Displays this information\n"
                + "  -v, --verbose                 Display informational messages and warnings\n"
                + "  -l, --delimiter               Output a delimiter between combined files\n"
                + "  -m, --minify                  Minify js code in the output file\n"
                + "  -b, --basePath                Base path to web folder (absolute or relative)\n"
                + "  -c <file>, --config <file>    Config file with extapp options\n"
                + "  -s <file>, --source <file>    Source file. Starting point to process dependencies.\n"
                + "  -o <file>, --output <file>    Place the output into <file>. Defaults to source file\n\n"
                
                + "Required options: -c <file> -s <file>\n\n"
                
                + "Example\n"
                + "  java -jar .build/extapp-2014.06.jar -v -l -b app" 
                + " -c /portal/extapp-config.js -s /portal/app.js -o /portal/app-output.js\n\n");
    }
}
