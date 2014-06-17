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
    private String basePath = "";
    private String configFilename = null;
    private String sourceFilename = null;
    private String outputFilename = null;
    
    private String charset = "UTF-8"; 

    private ExtappConfig config = new ExtappConfig();

    private static Gson gs = new GsonBuilder().create();
    
    // Get current time
    long start = System.currentTimeMillis();
    
    ExtappMain(Boolean verbose, Boolean delimiter, Boolean eliminate, 
            String basePath, String configFilename, String sourceFilename, String outputFilename) {
        this.verbose = verbose;
        this.delimiter = delimiter;
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
            printMsg("Base path : " + basePath);
            
            FileInputStream configFileStream = new FileInputStream(new File(getPath(configFilename)));
            String configStr = IOUtils.toString(configFileStream, charset);            

            if (configStr != null && configStr != "") {
                config = gs.fromJson(configStr, ExtappConfig.class);
                printMsg("Config file : " + getPath(configFilename));
            }

            if (sourceFilename != null) {
                printMsg("Source file : " + getPath(sourceFilename));
            } else {
                printMsg("No source file specified", "error");
                System.exit(1);
            }

            if (outputFilename != null) {
                printMsg("Output file : " + getPath(outputFilename));
            } else {
                File sourceFile = new File(getPath(sourceFilename));
                String sourceBackupFilename = getPath(sourceFilename).replace(".js", "") + ".src.js";
                File sourceBackupFile = new File(sourceBackupFilename);

                FileUtils.copyFile(sourceFile, sourceBackupFile);
                outputFilename = sourceFilename;

                printMsg("No output file specified. Using source file for output instead.", "warning");
                printMsg("Source backup file : " + sourceBackupFilename);
                printMsg("Output file : " + getPath(sourceFilename));
            }

            ExtFileCombiner extFileCombiner = new ExtFileCombiner(this, config);
            extFileCombiner.init();

        } catch (Exception e) { 
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
        Boolean eliminate = false;
        String basePath = "";
        String configFilename = null;
        String sourceFilename = null;
        String outputFilename = null;

        // Command line parser
        CmdLineParser parser = new CmdLineParser();
        CmdLineParser.Option verboseOpt = parser.addBooleanOption('v', "verbose");
        CmdLineParser.Option delimiterOpt = parser.addBooleanOption('l', "delimiter");
        
        CmdLineParser.Option basePathOpt = parser.addStringOption('b', "basePath");
        CmdLineParser.Option configFilenameOpt = parser.addStringOption('c', "config");
        CmdLineParser.Option sourceFilenameOpt = parser.addStringOption('s', "source");
        CmdLineParser.Option outputFilenameOpt = parser.addStringOption('o', "output");
        
        try {
            parser.parse(args);

            verbose = parser.getOptionValue(verboseOpt) != null;
            delimiter = parser.getOptionValue(delimiterOpt) != null;

            basePath = (String) parser.getOptionValue(basePathOpt);
            configFilename = (String) parser.getOptionValue(configFilenameOpt);
            sourceFilename = (String) parser.getOptionValue(sourceFilenameOpt);
            outputFilename = (String) parser.getOptionValue(outputFilenameOpt);
    
            ExtappMain extapp = new ExtappMain(verbose, delimiter, eliminate, basePath, configFilename, sourceFilename, outputFilename);
            
            extapp.init();
            
        } catch (CmdLineParser.OptionException e) {
            System.exit(1);            
        } catch (Exception e) { 
            System.err.println(e.getMessage());
            System.exit(1);
        } finally {
            //
        }
        
    }    
}
