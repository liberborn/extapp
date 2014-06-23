package net.prime.extapp;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import net.prime.extapp.ExtappConfig.DependTypeEnum;

public class ExtFileCombiner {

    private ExtappMain main = null;
    private ExtappConfig config = null;
    
    private Map<String, ExtSourceFile> sourceFiles = new HashMap<String, ExtSourceFile>();
    
    ValueComparator valueComparator =  new ValueComparator(this.sourceFiles);
    TreeMap<String,ExtSourceFile> rangedSourceFiles = new TreeMap<String,ExtSourceFile>(valueComparator);
    
    ExtFileCombiner(ExtappMain extappMain, ExtappConfig config) {
        this.main = extappMain;
        this.config = config;
    }

    /**
     * Verbose functions
     * 
     */

    public void printMsg(String msg, String type) {
        this.main.printMsg(msg, type);
    }

    public void printMsg(String msg) {
        this.main.printMsg(msg);
    }

    public void printProgress() {
        this.main.printProgress();
    }
    
    public void printSection(String msg) {
        this.main.printSection(msg);
    }
    
    public void printStatistics() {
        // Get elapsed time in milliseconds
        long elapsedTimeMillis = System.currentTimeMillis() - this.main.start;
        // Get elapsed time in seconds
        float elapsedTimeSec = elapsedTimeMillis/1000F;

        if (this.main.errors > 0) {
            printMsg("-- errors : " + this.main.errors);
        }
        if (this.main.warnings > 0) {
            printMsg("-- warnings : " + this.main.warnings);
        }
        printMsg("-- total : " + rangedSourceFiles.size() + " files");
        printMsg("-- time : " + elapsedTimeSec + " seconds\n\n\n");
    }

    /**
     * Get dependency type folder
     * 
     *   example: controllers > controller, models > model
     * 
     * @param String dependType
     * @return String
     */
    public String getDependencyTypeFolder(String dependType) {
        return dependType.substring(0, dependType.length() - 1);
    }
    
    /**
     * Check for folder type enum
     * 
     *   folder types have paths like : '{dependencyType}/{extClass}.js'
     *   non-folder types have paths like : '{extParentClass}/{extSubClasses}/{extSubClass}.js'
     * 
     * @param String type
     * @return Boolean
     */
    public Boolean isFolderDependencyType(String type) {
        DependTypeEnum dependType = this.config.getDependTypeEnums().get(type);
        return dependType != null ? dependType.isFolder() : false;
    }
    
    /**
     * Check for array dependency type enum
     *
     *   array dependencies are declared like : '{dependencyType} : [ {extClass}, {extClass}]'
     *   string dependencies are declared like : '{dependencyType} : "{extClass}"'
     *   
     * @param String type
     * @return Boolean
     */
    public Boolean isArrayDependencyType(String type) {
        DependTypeEnum dependType = this.config.getDependTypeEnums().get(type);
        return dependType != null ? dependType.isArrayProperty() : false;
    }
    
    /**
     * Check for include ext class
     * 
     *   include/exclude ext classes and sub-classes
     *   collect known ext classes definitions for re-use
     *   
     *   example : include 'Ext.ux' but exclude 'Ext'
     * 
     * @param String extClass
     * @return Boolean default true
     */
    public Boolean isIncludeExtClass(String extClass){
        Boolean include = config.getExtClasses().get(extClass);
        String extClassTree = extClass;
        int i = extClass.lastIndexOf(".");

        if (include != null && include == true) {
            i = -1;
        }
        
        while (i != -1) {
            extClassTree = extClassTree.substring(0, i);
            include = config.getExtClasses().get(extClassTree);
            i = extClassTree.lastIndexOf(".");
            if (include != null) {
                i = -1;
            }
        }
        
        if (include != null) { // collect for re-use
            config.getExtClasses().put(extClass, include);
        }

        return include != null ? include : true;
    }
    
