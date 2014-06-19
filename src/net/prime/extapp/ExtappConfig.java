package net.prime.extapp;

import java.util.HashMap;
import java.util.Map;

public class ExtappConfig {

    private String name = "Demo"; // app name
    private String appFolder = "/portal/app";

    private Map<String, String> paths = new HashMap<String, String>();

    private Map<String, Boolean> dependTypes = new HashMap<String, Boolean>(){
        private static final long serialVersionUID = 1L;
        {
            put("requires", true);
            put("uses", true);
            put("controllers", true);
            put("models", true);
            put("stores", true);
            put("views", true);
            
            put("includes", true); // custom dependency type (not documented in ExtJS)
        }
    };

    private Map<String, Boolean> extClasses = new HashMap<String, Boolean>(){
        private static final long serialVersionUID = 1L;
        {
            put("Ext", true);
        }
    };
    
    private Boolean safeRank = true; // prevent dependencies infinite loop
    private Integer safeRankLimit = 50; // maximum rank limit to stop infinite loop
    
    public String getAppName() {
        return name;
    }
    
    public String getAppFolder() {
        return appFolder;
    }

    public Map<String, String> getPaths() {
        return paths;
    }
    
    public Map<String, Boolean> getDependTypes() {
        return dependTypes;
    }
    
    public Map<String, Boolean> getExtClasses() {
        return extClasses;
    }
    
    public Boolean isSafeRank() {
        return safeRank;
    }
    
    public Integer getSafeRankLimit() {
        return safeRankLimit;
    }
}
