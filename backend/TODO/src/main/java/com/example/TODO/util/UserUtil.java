package com.example.TODO.util;

import java.util.UUID;

public class UserUtil {

    public static String generateAnonUser() {
        return "anon_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }
}