    /**
     * Get dependent ext classes by dependency type
     * 
     * @param extClass
     * @param type
     * @param filteredCode
     * @return ArrayList<String> depExtClasses
     */
    public List<String> getDependentExtClassesByType(String extClass, String type, String filteredCode) {
        Pattern depPattern;
        Matcher depMatcher;
        List<String> depMatches;
        Pattern extClassPattern;
        ArrayList<String> depExtClasses = new ArrayList<String>();

        if (isArrayDependencyType(type)) {
            depPattern = Pattern.compile(type + "\\:\\[(.*?)\\]");
            depMatcher = depPattern.matcher(filteredCode);
            depMatches = new ArrayList<String>();

            while(depMatcher.find()) {
                depMatches.add(depMatcher.group(1));
            }

            extClassPattern = Pattern.compile("'([^' ]+)'");

            for(String dep : depMatches) {
                Matcher extClassMatcher = extClassPattern.matcher(dep.replaceAll("\"","'"));
                while(extClassMatcher.find()) { 
                    String depExtClass = extClassMatcher.group().replaceAll("\'", "");
                    
                    if (isIncludeExtClass(depExtClass)) {
                        String depExtClassPrefix = isFolderDependencyType(type) 
                                ? getDependencyTypeFolder(type) + "." : "";
                        depExtClass = depExtClass.startsWith(this.config.getAppName()) 
                                ? depExtClass : depExtClassPrefix + depExtClass;
                        depExtClasses.add(depExtClass);
                    }
                }
            }            
        } else {
            depPattern = Pattern.compile(type + "\\:\\'(.*?)\\'");
            depMatcher = depPattern.matcher(filteredCode.replaceAll("\"","'"));
            depMatches = new ArrayList<String>();

            while(depMatcher.find()) {
                String depExtClass = depMatcher.group(1);
                if (isIncludeExtClass(depExtClass)) {
                    depExtClasses.add(depExtClass);
                }
            }
        }

        return depExtClasses;
    }
    
    public List<String> getDependentExtClasses(ExtSourceFile sourceFile) {
        List<String> depExtClasses = new ArrayList<String>();
        for (Entry<String, Boolean> depType : this.config.getDependTypes().entrySet()) {
            if (depType.getValue()) {
                List<String> currDepExtClasses = getDependentExtClassesByType(sourceFile.getExtClass(), 
                        depType.getKey(), sourceFile.getFilteredContents());
                depExtClasses.addAll(currDepExtClasses);
            }
        }
        
        // remove duplicate dependencies
        List<String> deduppedDepExtClasses = new ArrayList<String>(new LinkedHashSet<String>(depExtClasses));
        int numDuplicates = depExtClasses.size() - deduppedDepExtClasses.size();
        if (numDuplicates > 0){
            printMsg("Ext class '" + sourceFile.getExtClass() + "' has " + numDuplicates + 
                    " duplicate dependencies. File : " + sourceFile.getWebPath() + "\n", "warning");
            this.main.warnings++;
        }

        return deduppedDepExtClasses;
    }

    public Boolean isResolvedPath(String extClass) {
        String currPath = config.getPaths().get(extClass);
        if (currPath != null) {
            return true;
        }
        return false;
    }
    
    /**
     * Resolve path by ext class tree
     * 
     *   using path map
     *   collect known ext classes paths for re-use
     * 
     * @param String extClass
     * 
     */
    public void resolvePathByTree(String extClass) {
        String path = "";
        String currPath = config.getPaths().get(extClass);
        String extClassTree = extClass;
        String subTree = "";
        int i = extClass.lastIndexOf(".");

        while (i != -1) {
            extClassTree = extClassTree.substring(0, i);
            currPath = config.getPaths().get(extClassTree);
            i = extClassTree.lastIndexOf(".");
            if (currPath != null) {
                i = -1;
            }
        }
        
        if (currPath != null) {
            subTree = extClass.replace(extClassTree, "");
            path = currPath + subTree.replaceAll("\\.", "/");
            if (!path.endsWith(".js")) {
                path += ".js";
            }
            config.getPaths().put(extClass, path);
        }
    }
    
    /**
     * Resolve path by constructor using config
     * 
     * @param String extClass
     */
    public void resolvePathByConfig(String extClass) {
        String extClassWebPath = extClass.replaceAll("\\.", "/") + ".js";

        extClassWebPath = extClassWebPath.startsWith(this.config.getAppName())
                ? config.getAppFolder() + extClassWebPath.replace(this.config.getAppName(), "") 
                : config.getAppFolder() + "/" + extClassWebPath;

        config.getPaths().put(extClass, extClassWebPath);        
    }
    
    /**
     * Resolve paths
     * 
     * - resolve new ext class paths
     * - collect to known ext class paths in path map
     * 
     * @param String extClasses
     */
    public void resolvePaths(List<String> extClasses) {
        for (String extClass : extClasses) { 
            if (!isResolvedPath(extClass)) {
                resolvePathByTree(extClass);
            }            
            if (!isResolvedPath(extClass)) {
                resolvePathByConfig(extClass);
            }
            // printMsg(config.getPaths().get(extClass));
        }
    }

    public String getExtClassFilePath(String extClass) {
        return this.main.getBasePath() + this.config.getAppFolder() + "/" + extClass.replaceAll("\\.", "/") + ".js";
    }

    public String getExtClassFileWebPath(String extClass) {
        return this.config.getAppFolder() + "/" + extClass.replaceAll("\\.", "/") + ".js";
    }



