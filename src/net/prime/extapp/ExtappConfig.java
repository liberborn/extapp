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
            // array types without folders
            put("requires", true);
            put("uses", true);
            put("includes", true); // custom type (not documented in ExtJS)

            // array types with folders
            put("controllers", true);
            put("models", true);
            put("stores", true);
            put("views", true);

            // string types
            put("extend", true);
            put("model", true);
            put("store", true);
        }
    };

    private Map<String, Boolean> extClasses = new HashMap<String, Boolean>(){
        private static final long serialVersionUID = 1L;
        {
            put("Ext", false);
        }
    };
    
    private Boolean safeRank = true; // prevent dependencies infinite loop
    private Integer safeRankLimit = 50; // maximum rank limit to stop infinite loop

    class DependTypeEnum {
        public Boolean folder;
        public String property;

        DependTypeEnum(Boolean folder, String property) {
            this.folder = folder;
            this.property = property;
        }
        
        public Boolean isFolder(){
            return folder;
        }

        public Boolean isStringProperty() {
            return property.equals("string") ? true : false;
        }
        
        public Boolean isArrayProperty() {
            return property.equals("array") ? true : false;
        }
    }

    private Map<String, DependTypeEnum> dependTypeEnums = new HashMap<String, DependTypeEnum>(){
        private static final long serialVersionUID = 1L;
        {
            put("requires", new DependTypeEnum(false, "array"));
            put("uses", new DependTypeEnum(false, "array"));
            put("includes", new DependTypeEnum(false, "array"));

            put("controllers", new DependTypeEnum(true, "array"));
            put("models", new DependTypeEnum(true, "array"));
            put("stores", new DependTypeEnum(true, "array"));
            put("views", new DependTypeEnum(true, "array"));

            put("extend", new DependTypeEnum(false, "string"));
            put("model", new DependTypeEnum(false, "string"));
            put("store", new DependTypeEnum(false, "string"));
        }
    };

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
    
    public Map<String, DependTypeEnum> getDependTypeEnums() {
        return dependTypeEnums;
    }
}
