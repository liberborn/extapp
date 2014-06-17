package net.prime.extapp;

import java.util.Comparator;
import java.util.Map;

public class ValueComparator implements Comparator<String> {

    Map<String, ExtSourceFile> base;
    public ValueComparator (Map<String, ExtSourceFile> sourceFiles) {
        this.base = sourceFiles;
    }

    // Note: this comparator imposes orderings that are inconsistent with equals.    
    public int compare(String a, String b) {
        if (base.get(a).getRank() >= base.get(b).getRank()) {
            return -1;
        } else {
            return 1;
        } // returning 0 would merge keys
    }
}