    /**
     * Process source file
     * 
     * - lookup for file path in path map
     * - get source file from source files map or create it
     * - set range
     * - find dependent ext classes
     * - process  dependent ext classes
     * 
     * @param String extClass
     * @param Integer rank
     */
    public void processSourceFile(String extClass, Integer rank) {
        String path = config.getPaths().get(extClass);
        ExtSourceFile sourceFile = sourceFiles.get(path); 
        
        // create new source file
        if (sourceFile == null) {
            if (path == null) {
                sourceFile = new ExtSourceFile(extClass, getExtClassFilePath(extClass), getExtClassFileWebPath(extClass));
                config.getPaths().put(extClass, sourceFile.getWebPath());
            } else {
                sourceFile = new ExtSourceFile(extClass, this.main.getBasePath() + path, path);
            }
            
            if (sourceFile.isFile()) {
                sourceFiles.put(sourceFile.getWebPath(), sourceFile);
            }
        }
        
        // process new/existing source file
        if (sourceFile.isEnabled()){
            if (sourceFile.isFile()) {
                // set rank
                if (sourceFile.getRank() < rank) {
                    sourceFile.setRank(rank);
                }

                // process dependencies
                List<String> depExtClasses = getDependentExtClasses(sourceFile);
                resolvePaths(depExtClasses);
                processSourceFiles(sourceFile, depExtClasses, sourceFile.getRank() + 1);

            } else {
                printMsg("File not found : " + sourceFile.getWebPath() + "\n", "error");
                this.main.errors++;
            }
        }        
        // printProgress();
    }
    
    /**
     * Process all ext dependencies
     * 
     * @param List<String> extClasses
     * @param Integer rank
     */
    public void processSourceFiles(ExtSourceFile sourceFile, List<String> extClasses, Integer rank) {

        if (this.config.isSafeRank() && this.config.getSafeRankLimit() < rank) {
            sourceFile.disable();
            printMsg("Rank limit " + this.config.getSafeRankLimit() + " has been reached. Possibly infinite loop took place.\n"
                    + "Stop processing '" + sourceFile.getExtClass() + "'. Please check dependency chain or disable safe rank.\n"
                    + "Ext class '" + sourceFile.getExtClass() + "'. File : " + sourceFile.getWebPath() + "\n", "warning");
            this.main.warnings++;

        } else {
            for (String extClass : extClasses) {
                processSourceFile(extClass, rank);
            }            
        }
    }
    
    /**
     *  Finish results
     *  
     *  - range source files
     *  - write to output file
     *   
     */
    public void finishResults() {
        try {
            String outputFilepath = this.main.getOutputFilepath();
            File file = new File(outputFilepath);
            
            // if file does not exists, then create it
            if (!file.exists()) {
                file.createNewFile();
            }
            
            FileWriter fw = new FileWriter(file.getAbsoluteFile());
            BufferedWriter bw = new BufferedWriter(fw);
            
            rangedSourceFiles.putAll(this.sourceFiles);
    
            printSection("Building ext app...");
            printMsg("-- rank : extClass --");
            
            for (Entry<String, ExtSourceFile> entry : rangedSourceFiles.entrySet()) {
                String key = entry.getKey();
                ExtSourceFile sourceFile = entry.getValue();

                if (this.main.getDelimiter()){
                    bw.write("\n\n/* ----- " + sourceFile.getWebPath() + " ----- */\n\n");
                }

                if (this.main.isMinify()) {
                    bw.write(sourceFile.getFilteredContents());
                } else {
                    bw.write(sourceFile.getContents() + "\n\n");
                }
    
                printMsg(sourceFile.getRank() + " : " + key);
            }

            bw.close();
            
            printSection("Extapp build complete!");
            printStatistics();
            
        } catch (IOException ex) {
            System.err.println(ex.getMessage());
            System.exit(1);
        }
    }

    public void init() {
        printSection("Processing source files...");

        String sourceFileWebPath = this.main.getSourceFilename();
        ExtSourceFile sourceFile = new ExtSourceFile(this.config.getAppName(), this.main.getSourceFilepath(), sourceFileWebPath);
        
        if (sourceFile.isFile()) {
            sourceFiles.put(sourceFile.getWebPath(), sourceFile);    
            List<String> depExtClasses = getDependentExtClasses(sourceFile);
            resolvePaths(depExtClasses);
            processSourceFiles(sourceFile, depExtClasses, sourceFile.getRank() + 1);
            finishResults();

        } else {
            printMsg("Source file not found : " + sourceFile.getWebPath() + "\n", "error");
            this.main.errors++;
            printSection("Extapp build failed!");
            printStatistics();
        }
    }
}
