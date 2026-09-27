package com.samaritan.websocket.config;

@org.springframework.context.annotation.Configuration(proxyBeanMethods = false)
public class JdbcClientConfiguration {

    @org.springframework.context.annotation.Bean
    @org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean(
            org.springframework.jdbc.core.simple.JdbcClient.class)
    public org.springframework.jdbc.core.simple.JdbcClient jdbcClient(javax.sql.DataSource dataSource) {
        return org.springframework.jdbc.core.simple.JdbcClient.create(dataSource);
    }
}