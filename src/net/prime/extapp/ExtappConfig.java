package net.prime.extapp;

import java.util.HashMap;
import java.util.Map;

public class ExtappConfig {

    private String name = "Demo"; // app name
    private String appFolder = "/portal";

    private Map<String, String> paths = new HashMap<String, String>();

    private Map<String, Boolean> dependTypes = new HashMap<String, Boolean>(){
        private static final long serialVersionUID = 1L;
        {
            // array types without folders
            put("requires", true);
            put("uses", true);
            put("mixins", true);
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
        public DependType dependType;

        DependTypeEnum(Boolean folder,  DependType dependType) {
            this.folder = folder;
            this.dependType = dependType;
        }
        
        public Boolean isFolder(){
            return folder;
        }

        public Boolean isArrayProperty() {
            return dependType.getValue().equals("Array") ? true : false;
        }

        public Boolean isStringProperty() {
            return dependType.getValue().equals("String") ? true : false;
        }        
    }

    private enum DependType {
        ARRAY("Array"), 
        STRING("String");
        
        private String value;
        
        private DependType(String value) {
            this.value = value;
        }
        public String getValue() {
            return value;
        }
    }
    
    private Map<String, DependTypeEnum> dependTypeEnums = new HashMap<String, DependTypeEnum>(){
        private static final long serialVersionUID = 1L;
        {
            put("requires", new DependTypeEnum(false, DependType.ARRAY));
            put("uses", new DependTypeEnum(false, DependType.ARRAY));
            put("mixins", new DependTypeEnum(false, DependType.ARRAY));
            put("includes", new DependTypeEnum(false, DependType.ARRAY));

            put("controllers", new DependTypeEnum(true, DependType.ARRAY));
            put("models", new DependTypeEnum(true, DependType.ARRAY));
            put("stores", new DependTypeEnum(true, DependType.ARRAY));
            put("views", new DependTypeEnum(true, DependType.ARRAY));

            put("extend", new DependTypeEnum(false, DependType.STRING));
            put("model", new DependTypeEnum(false, DependType.STRING));
            put("store", new DependTypeEnum(false, DependType.STRING));
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
