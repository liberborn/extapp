package net.prime.extapp;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

    /**
     * Get dependency type folder
     * 
     *   example: controllers > controller, models > model
     * 
     * @param String dependType
     * @return String
     */
    public String getDependencyTypeFolder(String dependType) {
        return dependType.substring(0, dependType.length()-1);
    }
    
    /**
     * Check for requires type enum
     * 
     *   useful to resolve path ignoring ext class type
     *   (not include in file path like 'views/View.js')
     * 
     * @param String type
     * @return String
     */
    public Boolean isRequiresExtClassType(String type) {
        return type.equals("requires") || type.equals("uses") || type.equals("includes") ? true : false;
    }
    
    /**
     * Check for include ext class
     * 
     *   useful to exclude 'Ext' classes
     * 
     * @param String extClass
     * @return String
     */
    public Boolean isIncludeExtClass(String extClass){
        for (Entry<String, Boolean> cls : this.config.getExtClasses().entrySet()) {
            if (!cls.getValue() && extClass.startsWith(cls.getKey())) {
                return false;
            }
        }
        return true;
    }
    
    public List<String> getDependentExtClassesByType(String type, String fileContents) {
        Pattern depPattern = Pattern.compile(type + "\\:(.*?)\\[(.*?)\\]");
        Matcher depMatcher = depPattern.matcher(fileContents);
        List<String> depMatches = new ArrayList<String>();

        while(depMatcher.find()) {
            depMatches.add(depMatcher.group(2).replaceAll("\\s",""));
        }

        Pattern extClassPattern = Pattern.compile("'([^' ]+)'");
        ArrayList<String> extClassMatches = new ArrayList<String>();

        for(String dep : depMatches) {
            Matcher extClassMatcher = extClassPattern.matcher(dep);
            while(extClassMatcher.find()) { 
                String extClass = extClassMatcher.group().replaceAll("\'", "");
                
                if (isIncludeExtClass(extClass)) {
                    String extClassPrefix = isRequiresExtClassType(type) ? "" : getDependencyTypeFolder(type) + ".";
                    extClass = extClass.startsWith(this.config.getAppName()) ? extClass : extClassPrefix + extClass;
                    extClassMatches.add(extClass);
                    // printMsg("extClass : " + extClass);
                }
            }
        }

        return extClassMatches;
    }
    
    public List<String> getDependentExtClasses(String fileContents) {
        List<String> dependentExtClasses = new ArrayList<String>();
        for (Entry<String, Boolean> depType : this.config.getDependTypes().entrySet()) {
            if (depType.getValue()) {
                List<String> currDepExtClasses = getDependentExtClassesByType(depType.getKey(), fileContents);
                dependentExtClasses.addAll(currDepExtClasses);
            }
        }
        resolvePaths(dependentExtClasses);
        return dependentExtClasses;
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
                sourceFile = new ExtSourceFile(getExtClassFilePath(extClass), 
                        getExtClassFileWebPath(extClass), this.main.getCharset());
                config.getPaths().put(extClass, sourceFile.getWebPath());
            } else {
                sourceFile = new ExtSourceFile(this.main.getBasePath() + path,
                        path, this.main.getCharset());
            }
            
            if (sourceFile.isFile()) {
                sourceFiles.put(sourceFile.getWebPath(), sourceFile);
            }
        }
        
        // process new/existing source file
        if (sourceFile.isFile()) {
            // set rank
            if (sourceFile.getRank() < rank) {
                sourceFile.setRank(rank);
            }

            // process dependencies
            List<String> depExtClasses = getDependentExtClasses(sourceFile.getFilteredContents());
            processSourceFiles(depExtClasses, sourceFile.getRank() + 1);

        } else {
            printMsg("File not found : " + sourceFile.getWebPath() + "\n", "error");
        }
        
        // printProgress();
    }
    
    /**
     * Process all ext dependencies
     * 
     * @param List<String> extClasses
     * @param Integer rank
     */
    public void processSourceFiles(List<String> extClasses, Integer rank) {
        for (String extClass : extClasses) {
            processSourceFile(extClass, rank);
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
    
            printSection("Building ext app");
            printMsg("-- rank : extClass --");
            
            for (Entry<String, ExtSourceFile> entry : rangedSourceFiles.entrySet()) {
                String key = entry.getKey();
                ExtSourceFile sourceFile = entry.getValue();
                if (this.main.getDelimiter()){
                    bw.write("\n\n/* ----- " + sourceFile.getWebPath() + " ----- */\n\n");
                }
                bw.write(sourceFile.getContents() + "\n\n");
    
                printMsg(sourceFile.getRank() + " : " + key);
            }

            bw.close();
            
            // Get elapsed time in milliseconds
            long elapsedTimeMillis = System.currentTimeMillis() - this.main.start;
            // Get elapsed time in seconds
            float elapsedTimeSec = elapsedTimeMillis/1000F;

            printSection("Success!");
            printMsg("-- total : " + rangedSourceFiles.size() + " files");
            printMsg("-- time : " + elapsedTimeSec + " seconds\n\n\n");
            
        } catch (IOException ex) {
            System.err.println(ex.getMessage());
            System.exit(1);
        }
    }

    public void init() {
        String sourceFileWebPath = this.main.getSourceFilename();
        ExtSourceFile sourceFile = new ExtSourceFile(this.main.getSourceFilepath(), sourceFileWebPath, this.main.getCharset());
        sourceFiles.put(sourceFile.getWebPath(), sourceFile);

        List<String> dependentExtClasses = getDependentExtClasses(sourceFile.getFilteredContents());
        printSection("Processing source files");
        processSourceFiles(dependentExtClasses, sourceFile.getRank() + 1);
        finishResults();
    }
}
